import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>

          <p className="text-muted-foreground mb-6">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Curated Threads, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p className="mb-4">
              Curated Threads is a web application that aggregates and displays public Threads posts focused on design and UI topics. Our service:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Displays public content from Meta's Threads platform</li>
              <li>Curates content related to design, UI, and creative topics</li>
              <li>Provides filtering and discovery features for public Threads posts</li>
              <li>Does not create or own the displayed content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="mb-4">Users of our service agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Respect the intellectual property rights of content creators</li>
              <li>Not attempt to reverse engineer, hack, or compromise our service</li>
              <li>Not use automated tools to access our service without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Content and Intellectual Property</h2>
            <p className="mb-4">
              All Threads content displayed on our platform remains the property of its original creators and Meta Platforms, Inc. We do not claim ownership of any user-generated content displayed through our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">
              Our service relies on Meta's Threads API. Your use of our service is also subject to Meta's Terms of Service and Community Guidelines. We are not responsible for changes to third-party services that may affect our functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="mb-4">
              This service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or availability of the content displayed through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Curated Threads or Frantz Studio be liable for any indirect, incidental, special, or consequential damages arising from the use of this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p className="mb-4">
              We strive to maintain service availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Material changes will be communicated through our website. Continued use of the service constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction where Frantz Studio operates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Use, please contact us through our website at{" "}
              <a href="http://frantzstudio.com" className="text-primary hover:underline">
                Frantz Studio
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;