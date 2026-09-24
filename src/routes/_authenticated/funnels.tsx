import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, BarChart3, ArrowLeft, Workflow, Eye, Pencil,
  Sparkles, Target, ShoppingBag, Video, Gift,
} from "lucide-react";
import { createFunnel, deleteFunnel, listFunnels, updateFunnel } from "@/lib/funnels.functions";
import { defaultSection } from "@/components/funnel/sections";
import EditFunnelModal, { type EditableFunnel } from "@/components/funnel/EditFunnelModal";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/funnels")({
  head: () => ({ meta: [{ title: "Funnels — TRENDSETTA SYSTEM™" }] }),
  component: FunnelsPage,
});

type FunnelType = "lead" | "sales" | "webinar" | "trial";

const TYPES: { value: FunnelType; label: string; icon: typeof Gift; blurb: string }[] = [
  { value: "lead",    label: "Lead Magnet",  icon: Gift,        blurb: "Capture emails" },
  { value: "sales",   label: "Product Sale", icon: ShoppingBag, blurb: "Sell a product" },
  { value: "webinar", label: "Webinar",      icon: Video,       blurb: "Live event signup" },
  { value: "trial",   label: "Free Trial",   icon: Target,      blurb: "Trial onboarding" },
];

const SAMPLES = [
  { id: "sample-1", name: "AI Course Launch",    type: "sales",   published: true,  steps: 7, conversion: 12.4, slug: "ai-course-launch" },
  { id: "sample-2", name: "Free Strategy Guide", type: "lead",    published: true,  steps: 4, conversion: 38.1, slug: "free-strategy-guide" },
  { id: "sample-3", name: "Webinar Replay",      type: "webinar", published: false, steps: 5, conversion: 0,    slug: "webinar-replay" },
];

const typeLabel = (t: string) =>
  TYPES.find((x) => x.value === t)?.label ?? t.charAt(0).toUpperCase() + t.slice(1);

function FunnelsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listFunnels);
  const create = useServerFn(createFunnel);
  const update = useServerFn(updateFunnel);
  const del = useServerFn(deleteFunnel);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<FunnelType>("lead");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<EditableFunnel | null>(null);

  const { data: funnels = [], isLoading } = useQuery({ queryKey: ["funnels"], queryFn: () => list() });

  const cards = useMemo(() => {
    const real = funnels.map((f: any) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      type: f.type,
      published: f.published,
      steps: Array.isArray(f.sections) ? f.sections.length : 4,
      conversion: Math.round((Math.sin(f.id.charCodeAt(0)) + 1) * 15 * 10) / 10,
      isSample: false as const,
    }));
    return [...real, ...SAMPLES.map((s) => ({ ...s, isSample: true as const }))];
  }, [funnels]);

  const createMut = useMutation({
    mutationFn: () =>
      create({
        data: {
          name: name.trim(),
          type,
          sections: [defaultSection("hero"), defaultSection("features"), defaultSection("cta")],
        },
      }),
    onSuccess: (row) => {
      toast.success("Funnel created");
      setOpen(false);
      setName(""); setDescription(""); setType("lead");
      qc.invalidateQueries({ queryKey: ["funnels"] });
      nav({ to: "/funnels/$id", params: { id: row.id } });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not create funnel"),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["funnels"] }); toast.success("Deleted"); },
  });

  async function handleEditSave(updated: EditableFunnel) {
    try {
      await update({
        data: {
          id: updated.id,
          name: updated.name,
          type: updated.type,
          published: updated.status === "live",
          seo: { description: updated.description ?? "" },
          theme: { accent: updated.accent, status: updated.status, conversion: updated.conversion, steps: updated.steps },
        },
      });
      toast.success("Funnel updated");
      qc.invalidateQueries({ queryKey: ["funnels"] });
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/5 glass-strong">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Workflow className="size-4 text-primary" /> Funnels
          </div>
          <Button onClick={() => setOpen(true)} className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 h-9">
            <Plus className="size-4" /> <span className="hidden sm:inline">Create New Funnel</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <div className="text-xs text-primary font-medium mb-2 flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Funnel Builder
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            Build funnels that <span className="text-gradient">convert</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Track each funnel's steps and conversion rate at a glance.
          </p>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((f) => (
              <FunnelCard
                key={f.id}
                funnel={f}
                onEdit={() => {
                  if (f.isSample) return toast.info("Sample funnel — create your own to edit.");
                  const raw: any = funnels.find((x: any) => x.id === f.id);
                  setEditing({
                    id: f.id,
                    name: f.name,
                    type: f.type,
                    description: raw?.seo?.description ?? "",
                    published: f.published,
                    status: f.published ? "live" : (raw?.theme?.status ?? "draft"),
                    steps: Array.isArray(raw?.sections) && raw.sections.length
                      ? raw.sections.map((s: any) => ({
                          id: s.id ?? Math.random().toString(36).slice(2, 9),
                          label: s.headline ?? s.title ?? s.type ?? "Step",
                        }))
                      : Array.from({ length: f.steps }, (_, i) => ({ id: `s${i}`, label: `Step ${i + 1}` })),
                    conversion: f.conversion,
                    accent: raw?.theme?.accent ?? "#22d3ee",
                    createdAt: raw?.created_at,
                    isSample: false,
                  });
                }}
                onDelete={() => {
                  if (f.isSample) return toast.info("Sample funnel — create your own to delete.");
                  if (confirm(`Delete "${f.name}"?`)) delMut.mutate(f.id);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong border-white/10 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Funnel</DialogTitle>
            <DialogDescription>Set up the basics. You can edit everything later.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="fname">Funnel Name</Label>
              <Input
                id="fname"
                placeholder="e.g. Black Friday Launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label>Funnel Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map((t) => {
                  const Icon = t.icon;
                  const active = type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={`text-left rounded-xl p-3 border transition ${
                        active
                          ? "border-primary/60 bg-primary/10 shadow-[0_0_20px_-8px] shadow-primary"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{t.label}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">{t.blurb}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fdesc">Description</Label>
              <Textarea
                id="fdesc"
                placeholder="What's this funnel for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border-white/10 focus-visible:ring-primary min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createMut.mutate()}
              disabled={!name.trim() || createMut.isPending}
              className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createMut.isPending ? "Creating…" : "Create Funnel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditFunnelModal
        funnel={editing}
        onClose={() => setEditing(null)}
        onSave={handleEditSave}
      />
    </div>
  );
}

function FunnelCard({
  funnel,
  onEdit,
  onDelete,
}: {
  funnel: { id: string; name: string; slug: string; type: string; published: boolean; steps: number; conversion: number; isSample: boolean };
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = funnel.published ? "Active" : "Draft";
  return (
    <div className="glass rounded-2xl p-5 group hover:border-primary/40 transition relative overflow-hidden">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <div className="font-semibold truncate">{funnel.name}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wider">
            {typeLabel(funnel.type)}{funnel.isSample && " · Sample"}
          </div>
        </div>
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
            funnel.published
              ? "bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_-4px] shadow-primary"
              : "bg-white/5 text-muted-foreground border-white/10"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 my-4">
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Steps</div>
          <div className="text-lg font-bold mt-0.5">{funnel.steps}</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Conversion</div>
          <div className="text-lg font-bold mt-0.5 text-primary">
            {funnel.conversion ? `${funnel.conversion}%` : "—"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={onEdit}
          className="text-xs glass rounded-full px-3 py-1.5 hover:bg-white/5 flex items-center gap-1"
        >
          <Pencil className="size-3" /> Edit
        </button>



        {funnel.published ? (
          <a
            href={`/f/${funnel.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs glass rounded-full px-3 py-1.5 hover:bg-white/5 flex items-center gap-1"
          >
            <Eye className="size-3" /> Preview
          </a>
        ) : (
          <span className="text-xs glass rounded-full px-3 py-1.5 text-muted-foreground flex items-center gap-1">
            <Eye className="size-3" /> Preview
          </span>
        )}

        {!funnel.isSample && (
          <Link
            to="/funnels/$id/analytics"
            params={{ id: funnel.id }}
            className="text-xs glass rounded-full px-3 py-1.5 hover:bg-white/5 flex items-center gap-1"
          >
            <BarChart3 className="size-3" /> Stats
          </Link>
        )}

        <button
          onClick={onDelete}
          className="text-xs glass rounded-full px-3 py-1.5 hover:bg-destructive/10 text-destructive flex items-center gap-1 ml-auto"
        >
          <Trash2 className="size-3" /> Delete
        </button>
      </div>
    </div>
  );
}
