import LegalPageLayout from "../components/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="April 18, 2025">
      <p>
        At GutTalks, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
      </p>

      <h2>Information We Collect</h2>
      <p>We may collect personal information that you voluntarily provide to us when you:</p>
      <ul>
        <li>Register for an account</li>
        <li>Book a consultation</li>
        <li>Fill out health questionnaires</li>
        <li>Contact customer support</li>
      </ul>
      <p>This information may include your name, email address, phone number, payment information, and health-related information you choose to share.</p>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Facilitate consultation bookings and payments</li>
        <li>Provide personalized health recommendations</li>
        <li>Communicate with you about your appointments</li>
        <li>Improve our services and user experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>Data Security</h2>
      <p>We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. However, no method of transmission over the Internet is 100% secure.</p>

      <h2>Third-Party Services</h2>
      <p>We use trusted third-party services including Razorpay for payments and Zoom for video consultations. These services have their own privacy policies governing the use of your information.</p>

      <h2>Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal information. You may also withdraw consent for certain data processing activities. To exercise these rights, please contact us at <strong>hello@guttalks.com</strong>.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at <strong>hello@guttalks.com</strong> or call <strong>+91 98765 43210</strong>.</p>
    </LegalPageLayout>
  );
}