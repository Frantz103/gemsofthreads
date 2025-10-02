import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Use
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Brought to you by{" "}
            <a
              href="http://frantzstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline transition-colors"
            >
              Frantz Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;