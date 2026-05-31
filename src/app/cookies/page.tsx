import type { Metadata } from "next";

import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookies - Snapingly",
  description:
    "Snapingly cookie and local storage disclosure for essential auth cookies and editor preferences.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies"
      description="Snapingly uses only essential auth cookies and a local editor preference in this milestone."
    >
      <h2>Essential auth cookies</h2>
      <p>
        When you sign in, Supabase Auth stores session cookies so the app can
        keep you signed in and identify you on account, export, and billing
        routes. These cookies are necessary for the service you request, so
        Snapingly does not show a consent banner for them.
      </p>

      <h2>Local storage</h2>
      <p>
        The editor may store your theme preference, such as light or dark mode,
        in browser local storage. This does not contain screenshots, account
        secrets, billing data, or image content. You can change the theme from
        the editor header or clear site data in your browser.
      </p>

      <h2>No tracking cookies</h2>
      <p>
        Snapingly does not use analytics cookies, ad cookies, heatmaps,
        telemetry cookies, embedded social tracking widgets, or marketing
        pixels in this milestone.
      </p>

      <h2>If this changes</h2>
      <p>
        If Snapingly later adds non-essential analytics, ads, tracking, or
        marketing cookies for EU/UK users, those tools must stay off until the
        user has made a consent choice.
      </p>
    </LegalPage>
  );
}
