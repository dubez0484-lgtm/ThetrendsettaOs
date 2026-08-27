import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

/**
 * PayFast checkout initiator.
 * Builds a signed redirect URL to PayFast's hosted checkout.
 * Requires env vars:
 *   - PAYFAST_MERCHANT_ID
 *   - PAYFAST_MERCHANT_KEY
 *   - PAYFAST_PASSPHRASE (optional but recommended)
 *   - PAYFAST_SANDBOX ("true" to use sandbox URL)
 */
export const Route = createFileRoute("/api/payfast-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { plan?: string; amount?: number };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const plan = String(body.plan ?? "").slice(0, 80);
        const amount = Number(body.amount);
        if (!plan || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
          return new Response("Invalid plan or amount", { status: 400 });
        }

        const merchantId = process.env.PAYFAST_MERCHANT_ID;
        const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
        const passphrase = process.env.PAYFAST_PASSPHRASE ?? "";
        const sandbox = process.env.PAYFAST_SANDBOX === "true";

        if (!merchantId || !merchantKey) {
          return new Response(
            JSON.stringify({
              error:
                "PayFast not configured. Set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY in project secrets.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const origin = new URL(request.url).origin;

        // Field order matters for signature.
        const fields: Record<string, string> = {
          merchant_id: merchantId,
          merchant_key: merchantKey,
          return_url: `${origin}/billing?status=success`,
          cancel_url: `${origin}/billing?status=cancelled`,
          notify_url: `${origin}/api/payfast-notify`,
          amount: amount.toFixed(2),
          item_name: `THETRENDSETTA™ — ${plan}`,
        };

        const sigBase =
          Object.entries(fields)
            .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
            .join("&") + (passphrase ? `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}` : "");

        const signature = createHash("md5").update(sigBase).digest("hex");

        const base = sandbox
          ? "https://sandbox.payfast.co.za/eng/process"
          : "https://www.payfast.co.za/eng/process";

        const params = new URLSearchParams({ ...fields, signature });
        const redirect = `${base}?${params.toString()}`;

        return new Response(JSON.stringify({ redirect }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
