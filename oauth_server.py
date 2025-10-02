#!/usr/bin/env python3
"""
OAuth Server for ThreadGems
Handles Threads OAuth authentication and token management
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional

import requests
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ThreadGems OAuth Server", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "https://threadgems.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Initialize Firebase
try:
    firebase_key_path = os.getenv('FIREBASE_PRIVATE_KEY_PATH', './firebase-admin-key.json')
    if os.path.exists(firebase_key_path):
        cred = credentials.Certificate(firebase_key_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        logger.info("✅ Firebase initialized successfully")
    else:
        logger.warning("Firebase key file not found - running without Firebase")
        db = None
except Exception as e:
    logger.error(f"Firebase initialization failed: {e}")
    db = None

# Pydantic models
class AuthCallbackRequest(BaseModel):
    code: str
    redirect_uri: str

class TokenRefreshRequest(BaseModel):
    user_id: str

class ThreadsOAuthService:
    def __init__(self):
        self.client_id = os.getenv('THREADS_CLIENT_ID')
        self.client_secret = os.getenv('THREADS_CLIENT_SECRET')
        self.base_url = 'https://graph.threads.net'

        if not self.client_id or not self.client_secret:
            raise ValueError("THREADS_CLIENT_ID and THREADS_CLIENT_SECRET must be set")

    async def exchange_code_for_token(self, code: str, redirect_uri: str) -> Dict:
        """Exchange authorization code for access token"""
        url = f"{self.base_url}/oauth/access_token"

        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri,
            'code': code
        }

        try:
            response = requests.post(url, data=data, timeout=10)
            response.raise_for_status()

            result = response.json()
            logger.info(f"✅ Token exchange successful for user {result.get('user_id', 'unknown')}")

            return result
        except requests.RequestException as e:
            logger.error(f"❌ Token exchange failed: {e}")
            raise HTTPException(status_code=400, detail=f"Token exchange failed: {str(e)}")

    async def get_user_profile(self, access_token: str) -> Dict:
        """Get user profile information"""
        url = f"{self.base_url}/v1.0/me"
        params = {
            'access_token': access_token,
            'fields': 'id,username,name,threads_profile_picture_url,threads_biography'
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"❌ Profile fetch failed: {e}")
            return {}

    async def store_user_token(self, user_id: str, token_data: Dict, profile_data: Dict = None):
        """Store user token and profile in Firebase"""
        if not db:
            logger.warning("Firebase not available - skipping token storage")
            return

        try:
            user_doc = {
                'user_id': user_id,
                'access_token': token_data.get('access_token'),
                'token_created_at': datetime.utcnow(),
                'profile': profile_data or {},
                'last_updated': datetime.utcnow()
            }

            # Store in Firebase
            db.collection('users').document(user_id).set(user_doc)
            logger.info(f"✅ Stored token for user {user_id}")

        except Exception as e:
            logger.error(f"❌ Failed to store user token: {e}")

oauth_service = ThreadsOAuthService()

@app.post("/api/auth/callback")
async def auth_callback(request: AuthCallbackRequest, response: Response):
    """Handle OAuth callback and exchange code for token"""
    try:
        # Exchange code for token
        token_data = await oauth_service.exchange_code_for_token(
            request.code,
            request.redirect_uri
        )

        user_id = token_data.get('user_id')
        access_token = token_data.get('access_token')

        if not user_id or not access_token:
            raise HTTPException(status_code=400, detail="Invalid token response")

        # Get user profile
        profile_data = await oauth_service.get_user_profile(access_token)

        # Store token securely
        await oauth_service.store_user_token(user_id, token_data, profile_data)

        # Set httpOnly cookie for security
        response.set_cookie(
            key="threads_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=86400 * 30  # 30 days
        )

        return JSONResponse({
            "success": True,
            "user_id": user_id,
            "username": profile_data.get('username'),
            "message": "Authentication successful"
        })

    except Exception as e:
        logger.error(f"❌ Auth callback failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/logout")
async def logout(response: Response):
    """Logout user and clear cookies"""
    response.delete_cookie(key="threads_token")
    return {"success": True, "message": "Logged out successfully"}

@app.post("/api/auth/verify")
async def verify_token(request: Request):
    """Verify if current token is valid"""
    token = request.cookies.get("threads_token")

    if not token:
        raise HTTPException(status_code=401, detail="No token found")

    try:
        # Test token with a simple API call
        response = requests.get(
            f"{oauth_service.base_url}/v1.0/me",
            params={'access_token': token, 'fields': 'id,username'},
            timeout=5
        )

        if response.status_code == 200:
            user_data = response.json()
            return {
                "valid": True,
                "user_id": user_data.get('id'),
                "username": user_data.get('username'),
                "access_token": token
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid token")

    except Exception as e:
        logger.error(f"❌ Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Token verification failed")

@app.get("/api/auth/user")
async def get_current_user(request: Request):
    """Get current authenticated user"""
    token = request.cookies.get("threads_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        profile_data = await oauth_service.get_user_profile(token)
        return profile_data
    except Exception as e:
        logger.error(f"❌ Failed to get user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user profile")

@app.get("/api/threads/profile/{username}")
async def get_user_threads(username: str, request: Request, limit: int = 25):
    """Get threads for a specific user (requires authentication)"""
    token = request.cookies.get("threads_token")

    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        # Use the same logic from update_data.py but with user token
        url = f"{oauth_service.base_url}/v1.0/profile_posts"
        params = {
            'access_token': token,
            'username': username,
            'fields': 'id,media_product_type,media_type,media_url,permalink,username,text,topic_tag,timestamp,shortcode,thumbnail_url,is_quote_post',
            'limit': limit
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        return response.json()

    except Exception as e:
        logger.error(f"❌ Failed to fetch threads for {username}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch threads: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "firebase_connected": db is not None
    }

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "oauth_server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )