import { Sparkles, Send, Wand2 } from "lucide-react";

export function AISection() {
  return (
    <section id="dashboard" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="text-sm text-primary font-medium mb-3">AI Studio</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Describe your offer.
            <br />
            <span className="text-gradient">We build the funnel.</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Tell the AI what you sell. It generates landing pages, offers, email sequences and
            CTAs that match your brand voice — automatically.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Viral hooks for TikTok, Reels and Shorts",
              "High-converting sales pages in seconds",
              "Email sequences personalized to your audience",
              "Product ideas, captions and scripts on tap",
            ].map((i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="size-5 rounded-full bg-primary/15 grid place-items-center border border-primary/30">
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-muted-foreground">{i}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mock AI panel */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-50" />
          <div className="relative glass-strong rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground pb-4 border-b border-white/5">
              <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center">
                <Sparkles className="size-3.5 text-primary-foreground" />
              </div>
              <span className="font-medium text-foreground">TRENDSETTA AI</span>
              <span className="ml-auto">Online</span>
              <span className="size-1.5 rounded-full bg-emerald-400 animate-[glow-pulse_2s_ease-in-out_infinite]" />
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex justify-end">
                <div className="bg-primary/15 border border-primary/30 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">
                  Create a viral TikTok hook for my fitness coaching offer
                </div>
              </div>
              <div className="flex">
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] space-y-2">
                  <p>Here are 3 hooks engineered for retention:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                    <li>"I lost 30lbs without giving up carbs. Here's the system."</li>
                    <li>"Stop counting calories. Do this 3-step trick instead."</li>
                    <li>"The fitness lie keeping you stuck at the same weight."</li>
                  </ol>
                  <button className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <Wand2 className="size-3" /> Build a funnel from these
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 glass rounded-xl flex items-center gap-2 px-3 py-2">
              <Sparkles className="size-4 text-primary" />
              <input
                placeholder="Ask TRENDSETTA AI anything..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center btn-glow">
                <Send className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
