const logos = ["FORGE", "NOVA", "PULSE", "ASCEND", "ORBIT", "VANTA"];

export function SocialProof() {
  return (
    <section className="relative py-12 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Trusted by 12,000+ creators & digital businesses
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {logos.map((l) => (
            <div key={l} className="font-display font-bold tracking-widest text-lg text-muted-foreground">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
