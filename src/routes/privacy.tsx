import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Lock, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — THETRENDSETTA OS" },
      {
        name: "description",
        content:
          "How THETRENDSETTA OS collects, stores and protects personal information such as emails and lead data, in line with South Africa's POPIA.",
      },
      { property: "og:title", content: "Privacy Policy — THETRENDSETTA OS" },
      {
        property: "og:description",
        content:
          "How THETRENDSETTA OS collects, stores and protects your personal information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-6 md:p-7">
      <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPage() {
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
            <Lock className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Legal</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
        </div>

        <div className="glass rounded-xl border-primary/30 px-4 py-3 text-xs text-primary mb-8">
          DRAFT — placeholder content pending founder/legal review, not reviewed by an attorney.
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          Last updated: 26 August 2026. This policy explains how THETRENDSETTA (PTY) LTD ("we", "us"),
          a company registered in South Africa, handles personal information collected through
          THETRENDSETTA OS and related pages.
        </p>

        <div className="space-y-5">
          <Section title="1. Information we collect">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Account data: name, email address, password hash, workspace details.</li>
              <li>Lead data: emails and form fields submitted to capture pages you publish.</li>
              <li>Billing data: plan, transaction references and status from our payment processor.</li>
              <li>Usage data: pages visited, feature events, device/browser info, IP address.</li>
              <li>Content you create: funnels, AI prompts and generated output, documents and files.</li>
            </ul>
          </Section>

          <Section title="2. How we use it">
            <p>
              To provide and secure the platform, authenticate you, deliver purchased features, process
              payments, send service and transactional emails, provide support, prevent abuse, and
              improve the product through aggregated analytics.
            </p>
          </Section>

          <Section title="3. Legal basis and consent">
            <p>
              We process personal information under the Protection of Personal Information Act (POPIA)
              on the basis of contract performance, legitimate interest, or your consent. Marketing
              emails are sent only where you have opted in, and every marketing email includes an
              unsubscribe link.
            </p>
          </Section>

          <Section title="4. Leads you collect">
            <p>
              When you use lead capture or funnel features, you are the responsible party for the
              personal information of the people who submit your forms, and we act as an operator on
              your behalf. You must have a lawful basis to collect that data and honour opt-out
              requests from your own subscribers.
            </p>
          </Section>

          <Section title="5. Sharing and processors">
            <p>
              We do not sell personal information. We share it only with service providers necessary to
              run the platform — cloud hosting and database providers, our payment processor (Paystack),
              email delivery providers, and AI model providers used to generate content you request.
              Each processes data only on our instructions.
            </p>
          </Section>

          <Section title="6. Storage, retention and security">
            <p>
              Data is stored on managed cloud infrastructure with encryption in transit and access
              controls, including row-level database policies that isolate each workspace. We retain
              account and lead data while your account is active and for a reasonable period afterwards
              to meet legal and accounting obligations, then delete or anonymise it.
            </p>
          </Section>

          <Section title="7. International transfers">
            <p>
              Some providers process data outside South Africa. Where that happens we rely on providers
              that offer protections comparable to POPIA.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>
              You may request access to, correction of, or deletion of your personal information, object
              to processing, or withdraw consent. Email{" "}
              <a href="mailto:hello@thetrendsetta.com" className="text-primary hover:underline">
                hello@thetrendsetta.com
              </a>{" "}
              and we will respond within a reasonable period. You may also lodge a complaint with the
              South African Information Regulator.
            </p>
          </Section>

          <Section title="9. Cookies and local storage">
            <p>
              We use cookies and browser storage to keep you signed in, remember preferences and measure
              page and funnel performance. Blocking them may break sign-in and other core features.
            </p>
          </Section>

          <Section title="10. Children">
            <p>
              The platform is not intended for anyone under 18. We do not knowingly collect data from
              children.
            </p>
          </Section>

          <Section title="11. Changes and contact">
            <p>
              We may update this policy and will post the new date at the top. Questions or privacy
              requests:{" "}
              <a href="mailto:hello@thetrendsetta.com" className="text-primary hover:underline">
                hello@thetrendsetta.com
              </a>
              .
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
