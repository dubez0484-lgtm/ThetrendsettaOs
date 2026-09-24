import { useEffect, useMemo, useState } from "react";
import {
  X, Info, ListOrdered, Settings2, GripVertical, Trash2, Plus,
  Sparkles, Target, ShoppingBag, Video, Gift, Save, Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type EditableFunnel = {
  id: string;
  name: string;
  type: string;
  description?: string;
  published?: boolean;
  status?: "live" | "draft" | "paused";
  steps?: { id: string; label: string }[];
  conversion?: number;
  accent?: string;
  createdAt?: string;
  isSample?: boolean;
};

const TYPES = [
  { value: "lead", label: "Lead Magnet", icon: Gift },
  { value: "sales", label: "Product Sale", icon: ShoppingBag },
  { value: "webinar", label: "Webinar", icon: Video },
  { value: "trial", label: "Free Trial", icon: Target },
];

const STATUSES: { value: "live" | "draft" | "paused"; label: string; dot: string }[] = [
  { value: "live", label: "Live", dot: "bg-emerald-400" },
  { value: "draft", label: "Draft", dot: "bg-zinc-400" },
  { value: "paused", label: "Paused", dot: "bg-amber-400" },
];

const ACCENTS = [
  "#22d3ee", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#10b981", "#14b8a6",
];

const newStepId = () => Math.random().toString(36).slice(2, 9);

type Tab = "info" | "steps" | "meta";

export default function EditFunnelModal({
  funnel,
  onClose,
  onSave,
}: {
  funnel: EditableFunnel | null;
  onClose: () => void;
  onSave: (updated: EditableFunnel) => void | Promise<void>;
}) {
  const [tab, setTab] = useState<Tab>("info");
  const [draft, setDraft] = useState<EditableFunnel | null>(funnel);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setDraft(funnel); setTab("info"); }, [funnel?.id]);

  const dirty = useMemo(() => {
    if (!draft || !funnel) return false;
    return JSON.stringify(draft) !== JSON.stringify(funnel);
  }, [draft, funnel]);

  if (!funnel || !draft) return null;

  const accent = draft.accent ?? "#22d3ee";
  const accentStyle = { borderColor: accent + "55" } as React.CSSProperties;
  const ringStyle = { boxShadow: `0 0 0 1px ${accent}40, 0 0 30px -8px ${accent}` } as React.CSSProperties;

  const patch = (p: Partial<EditableFunnel>) => setDraft((d) => (d ? { ...d, ...p } : d));

  function reorder(from: number, to: number) {
    if (from === to) return;
    setDraft((d) => {
      if (!d?.steps) return d;
      const next = [...d.steps];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return { ...d, steps: next };
    });
  }

  async function handleSave() {
    if (!draft || !dirty || saving) return;
    setSaving(true);
    try { await onSave(draft); } finally { setSaving(false); }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="glass-strong rounded-3xl max-w-2xl w-full border overflow-hidden flex flex-col max-h-[90vh] transition"
        style={accentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div
            className="size-9 rounded-xl grid place-items-center"
            style={{ background: accent + "22", color: accent }}
          >
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Edit Funnel</div>
            <div className="font-semibold truncate">{draft.name || "Untitled"}</div>
          </div>
          {dirty && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border"
              style={{ background: accent + "1a", color: accent, borderColor: accent + "55" }}
            >
              Unsaved
            </span>
          )}
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/5 text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-3 gap-1 border-b border-white/5">
          {([
            { id: "info" as const, label: "Info", icon: Info },
            { id: "steps" as const, label: "Steps", icon: ListOrdered },
            { id: "meta" as const, label: "Meta", icon: Settings2 },
          ]).map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 -mb-px transition"
                style={{
                  borderColor: active ? accent : "transparent",
                  color: active ? accent : undefined,
                }}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {tab === "info" && (
            <>
              <Field label="Funnel Name">
                <Input
                  value={draft.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={draft.description ?? ""}
                  onChange={(e) => patch({ description: e.target.value })}
                  placeholder="What's this funnel for?"
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </Field>
              <Field label="Funnel Type">
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    const active = draft.type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => patch({ type: t.value })}
                        className="text-left rounded-xl p-3 border transition"
                        style={active
                          ? { borderColor: accent + "99", background: accent + "14" }
                          : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" style={{ color: active ? accent : undefined }} />
                          <span className="text-sm font-medium">{t.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Status">
                <div className="flex gap-2">
                  {STATUSES.map((s) => {
                    const active = (draft.status ?? (draft.published ? "live" : "draft")) === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => patch({ status: s.value, published: s.value === "live" })}
                        className="flex-1 rounded-xl p-3 border text-sm font-medium flex items-center justify-center gap-2 transition"
                        style={active
                          ? { borderColor: accent + "99", background: accent + "14", color: accent }
                          : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                      >
                        <span className={`size-2 rounded-full ${s.dot} ${s.value === "live" ? "animate-pulse" : ""}`} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </>
          )}

          {tab === "steps" && (
            <div className="space-y-2">
              {(draft.steps ?? []).length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-6">No steps yet — add one below.</div>
              )}
              {(draft.steps ?? []).map((step, i) => (
                <div
                  key={step.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
                  onDragLeave={() => setOverIdx((x) => (x === i ? null : x))}
                  onDrop={() => { if (dragIdx !== null) reorder(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
                  onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                  className="flex items-center gap-2 rounded-xl border bg-white/[0.03] p-2 transition"
                  style={overIdx === i ? ringStyle : { borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <button className="size-8 grid place-items-center text-muted-foreground cursor-grab active:cursor-grabbing">
                    <GripVertical className="size-4" />
                  </button>
                  <span
                    className="text-xs font-bold w-6 text-center"
                    style={{ color: accent }}
                  >
                    {i + 1}
                  </span>
                  <input
                    value={step.label}
                    onChange={(e) =>
                      setDraft((d) => d ? { ...d, steps: d.steps!.map((s, idx) => idx === i ? { ...s, label: e.target.value } : s) } : d)
                    }
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={() => setDraft((d) => d ? { ...d, steps: d.steps!.filter((_, idx) => idx !== i) } : d)}
                    className="size-8 grid place-items-center rounded-lg hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setDraft((d) => d ? { ...d, steps: [...(d.steps ?? []), { id: newStepId(), label: `Step ${(d.steps?.length ?? 0) + 1}` }] } : d)}
                className="w-full rounded-xl border border-dashed py-3 text-sm flex items-center justify-center gap-2 hover:bg-white/[0.03] transition"
                style={{ borderColor: accent + "55", color: accent }}
              >
                <Plus className="size-4" /> Add Step
              </button>
            </div>
          )}

          {tab === "meta" && (
            <>
              <Field label={`Conversion Rate — ${(draft.conversion ?? 0).toFixed(1)}%`}>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={draft.conversion ?? 0}
                    onChange={(e) => patch({ conversion: parseFloat(e.target.value) })}
                    className="w-full accent-current"
                    style={{ color: accent }}
                  />
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${draft.conversion ?? 0}%`,
                        background: `linear-gradient(90deg, ${accent}80, ${accent})`,
                        boxShadow: `0 0 12px ${accent}`,
                      }}
                    />
                  </div>
                </div>
              </Field>
              <Field label="Accent Color">
                <div className="flex flex-wrap gap-2">
                  {ACCENTS.map((c) => {
                    const active = accent === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => patch({ accent: c })}
                        className="size-9 rounded-full border-2 transition"
                        style={{
                          background: c,
                          borderColor: active ? "#fff" : "transparent",
                          boxShadow: active ? `0 0 18px ${c}` : undefined,
                        }}
                        aria-label={c}
                      />
                    );
                  })}
                </div>
              </Field>
              {draft.createdAt && (
                <Field label="Created">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Circle className="size-3" style={{ color: accent }} />
                    {new Date(draft.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </div>
                </Field>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="text-black font-semibold"
            style={dirty ? { background: accent, boxShadow: `0 0 24px -6px ${accent}` } : undefined}
          >
            <Save className="size-4" />
            {saving ? "Saving…" : dirty ? "Save Changes" : "No Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
