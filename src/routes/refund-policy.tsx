import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Receipt, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

const CONTACT_EMAIL = "Info@thetrendsettaofficial.co.za";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — THETRENDSETTA OS" },
      {
        name: "description",
        content:
          "14-day action-based refund guarantee for THETRENDSETTA OS. Payments are processed by PayFast. Your statutory rights under the SA CPA and ECT Act remain unaffected.",
      },
      { property: "og:title", content: "Refund Policy — THETRENDSETTA OS" },
      {
        property: "og:description",
        content:
          "14-day action-based guarantee, PayFast payment processing and clear refund request steps.",
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

function MailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline break-all">
      {CONTACT_EMAIL}
    </a>
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
          This policy is a plain-language summary, not legal advice. It is pending review by a
          qualified South African attorney.
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          Last updated: 27 October 2026. This policy applies to digital products, subscriptions and
          plans sold by THETRENDSETTA (PTY) LTD, a company registered in South Africa. Prices are in
          South African Rand (ZAR).
        </p>

        <div className="space-y-5">
          <Section title="1. The 14-day action-based guarantee">
            <p>
              You may request a refund within 14 days of purchase under our guarantee, provided you
              can show you made a genuine attempt to use the product. This is an action-based
              guarantee, not a no-questions-asked one: the system only works when it is used, so we
              ask for evidence of implementation. The guarantee is a contractual promise in addition
              to your legal rights. It does not replace or reduce them (see section 7).
            </p>
            <p>Acceptable evidence of implementation includes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>At least one funnel or capture page created inside your workspace.</li>
              <li>At least one AI Studio generation saved or exported.</li>
              <li>
                Screenshots or a short description of what you built and any problems you ran into.
              </li>
            </ul>
            <p>
              If a problem on our side stopped you from using the product, you do not need to meet
              this evidence requirement. See section 6.
            </p>
          </Section>

          <Section title="2. Payments and refunds via PayFast">
            <p>
              Payments for plans on this website are processed by PayFast, which supports card and
              Instant EFT payments. You complete payment on PayFast's payment page.
            </p>
            <p>
              Approved refunds are issued in line with how your original payment was made and what
              PayFast's requirements allow, normally back to the original payment method. We cannot
              always refund to a different card, account or wallet. We cannot promise a specific
              date, because processing times depend on PayFast and your bank.
            </p>
          </Section>

          <Section title="3. How to request a refund">
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>
                Email <MailLink /> with the subject line "Refund Request".
              </li>
              <li>Include the email address on your account.</li>
              <li>Include your PayFast reference or invoice number.</li>
              <li>
                Include your evidence of implementation (see section 1), where the guarantee is what
                you are relying on.
              </li>
              <li>Include a brief explanation of why you are asking for a refund.</li>
            </ol>
            <p>Our service targets are:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We aim to acknowledge your request within 2 business days.</li>
              <li>We aim to give you a decision within 5 business days.</li>
              <li>
                Where a refund is approved, we aim to process it within 5–10 business days, subject
                to verification and PayFast and bank processing times.
              </li>
            </ul>
          </Section>

          <Section title="4. Subscriptions, cancellation and renewals">
            <p>
              <span className="text-foreground font-medium">How to cancel.</span> Email <MailLink />{" "}
              from your account email address with the subject line "Subscription Cancellation" and
              the name of your plan. We will confirm once it is processed.
            </p>
            <p>
              <span className="text-foreground font-medium">When it takes effect.</span>{" "}
              Cancellation takes effect at the end of the period you have already paid for. Your
              access continues until then, and you will not be charged for a further period once
              your cancellation has been processed.
            </p>
            <p>
              <span className="text-foreground font-medium">Recurring payments.</span> If a plan
              renews automatically, the renewal terms are shown to you before you pay. If you are
              charged after we have confirmed your cancellation, we will review it and refund the
              charge where it was made in error.
            </p>
            <p>
              <span className="text-foreground font-medium">Renewal refunds.</span> A renewal charge
              is assessed on the same basis as an initial purchase if you ask within 14 days of that
              charge. Requests made later are not rejected automatically. We assess them
              individually, including billing errors, charges after a valid cancellation, technical
              failures and your statutory rights.
            </p>
          </Section>

          <Section title="5. Used credits and alleged breaches">
            <p>
              Usage-based credits that have already been consumed (for example, AI generations that
              worked as intended) are generally not refundable under the guarantee, because that
              part of the service has been delivered. This does not apply where a generation failed
              or could not be used because of a defect on our side. In that case we will restore the
              credit or consider a refund.
            </p>
            <p>
              Where we believe the Terms were breached, for example by account sharing or by
              reselling content in a way the Terms do not allow, we will tell you what we found and
              give you a chance to respond before we decide. If a breach is established, we may
              decline a guarantee refund.
            </p>
            <p>These provisions do not limit any right or remedy that the law gives you.</p>
          </Section>

          <Section title="6. Technical failure on our side">
            <p>
              If a verified defect on our platform prevents you from accessing what you paid for and
              we cannot resolve it within a reasonable period, we will provide the remedy that fits
              the situation and the law. That may be a fix, a credit or extension of your access, or
              a refund for the affected period, and a full refund where you have been unable to use
              the service at all.
            </p>
            <p>
              The evidence-of-implementation requirement in section 1 will not be used to refuse a
              valid technical-failure claim.
            </p>
          </Section>

          <Section title="7. Your statutory consumer rights">
            <p>
              Nothing in this policy limits your rights under South African law, including the
              Consumer Protection Act 68 of 2008 (for example, your rights where services are not
              performed with reasonable care and skill) and the Electronic Communications and
              Transactions Act 25 of 2002.
            </p>
            <p>
              Section 44 of the Electronic Communications and Transactions Act gives consumers a
              right to cancel certain electronic transactions within seven days, and where it
              applies, a refund of payment made. That right is subject to statutory exceptions,
              including for services that began with the consumer's consent before the seven days
              ended. Whether it applies to a particular purchase depends on the facts, so we assess
              each request on its own merits.
            </p>
            <p>
              Where our guarantee gives you more than the law requires, the guarantee applies. Where
              the law gives you more, the law applies.
            </p>
          </Section>

          <Section title="8. Billing disputes and chargebacks">
            <p>
              If something looks wrong with a charge, please contact us at <MailLink /> first. Most
              billing problems can be resolved quickly. You also remain free to raise a dispute with
              your bank or card issuer, and we do not treat a good-faith dispute as fraud.
            </p>
            <p>
              If a dispute is opened, we may share the relevant account and payment records with
              PayFast and your bank to respond to it. Any account restriction or recovery of costs
              will be based on the facts of the case, our Terms and applicable law.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              Refund requests and questions: <MailLink />. See also our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              . Governing law: Republic of South Africa.
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
