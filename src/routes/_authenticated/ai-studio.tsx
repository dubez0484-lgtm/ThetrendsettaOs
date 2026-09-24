import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sparkles, Send, Wand2, Loader2, ArrowLeft, Rocket, Zap, Mail, Megaphone, User,
} from "lucide-react";
import { generateAi } from "@/lib/ai-studio.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/ai-studio")({
  head: () => ({
    meta: [
      { title: "AI Studio — TRENDSETTA SYSTEM™" },
      { name: "description", content: "Chat with TRENDSETTA AI to generate hooks, funnels, emails and sales copy." },
    ],
  }),
  component: AIStudio,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
};

const QUICK_ACTIONS = [
  {
    label: "Generate Funnel",
    icon: Rocket,
    category: "funnel",
    prompt: "Build me a complete sales funnel for a $97 digital product aimed at creators. Include: hook, landing page outline, lead magnet idea, 3-email follow-up sequence, and a CTA strategy.",
  },
  {
    label: "Write Hook",
    icon: Zap,
    category: "hook",
    prompt: "Write 10 scroll-stopping viral hooks for short-form video (TikTok / Reels / Shorts) about my brand. Make them under 8 words, hook-first, curiosity-driven.",
  },
  {
    label: "Email Sequence",
    icon: Mail,
    category: "email",
    prompt: "Write a 5-email welcome sequence for a new subscriber. Story-driven, builds authority, soft pitch on email 4, strong CTA on email 5.",
  },
  {
    label: "Sales Page",
    icon: Megaphone,
    category: "sales",
    prompt: "Write a high-converting long-form sales page for a $497 online course. Include headline, sub-headline, pain points, solution, benefits, social proof placeholders, offer stack, and CTA.",
  },
] as const;

function AIStudio() {
  const generate = useServerFn(generateAi);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey, I'm **TRENDSETTA AI**. Tell me what to build — a funnel, hooks, an email sequence, a sales page — or just describe your offer and I'll take it from there.",
    },
  ]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<string>("content");
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const mutation = useMutation({
    mutationFn: async (vars: { prompt: string; category: string }) => {
      return generate({
        data: {
          prompt: vars.prompt,
          category: vars.category,
          length: "medium",
          creativity: 0.7,
          model: "gemini",
          tone: "Bold",
        },
      });
    },
    onSuccess: (res, vars) => {
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findIndex((m) => m.pending);
        if (idx >= 0) next[idx] = { id: res.id, role: "assistant", content: res.response };
        return next;
      });
    },
    onError: (e: any) => {
      const msg = String(e?.message ?? "");
      setMessages((prev) => prev.filter((m) => !m.pending));
      if (msg.includes("429")) toast.error("Rate limit hit. Try again shortly.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Add credits in Workspace settings.");
      else toast.error("Generation failed. Please try again.");
    },
  });

  function send(text: string, cat: string = category) {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const pendingMsg: Message = { id: "pending", role: "assistant", content: "", pending: true };
    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput("");
    setCategory(cat);
    mutation.mutate({ prompt: trimmed, category: cat });
  }

  function handleQuick(q: typeof QUICK_ACTIONS[number]) {
    setInput(q.prompt);
    setCategory(q.category);
    taRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 glass-strong">
        <div className="mx-auto max-w-4xl px-4 md:px-8 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center btn-glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">AI Studio</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-[glow-pulse_2s_ease-in-out_infinite]" />
                TRENDSETTA AI · online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick actions */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-4 md:px-8 py-3 flex gap-2 overflow-x-auto">
          {QUICK_ACTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                onClick={() => handleQuick(q)}
                className="shrink-0 inline-flex items-center gap-2 glass rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium hover:border-primary/40 hover:bg-primary/10 transition"
              >
                <Icon className="size-3.5 text-primary" />
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat scroll area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 md:px-8 py-6 space-y-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 z-20 border-t border-white/5 glass-strong">
        <div className="mx-auto max-w-4xl px-4 md:px-8 py-3 md:py-4">
          <div className="glass rounded-2xl p-2 flex items-end gap-2">
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask TRENDSETTA AI anything — funnels, hooks, emails, sales copy..."
              rows={1}
              className="flex-1 min-h-[44px] max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm"
            />
            <Button
              onClick={() => send(input)}
              disabled={!input.trim() || mutation.isPending}
              className="btn-glow shrink-0"
              size="icon"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <div className="text-[10px] text-muted-foreground text-center mt-2">
            Powered by Lovable AI · responses are live
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 animate-[fade-up_0.3s_ease-out]">
        <div className="max-w-[85%] sm:max-w-[75%] bg-primary/15 border border-primary/30 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="size-8 shrink-0 rounded-full bg-white/5 border border-white/10 grid place-items-center">
          <User className="size-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 animate-[fade-up_0.3s_ease-out]">
      <div className="size-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center btn-glow">
        <Sparkles className="size-4 text-primary-foreground" />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
        <div className="text-[11px] text-muted-foreground font-medium">TRENDSETTA AI</div>
        <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
          {message.pending ? (
            <div className="flex items-center gap-1.5 py-1">
              <span className="size-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="size-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "120ms" }} />
              <span className="size-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "240ms" }} />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
          )}
        </div>
        {!message.pending && message.id !== "welcome" && (
          <div>
            <Link
              to="/funnels"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline glass rounded-lg px-3 py-1.5 border border-primary/30 hover:bg-primary/10 transition"
            >
              <Wand2 className="size-3" /> Build a funnel from these
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
