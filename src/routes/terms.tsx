import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — TRENDSETTA (PTY) LTD" },
      {
        name: "description",
        content:
          "Terms and Conditions for the TRENDSETTA platform, operated by THETRENDSETTA (PTY) LTD, South Africa. Payments processed via PayFast.",
      },
      { property: "og:title", content: "Terms & Conditions — TRENDSETTA" },
      {
        property: "og:description",
        content:
          "Terms and Conditions for the TRENDSETTA platform, operated by THETRENDSETTA (PTY) LTD, South Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
              Legal
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Terms & Conditions
            </h1>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 md:p-5 mb-10 flex items-start gap-3 border-l-2 border-l-primary/60">
          <span className="mt-0.5 inline-block rounded-md bg-primary/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary shrink-0">
            Draft
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">DRAFT</span> —
            placeholder content pending founder/legal review, not reviewed by an
            attorney. Do not rely on this text for compliance. Final terms will
            replace this notice once approved.
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-10">
          Last updated: 26 August 2026
        </p>

        <div className="space-y-10">
          <Section n="1" title="Business & Contact">
            <p>
              These Terms and Conditions ("Terms") govern your access to and use
              of the TRENDSETTA platform, including all websites, software,
              applications, and digital tools operated by{" "}
              <span className="text-foreground font-medium">
                THETRENDSETTA (PTY) LTD
              </span>{" "}
              ("THETRENDSETTA", "we", "us", or "our"), a company registered in
              the Republic of South Africa.
            </p>
            <p>
              By creating an account or using any of our services, you confirm
              that you have read, understood, and agree to be bound by these
              Terms. If you do not agree, you must not access or use the
              platform.
            </p>
          </Section>

          <Section n="2" title="Description of Services">
            <p>
              THETRENDSETTA provides a software-as-a-service (SaaS) platform
              offering digital tools and products for creators and businesses,
              including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-primary/60">
              <li>AI Studio for content, copy and funnel generation</li>
              <li>Funnel builder and public page publishing</li>
              <li>Lead magnet, PDF and content automation tools</li>
              <li>CRM, analytics and dashboard reporting</li>
              <li>Subscription plans and billing management</li>
            </ul>
            <p>
              We may add, modify, or discontinue features at any time without
              prior notice. New features may be subject to additional terms.
            </p>
          </Section>

          <Section n="3" title="User Responsibilities & Acceptable Use">
            <p>You agree to use the platform only for lawful purposes and to:</p>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-primary/60">
              <li>Provide accurate, current account and billing information</li>
              <li>Keep your credentials secure and confidential</li>
              <li>Be responsible for all activity under your account</li>
              <li>Respect intellectual property and not reproduce copyrighted material unlawfully</li>
              <li>Not attempt to reverse-engineer, disrupt, or overload the service</li>
              <li>Not use the platform for fraud, spam, or any illegal activity</li>
            </ul>
            <p>
              Violation of these rules may result in suspension or termination
              of your account without refund, at our sole discretion.
            </p>
          </Section>

          <Section n="4" title="Payment Terms">
            <p>
              Paid subscriptions and one-off purchases are processed through{" "}
              <span className="text-foreground font-medium">PayFast</span>, our
              authorized South African payment gateway. PayFast handles the
              secure transmission of your payment details; we do not store your
              full card or banking credentials.
            </p>
            <p>
              By initiating a payment you authorise PayFast to charge the
              selected payment method for the amount shown, including any
              recurring subscription fees until cancellation. Prices are
              displayed in South African Rand (ZAR) unless otherwise stated and
              may include applicable taxes.
            </p>
            <p>
              You may cancel a subscription at any time from your billing
              settings. Cancellation stops future renewals; access continues
              until the end of the current billing period. See our{" "}
              <Link to="/refund-policy" className="text-primary hover:underline">
                Refund Policy
              </Link>{" "}
              for details on refund eligibility.
            </p>
          </Section>

          <Section n="5" title="Limitation of Liability">
            <p>
              The platform is provided on an "as is" and "as available" basis.
              To the maximum extent permitted by South African law, THETRENDSETTA
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of, or inability to
              use, the platform.
            </p>
            <p>
              We do not warrant that the service will be uninterrupted,
              error-free, or secure, or that results generated by AI tools will
              be accurate or fit for a particular purpose. You are responsible
              for reviewing all AI-generated output before publishing or relying
              on it.
            </p>
            <p>
              Our total aggregate liability for any claim shall not exceed the
              amount you paid us in the three (3) months preceding the event
              giving rise to the claim.
            </p>
          </Section>

          <Section n="6" title="Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the Republic of South Africa. Any dispute arising out of
              or in connection with these Terms shall be subject to the
              exclusive jurisdiction of the competent courts of South Africa.
            </p>
          </Section>

          <Section n="7" title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. The "Last updated"
              date above reflects the most recent revision. Continued use of the
              platform after changes take effect constitutes acceptance of the
              revised Terms.
            </p>
          </Section>
        </div>

        <div className="mt-14 pt-8 border-t border-white/5 text-sm text-muted-foreground">
          <p>
            Questions about these Terms? Email{" "}
            <a
              href="mailto:support@thetrendsetta.com"
              className="text-primary hover:underline"
            >
              support@thetrendsetta.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`section-${n}`} className="scroll-mt-20">
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-foreground mb-3">
        <span className="size-7 rounded-lg glass grid place-items-center text-xs font-bold text-primary">
          {n}
        </span>
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground pl-10">
        {children}
      </div>
    </section>
  );
}
