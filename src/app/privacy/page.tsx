import type { Metadata } from "next";

import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy - Snapingly",
  description:
    "How Snapingly handles account data, local-only screenshots, billing metadata, and export metadata.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Snapingly is built around a local-first screenshot workflow. This draft explains the data needed for accounts, exports, and future billing."
    >
      <h2>What we collect</h2>
      <p>
        If you create an account, we store basic account details from Supabase
        Auth: your user id, email address, name, avatar URL if provided by
        Google, and account timestamps. If paid billing is enabled later, we
        will store subscription and quota metadata needed to unlock paid
        features.
      </p>

      <h2>What we do not collect</h2>
      <p>
        We do not store your screenshot files, image blobs, object URLs, base64
        image data, or generated PNG exports. Screenshot editing and rendering
        happen in your browser.
      </p>

      <h2>Why we use this data</h2>
      <p>
        Account data is used to sign you in, protect export and billing routes,
        apply free or paid entitlements, prevent quota abuse, and provide
        support. We do not use this milestone for analytics, ads, telemetry,
        tracking pixels, or marketing profiles.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        Supabase Auth uses essential cookies to keep you signed in and secure
        account-related routes. The editor may store your light or dark theme
        preference in local storage. See the Cookies page for details.
      </p>

      <h2>Service providers</h2>
      <p>
        Supabase provides authentication and database services. Dodo Payments
        may process checkout, subscription, and payment data when paid plans are
        connected later. Snapingly does not receive full card details.
      </p>

      <h2>Your choices</h2>
      <p>
        You can sign out at any time. To request account deletion or privacy
        help, contact support@snapingly.com. Legal text should be reviewed
        before paid launch.
      </p>
    </LegalPage>
  );
}
