import { useEffect, useState } from "react";
import type { Section } from "./sections";

type Props = {
  section: Section;
  editable?: boolean;
  onChange?: (s: Section) => void;
  onTrack?: (event: "optin" | "click", metadata?: Record<string, unknown>) => void;
};

function Editable({
  value, onChange, editable, className, multiline, placeholder,
}: { value: string; onChange?: (v: string) => void; editable?: boolean; className?: string; multiline?: boolean; placeholder?: string }) {
  if (!editable) {
    return multiline
      ? <div className={className} style={{ whiteSpace: "pre-wrap" }}>{value || placeholder}</div>
      : <span className={className}>{value || placeholder}</span>;
  }
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange?.(e.currentTarget.innerText)}
      className={`${className} outline-none focus:bg-primary/5 rounded px-1 -mx-1 transition`}
      data-placeholder={placeholder}
    >
      {value}
    </span>
  );
}

export function SectionRenderer({ section, editable, onChange, onTrack }: Props) {
  const set = (key: string, val: unknown) => {
    if (onChange) onChange({ ...(section as Record<string, unknown>), [key]: val } as Section);
  };

  switch (section.type) {
    case "hero":
      return (
        <section className="px-6 py-20 md:py-28 text-center bg-gradient-to-b from-primary/10 via-transparent to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block text-xs tracking-widest text-primary mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
              <Editable editable={editable} value={section.eyebrow} onChange={(v) => set("eyebrow", v)} placeholder="EYEBROW" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              <Editable editable={editable} value={section.headline} onChange={(v) => set("headline", v)} placeholder="Headline" />
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground">
              <Editable editable={editable} value={section.sub} onChange={(v) => set("sub", v)} multiline placeholder="Subheadline" />
            </p>
            <div className="mt-8">
              <a
                href={section.ctaHref || "#"}
                onClick={() => onTrack?.("click", { source: "hero" })}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium btn-glow"
              >
                <Editable editable={editable} value={section.ctaText} onChange={(v) => set("ctaText", v)} placeholder="CTA" />
              </a>
            </div>
          </div>
        </section>
      );

    case "features":
      return (
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
              <Editable editable={editable} value={section.title} onChange={(v) => set("title", v)} placeholder="Section title" />
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {section.items.map((it, i) => (
                <div key={i} className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-1">
                    <Editable editable={editable} value={it.title} onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...it, title: v }; set("items", items);
                    }} />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <Editable editable={editable} value={it.desc} multiline onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...it, desc: v }; set("items", items);
                    }} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
              <Editable editable={editable} value={section.title} onChange={(v) => set("title", v)} />
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((it, i) => (
                <div key={i} className="glass rounded-xl p-5">
                  <p className="italic text-foreground/90">
                    "<Editable editable={editable} value={it.quote} multiline onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...it, quote: v }; set("items", items);
                    }} />"
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">
                      <Editable editable={editable} value={it.name} onChange={(v) => {
                        const items = [...section.items]; items[i] = { ...it, name: v }; set("items", items);
                      }} />
                    </span>
                    <span className="text-muted-foreground"> · <Editable editable={editable} value={it.role} onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...it, role: v }; set("items", items);
                    }} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "pricing":
      return (
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
              <Editable editable={editable} value={section.title} onChange={(v) => set("title", v)} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {section.items.map((plan, i) => (
                <div key={i} className="glass-strong rounded-2xl p-6">
                  <div className="text-sm text-muted-foreground"><Editable editable={editable} value={plan.name} onChange={(v) => {
                    const items = [...section.items]; items[i] = { ...plan, name: v }; set("items", items);
                  }} /></div>
                  <div className="mt-2 mb-4">
                    <span className="text-4xl font-bold"><Editable editable={editable} value={plan.price} onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...plan, price: v }; set("items", items);
                    }} /></span>
                    <span className="text-muted-foreground"><Editable editable={editable} value={plan.period} onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...plan, period: v }; set("items", items);
                    }} /></span>
                  </div>
                  <ul className="space-y-1 text-sm mb-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="text-foreground/80">
                        ✓ <Editable editable={editable} value={f} onChange={(v) => {
                          const items = [...section.items];
                          const features = [...plan.features]; features[fi] = v;
                          items[i] = { ...plan, features }; set("items", items);
                        }} />
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onTrack?.("click", { source: "pricing", plan: plan.name })}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium btn-glow"
                  >
                    <Editable editable={editable} value={plan.cta} onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...plan, cta: v }; set("items", items);
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
              <Editable editable={editable} value={section.title} onChange={(v) => set("title", v)} />
            </h2>
            <div className="space-y-3">
              {section.items.map((it, i) => (
                <details key={i} className="glass rounded-xl p-4">
                  <summary className="font-medium cursor-pointer">
                    <Editable editable={editable} value={it.q} onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...it, q: v }; set("items", items);
                    }} />
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <Editable editable={editable} value={it.a} multiline onChange={(v) => {
                      const items = [...section.items]; items[i] = { ...it, a: v }; set("items", items);
                    }} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto glass-strong rounded-3xl p-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <Editable editable={editable} value={section.headline} onChange={(v) => set("headline", v)} />
            </h2>
            <p className="mt-3 text-muted-foreground">
              <Editable editable={editable} value={section.sub} multiline onChange={(v) => set("sub", v)} />
            </p>
            <a
              href={section.ctaHref || "#"}
              onClick={() => onTrack?.("click", { source: "cta" })}
              className="inline-block mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium btn-glow"
            >
              <Editable editable={editable} value={section.ctaText} onChange={(v) => set("ctaText", v)} />
            </a>
          </div>
        </section>
      );

    case "countdown":
      return <CountdownSection section={section} editable={editable} onChange={(v) => set("headline", v)} onTarget={(v) => set("target", v)} />;

    case "video":
      return (
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-6">
              <Editable editable={editable} value={section.title} onChange={(v) => set("title", v)} />
            </h2>
            {editable && (
              <input
                value={section.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="YouTube embed URL"
                className="w-full mb-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            )}
            <div className="relative aspect-video glass rounded-xl overflow-hidden">
              {section.url ? (
                <iframe src={section.url} className="absolute inset-0 w-full h-full" allowFullScreen />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">No video URL</div>
              )}
            </div>
          </div>
        </section>
      );

    case "form":
      return <FormSection section={section} editable={editable} onChange={(s) => onChange?.(s)} onTrack={onTrack} />;

    case "image":
      return (
        <section className="px-6 py-10">
          <div className="max-w-4xl mx-auto">
            {editable && (
              <input
                value={section.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="Image URL"
                className="w-full mb-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            )}
            {section.url ? (
              <img src={section.url} alt={section.alt} className="w-full rounded-2xl" />
            ) : (
              <div className="aspect-video glass rounded-2xl grid place-items-center text-muted-foreground text-sm">No image URL</div>
            )}
          </div>
        </section>
      );
  }
}

function CountdownSection({
  section, editable, onChange, onTarget,
}: {
  section: Extract<Section, { type: "countdown" }>;
  editable?: boolean;
  onChange: (v: string) => void;
  onTarget: (v: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, new Date(section.target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return (
    <section className="px-6 py-14 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        <Editable editable={editable} value={section.headline} onChange={onChange} />
      </h2>
      {editable && (
        <input
          type="datetime-local"
          value={section.target.slice(0, 16)}
          onChange={(e) => onTarget(new Date(e.target.value).toISOString())}
          className="mb-6 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      )}
      <div className="flex justify-center gap-3 md:gap-5">
        {[{ l: "Days", v: d }, { l: "Hours", v: h }, { l: "Min", v: m }, { l: "Sec", v: s }].map((c) => (
          <div key={c.l} className="glass-strong rounded-xl px-4 py-3 min-w-[68px]">
            <div className="text-2xl md:text-4xl font-bold tabular-nums text-gradient">{String(c.v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSection({
  section, editable, onChange, onTrack,
}: {
  section: Extract<Section, { type: "form" }>;
  editable?: boolean;
  onChange?: (s: Section) => void;
  onTrack?: Props["onTrack"];
}) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="px-6 py-16">
      <div className="max-w-md mx-auto glass-strong rounded-2xl p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          <Editable editable={editable} value={section.headline} onChange={(v) => onChange?.({ ...section, headline: v })} />
        </h2>
        <p className="text-center text-sm text-muted-foreground mt-2">
          <Editable editable={editable} value={section.sub} multiline onChange={(v) => onChange?.({ ...section, sub: v })} />
        </p>
        {submitted ? (
          <div className="mt-5 text-center text-primary">✓ You're in! Check your inbox.</div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editable) {
                onTrack?.("optin", { fields: section.fields.map((f) => f.label) });
                setSubmitted(true);
              }
            }}
            className="mt-5 space-y-3"
          >
            {section.fields.map((f, i) => (
              <input
                key={i}
                type={f.type}
                required
                placeholder={f.label}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/40"
              />
            ))}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium btn-glow">
              <Editable editable={editable} value={section.buttonText} onChange={(v) => onChange?.({ ...section, buttonText: v })} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
