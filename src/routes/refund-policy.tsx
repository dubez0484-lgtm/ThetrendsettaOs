import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Receipt, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — THETRENDSETTA OS" },
      {
        name: "description",
        content:
          "14-day action-based refund guarantee for THETRENDSETTA OS. Payments are processed by Paystack. Your statutory rights under the SA CPA and ECT Act remain unaffected.",
      },
      { property: "og:title", content: "Refund Policy — THETRENDSETTA OS" },
      {
        property: "og:description",
        content:
          "14-day action-based guarantee, Paystack payment processing and clear refund request steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-6 md:p-7">
      <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function RefundPolicyPage() {
  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 size-[40rem] rounded-full bg-primary/15 blur-3xl" />

      <header className="relative z-10 border-b border-white/5">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center">
              <Sparkles className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">
              TRENDSETTA<span className="text-primary">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-xl glass grid place-items-center">
            <Receipt className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Legal</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Refund Policy</h1>
          </div>
        </div>

        <div className="glass rounded-xl border-primary/30 px-4 py-3 text-xs text-primary mb-8">
          DRAFT — placeholder content pending founder/legal review, not reviewed by an attorney.
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          Last updated: 26 August 2026. This policy applies to all digital products, subscriptions and
          plans sold by THETRENDSETTA (PTY) LTD, a company registered in South Africa.
        </p>

        <div className="space-y-5">
          <Section title="1. The 14-day action-based guarantee">
            <p>
              You have 14 days from the date of purchase to request a refund, provided you can show you
              actually used the product. This is an action-based guarantee, not a no-questions-asked
              one: we ask for proof of implementation because the system only works when it is used.
            </p>
            <p>Acceptable proof of action includes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>At least one funnel or capture page created inside your workspace.</li>
              <li>At least one AI Studio generation saved or exported.</li>
              <li>Screenshots or a short description of what you built and what didn't work.</li>
            </ul>
          </Section>

          <Section title="2. Payment processing (Paystack)">
            <p>
              All card and Instant EFT payments are processed by Paystack. We do not store your full
              card details. Approved refunds are issued through Paystack back to the original payment
              method — we cannot refund to a different card, account or wallet.
            </p>
          </Section>

          <Section title="3. How to request a refund">
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>
                Email{" "}
                <a href="mailto:hello@thetrendsetta.com" className="text-primary hover:underline">
                  hello@thetrendsetta.com
                </a>{" "}
                with the subject line "Refund Request".
              </li>
              <li>Include the email address on your account and your Paystack reference or invoice number.</li>
              <li>Include your proof of action (see section 1) and a short reason for the request.</li>
              <li>We acknowledge within 2 business days and give a decision within 5 business days.</li>
              <li>
                Approved refunds are processed within 5–10 business days back to the original payment
                method. Your bank may take additional time to reflect the credit.
              </li>
            </ol>
          </Section>

          <Section title="4. Subscriptions and renewals">
            <p>
              You can cancel a subscription at any time from Billing &amp; Plans. Cancellation stops
              future charges and access continues until the end of the paid period. Renewal charges are
              not refundable after the 14-day window of that renewal, unless a verified technical
              failure on our side prevented access.
            </p>
          </Section>

          <Section title="5. What is not refundable">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Requests made more than 14 days after purchase.</li>
              <li>Requests with no evidence that the product was used.</li>
              <li>Consumed usage-based credits (for example AI generations already spent).</li>
              <li>Purchases where terms were breached, including account sharing or content resale.</li>
            </ul>
          </Section>

          <Section title="6. Technical failure on our side">
            <p>
              If a verified defect on our platform prevented you from accessing what you paid for and we
              cannot resolve it within a reasonable period, you are entitled to a full refund regardless
              of the proof-of-action requirement.
            </p>
          </Section>

          <Section title="7. Your statutory consumer rights (CPA and ECT Act)">
            <p>
              Nothing in this policy limits your rights under South African law. Under the Consumer
              Protection Act 68 of 2008 you may have rights to return goods or cancel agreements in
              defined circumstances, and under section 44 of the Electronic Communications and
              Transactions Act 25 of 2002 consumers have a cooling-off right for certain electronic
              transactions. Note that the ECT Act cooling-off right does not apply to digital content
              that has been accessed, downloaded or consumed. Where our guarantee is more generous than
              the statutory minimum, the guarantee applies; where the law gives you more, the law
              applies.
            </p>
          </Section>

          <Section title="8. Chargebacks">
            <p>
              Please contact us before opening a chargeback. Fraudulent chargebacks may result in
              immediate account suspension and recovery of costs.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              Refund requests and questions:{" "}
              <a href="mailto:hello@thetrendsetta.com" className="text-primary hover:underline">
                hello@thetrendsetta.com
              </a>
              . Governing law: Republic of South Africa.
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
