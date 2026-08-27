import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Eye, Globe, Sparkles, Trash2, ChevronUp, ChevronDown, Plus,
  Monitor, Tablet, Smartphone, Wand2, Link as LinkIcon, BarChart3, Loader2,
} from "lucide-react";
import { getFunnel, updateFunnel, generateFunnelWithAI } from "@/lib/funnels.functions";
import { SECTION_LIBRARY, defaultSection, newId, type Section, type SectionType } from "@/components/funnel/sections";
import { SectionRenderer } from "@/components/funnel/SectionRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/funnels/$id")({
  head: () => ({ meta: [{ title: "Edit Funnel — TRENDSETTA SYSTEM™" }] }),
  component: FunnelEditor,
});

function FunnelEditor() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const get = useServerFn(getFunnel);
  const update = useServerFn(updateFunnel);
  const aiGen = useServerFn(generateFunnelWithAI);

  const { data: funnel, isLoading } = useQuery({
    queryKey: ["funnel", id],
    queryFn: () => get({ data: { id } }),
  });

  const [name, setName] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [published, setPublished] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebar, setSidebar] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const initial = useRef(false);

  useEffect(() => {
    if (!funnel || initial.current) return;
    setName(funnel.name);
    setSections((funnel.sections as Section[]) ?? []);
    setSeoTitle((funnel.seo as any)?.title ?? "");
    setSeoDesc((funnel.seo as any)?.description ?? "");
    setPublished(funnel.published);
    initial.current = true;
  }, [funnel]);

  const saveMut = useMutation({
    mutationFn: () =>
      update({
        data: {
          id, name, sections,
          seo: { title: seoTitle, description: seoDesc },
        },
      }),
    onSuccess: () => { setDirty(false); qc.invalidateQueries({ queryKey: ["funnel", id] }); qc.invalidateQueries({ queryKey: ["funnels"] }); toast.success("Saved"); },
  });

  const publishMut = useMutation({
    mutationFn: (next: boolean) => update({ data: { id, published: next, sections, name, seo: { title: seoTitle, description: seoDesc } } }),
    onSuccess: (_d, next) => { setPublished(next); setDirty(false); toast.success(next ? "Funnel published" : "Unpublished"); qc.invalidateQueries({ queryKey: ["funnels"] }); },
  });

  // Autosave debounced
  useEffect(() => {
    if (!initial.current || !dirty) return;
    const t = setTimeout(() => { saveMut.mutate(); }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, sections, seoTitle, seoDesc, dirty]);

  function markDirty() { setDirty(true); }

  function addSection(type: SectionType) {
    setSections((s) => [...s, defaultSection(type)]);
    markDirty();
    setSidebar(false);
  }
  function move(i: number, dir: -1 | 1) {
    setSections((s) => {
      const next = [...s]; const j = i + dir;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    markDirty();
  }
  function removeAt(i: number) { setSections((s) => s.filter((_, idx) => idx !== i)); markDirty(); }
  function updateAt(i: number, s: Section) { setSections((arr) => arr.map((x, idx) => (idx === i ? s : x))); markDirty(); }

  async function handleAIGenerate() {
    if (!aiPrompt.trim()) return;
    setAiBusy(true);
    try {
      const res = await aiGen({ data: { prompt: aiPrompt.trim(), type: funnel?.type ?? "lead" } });
      const built: Section[] = [
        { id: newId(), type: "hero", eyebrow: "NEW", headline: res.hero?.headline ?? "Welcome", sub: res.hero?.sub ?? "", ctaText: res.hero?.ctaText ?? "Get Started", ctaHref: "#cta" },
        { id: newId(), type: "features", title: res.features?.title ?? "Features", items: res.features?.items ?? [] },
        { id: newId(), type: "testimonials", title: res.testimonials?.title ?? "Loved by users", items: res.testimonials?.items ?? [] },
        { id: newId(), type: "pricing", title: res.pricing?.title ?? "Pricing", items: res.pricing?.items ?? [] },
        { id: newId(), type: "faq", title: res.faq?.title ?? "Questions", items: res.faq?.items ?? [] },
        { id: newId(), type: "cta", headline: res.cta?.headline ?? "Ready?", sub: res.cta?.sub ?? "", ctaText: res.cta?.ctaText ?? "Start now", ctaHref: "#" },
      ];
      setSections(built);
      if (res.name) setName(res.name);
      if (res.seo?.title) setSeoTitle(res.seo.title);
      if (res.seo?.description) setSeoDesc(res.seo.description);
      markDirty();
      setAiOpen(false);
      setAiPrompt("");
      toast.success("Funnel generated");
    } catch (e: any) {
      toast.error(e?.message ?? "Generation failed");
    } finally {
      setAiBusy(false);
    }
  }

  const canvasWidth = device === "desktop" ? "100%" : device === "tablet" ? "768px" : "390px";
  const publicUrl = useMemo(() => (funnel ? `${typeof window !== "undefined" ? window.location.origin : ""}/f/${funnel.slug}` : ""), [funnel]);

  if (isLoading || !funnel) {
    return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">Loading funnel…</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-white/5 glass-strong">
        <div className="px-3 md:px-6 h-14 flex items-center gap-3">
          <Link to="/funnels" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /></Link>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); markDirty(); }}
            className="bg-transparent text-sm font-semibold outline-none w-44 sm:w-72 truncate"
          />
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {dirty ? "Unsaved…" : saveMut.isPending ? "Saving…" : "Saved"}
          </span>

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden md:flex glass rounded-full p-1">
              {[
                { id: "desktop" as const, icon: Monitor },
                { id: "tablet" as const, icon: Tablet },
                { id: "mobile" as const, icon: Smartphone },
              ].map(({ id: d, icon: Icon }) => (
                <button key={d} onClick={() => setDevice(d)} className={`size-7 grid place-items-center rounded-full ${device === d ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
            <Button onClick={() => setAiOpen(true)} variant="secondary" className="h-9 hidden sm:flex"><Wand2 className="size-3.5" /> AI</Button>
            <Link to="/funnels/$id/analytics" params={{ id }} className="hidden sm:inline-flex">
              <Button variant="secondary" className="h-9"><BarChart3 className="size-3.5" /></Button>
            </Link>
            <Button onClick={() => saveMut.mutate()} variant="secondary" className="h-9"><Save className="size-3.5" /></Button>
            <Button
              onClick={() => publishMut.mutate(!published)}
              className={`h-9 ${published ? "bg-white/10 text-foreground" : "btn-glow bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              <Globe className="size-3.5" /> <span className="hidden sm:inline">{published ? "Unpublish" : "Publish"}</span>
            </Button>
          </div>
        </div>
        {published && (
          <div className="px-3 md:px-6 pb-2 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground flex items-center gap-1"><LinkIcon className="size-3" /> Live at</span>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-primary truncate hover:underline">{publicUrl}</a>
            <button onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success("Link copied"); }} className="text-muted-foreground hover:text-foreground">Copy</button>
          </div>
        )}
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Blocks sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 glass-strong border-r border-white/5 transform transition lg:translate-x-0 ${sidebar ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Blocks</div>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_LIBRARY.map((b) => (
                <button
                  key={b.type}
                  onClick={() => addSection(b.type)}
                  className="glass rounded-lg p-3 text-left hover:border-primary/40 hover:bg-white/5 transition"
                >
                  <div className="text-lg">{b.icon}</div>
                  <div className="text-xs font-medium mt-1">{b.label}</div>
                </button>
              ))}
            </div>

            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-6 mb-2">SEO</div>
            <div className="space-y-2">
              <Input placeholder="Meta title" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); markDirty(); }} className="h-9 text-sm" />
              <Input placeholder="Meta description" value={seoDesc} onChange={(e) => { setSeoDesc(e.target.value); markDirty(); }} className="h-9 text-sm" />
            </div>
          </div>
        </aside>
        {sidebar && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebar(false)} />}

        {/* Mobile blocks button */}
        <button onClick={() => setSidebar(true)} className="lg:hidden fixed bottom-4 left-4 z-20 size-12 rounded-full bg-primary text-primary-foreground btn-glow grid place-items-center">
          <Plus className="size-5" />
        </button>

        {/* Canvas */}
        <main className="flex-1 min-w-0 overflow-auto bg-background/40 p-4 md:p-8">
          <div
            className="mx-auto bg-background border border-white/5 rounded-2xl overflow-hidden transition-all"
            style={{ width: canvasWidth, maxWidth: "100%" }}
          >
            {sections.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-muted-foreground text-sm mb-4">Empty funnel — add a block to start.</div>
                <Button onClick={() => setSidebar(true)} variant="secondary" className="lg:hidden"><Plus className="size-4" /> Add block</Button>
                <Button onClick={() => setAiOpen(true)} className="ml-2 btn-glow bg-primary text-primary-foreground"><Wand2 className="size-4" /> Generate with AI</Button>
              </div>
            ) : (
              sections.map((s, i) => (
                <div key={s.id} className="relative group/section border-b border-white/5 last:border-0">
                  <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 group-hover/section:opacity-100 transition">
                    <button onClick={() => move(i, -1)} className="size-7 grid place-items-center rounded-md glass-strong hover:bg-white/10"><ChevronUp className="size-3.5" /></button>
                    <button onClick={() => move(i, 1)} className="size-7 grid place-items-center rounded-md glass-strong hover:bg-white/10"><ChevronDown className="size-3.5" /></button>
                    <button onClick={() => removeAt(i)} className="size-7 grid place-items-center rounded-md glass-strong hover:bg-white/10 text-destructive"><Trash2 className="size-3.5" /></button>
                  </div>
                  <SectionRenderer section={s} editable onChange={(ns) => updateAt(i, ns)} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* AI modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => !aiBusy && setAiOpen(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-2"><Sparkles className="size-4 text-primary" /> <h2 className="text-lg font-bold">AI Funnel Generator</h2></div>
            <p className="text-sm text-muted-foreground mb-4">Describe your business or offer and AI will write your full funnel.</p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. I sell a $97 productivity course for solopreneurs."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm min-h-[100px] focus:outline-none focus:border-primary/40"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" disabled={aiBusy} onClick={() => setAiOpen(false)}>Cancel</Button>
              <Button disabled={aiBusy || !aiPrompt.trim()} onClick={handleAIGenerate} className="btn-glow bg-primary text-primary-foreground">
                {aiBusy ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
