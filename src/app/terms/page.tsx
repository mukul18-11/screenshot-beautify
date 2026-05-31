import type { Metadata } from "next";

import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms - Snapingly",
  description:
    "Draft terms for using Snapingly before final paid launch legal review.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These draft terms cover the current local-first editor and should be reviewed before paid launch."
    >
      <h2>Using Snapingly</h2>
      <p>
        Snapingly helps you turn screenshots into launch-ready visuals. You are
        responsible for the screenshots, text, and assets you use in the editor
        and for making sure you have the rights to use them.
      </p>

      <h2>Local-first editor</h2>
      <p>
        The current editor processes screenshots in your browser. Snapingly does
        not promise that generated visuals will improve business, marketing, or
        revenue outcomes.
      </p>

      <h2>Accounts and paid features</h2>
      <p>
        Free exports may include the &quot;Made with Snapingly&quot; watermark. Paid
        pricing, subscription terms, quota rules, refund rules, and feature
        packaging are still to be finalized before paid launch.
      </p>

      <h2>Availability</h2>
      <p>
        Snapingly may change, pause, or remove features as the product evolves.
        We will aim to keep the editor fast, private, and simple.
      </p>

      <h2>Contact</h2>
      <p>
        For support or legal questions, contact support@snapingly.com.
      </p>
    </LegalPage>
  );
}
