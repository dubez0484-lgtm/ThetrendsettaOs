import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FileText, Plus, Trash2, Users, Megaphone, Globe, Copy, Save, Download, Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  listLmDocuments, createLmDocument, updateLmDocument, deleteLmDocument,
  listLmCampaigns, createLmCampaign, updateLmCampaign, deleteLmCampaign,
  listLmLeads, deleteLmLead,
} from "@/lib/lead-magnet.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/lead-magnet")({
  head: () => ({
    meta: [
      { title: "Lead Magnet Builder — TRENDSETTA SYSTEM™" },
      { name: "description", content: "Create AI lead magnets, publish capture pages, and manage captured leads inside Trendsetta System." },
      { property: "og:title", content: "Lead Magnet Builder — TRENDSETTA SYSTEM™" },
      { property: "og:description", content: "Build lead magnets, capture pages and track every lead in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadMagnetPage,
});

const DOC_TYPES = ["ebook", "checklist", "cheatsheet", "toolkit", "blueprint"];

type Doc = any;
type Campaign = any;

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-strong relative overflow-hidden rounded-2xl border border-white/10 p-5 ${className}`}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

function LeadMagnetPage() {
  const qc = useQueryClient();
  const fetchDocs = useServerFn(listLmDocuments);
  const fetchCampaigns = useServerFn(listLmCampaigns);
  const fetchLeads = useServerFn(listLmLeads);
  const createDoc = useServerFn(createLmDocument);
  const patchDoc = useServerFn(updateLmDocument);
  const dropDoc = useServerFn(deleteLmDocument);
  const createCamp = useServerFn(createLmCampaign);
  const patchCamp = useServerFn(updateLmCampaign);
  const dropCamp = useServerFn(deleteLmCampaign);
  const dropLead = useServerFn(deleteLmLead);

  const docs = useQuery({ queryKey: ["lm_documents"], queryFn: () => fetchDocs() });
  const campaigns = useQuery({ queryKey: ["lm_campaigns"], queryFn: () => fetchCampaigns() });
  const leads = useQuery({ queryKey: ["lm_leads"], queryFn: () => fetchLeads() });

  const [docOpen, setDocOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocType, setNewDocType] = useState("ebook");

  const [campOpen, setCampOpen] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newCampDoc, setNewCampDoc] = useState<string>("none");

  const [editDoc, setEditDoc] = useState<Doc | null>(null);
  const [editCamp, setEditCamp] = useState<Campaign | null>(null);

  const invalidate = (k: string) => qc.invalidateQueries({ queryKey: [k] });

  const docMut = useMutation({
    mutationFn: () => createDoc({ data: { title: newDocTitle.trim(), type: newDocType, content: { body: "" } } }),
    onSuccess: (row) => {
      setDocOpen(false); setNewDocTitle(""); setNewDocType("ebook");
      invalidate("lm_documents");
      setEditDoc({ ...row, content: row.content ?? {} });
      toast.success("Lead magnet created");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not create lead magnet"),
  });

  const campMut = useMutation({
    mutationFn: () =>
      createCamp({
        data: {
          name: newCampName.trim(),
          document_id: newCampDoc === "none" ? null : newCampDoc,
        },
      }),
    onSuccess: (row) => {
      setCampOpen(false); setNewCampName(""); setNewCampDoc("none");
      invalidate("lm_campaigns");
      setEditCamp(row);
      toast.success("Capture page created");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not create capture page"),
  });

  const saveDoc = useMutation({
    mutationFn: (d: Doc) =>
      patchDoc({
        data: {
          id: d.id,
          title: d.title,
          type: d.type,
          status: d.status,
          content: d.content ?? {},
        },
      }),
    onSuccess: () => { invalidate("lm_documents"); setEditDoc(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });

  const saveCamp = useMutation({
    mutationFn: (c: Campaign) =>
      patchCamp({
        data: {
          id: c.id,
          name: c.name,
          headline: c.headline,
          subheadline: c.subheadline ?? null,
          cta_label: c.cta_label,
          document_id: c.document_id ?? null,
          require_email_confirm: !!c.require_email_confirm,
          active: !!c.active,
        },
      }),
    onSuccess: () => { invalidate("lm_campaigns"); setEditCamp(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });

  const docList: Doc[] = docs.data ?? [];
  const campList: Campaign[] = campaigns.data ?? [];
  const leadList: any[] = leads.data ?? [];

  const stats = useMemo(
    () => [
      { label: "Lead Magnets", value: docList.length, icon: FileText },
      { label: "Capture Pages", value: campList.length, icon: Megaphone },
      { label: "Leads Captured", value: leadList.length, icon: Users },
      { label: "Published", value: docList.filter((d) => d.status === "published").length, icon: Globe },
    ],
    [docList, campList, leadList],
  );

  function copyLink(slug: string) {
    const url = `${window.location.origin}/lm/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Capture page link copied");
  }

  function exportLeadsCsv() {
    const rows = [
      ["email", "name", "campaign", "confirmed", "created_at"],
      ...leadList.map((l) => [
        l.email, l.name ?? "", l.lm_campaigns?.name ?? "", String(l.confirmed), l.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "leads.csv";
    a.click();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6 animate-[fade-up_0.5s_ease-out_both]">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-[glow-pulse_2s_ease-in-out_infinite] rounded-full bg-primary" />
            Lead Magnet Engine
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Lead Magnet Builder</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create the asset, publish the capture page, own the leads. AI is your unfair advantage.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <GlowCard key={s.label}>
              <s.icon className="h-4 w-4 text-primary" />
              <div className="mt-3 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </GlowCard>
          ))}
        </div>

        <Tabs defaultValue="documents">
          <TabsList className="glass-strong">
            <TabsTrigger value="documents">Lead Magnets</TabsTrigger>
            <TabsTrigger value="campaigns">Capture Pages</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          {/* -------------------------- documents -------------------------- */}
          <TabsContent value="documents" className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Your assets</h2>
              <Button onClick={() => setDocOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> New lead magnet
              </Button>
            </div>

            {docs.isLoading ? (
              <Loading />
            ) : docList.length === 0 ? (
              <Empty text="No lead magnets yet. Create your first asset." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {docList.map((d) => (
                  <GlowCard key={d.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{d.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border border-white/10 px-2 py-0.5 capitalize">{d.type}</span>
                          <span className={d.status === "published" ? "text-primary" : ""}>{d.status}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button size="sm" variant="outline" onClick={() => setEditDoc({ ...d, content: d.content ?? {} })}>Edit</Button>
                        <Button size="icon" variant="ghost" onClick={() => dropDoc({ data: { id: d.id } }).then(() => { invalidate("lm_documents"); toast.success("Deleted"); })}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            )}
          </TabsContent>

          {/* -------------------------- campaigns -------------------------- */}
          <TabsContent value="campaigns" className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Capture pages</h2>
              <Button onClick={() => setCampOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> New capture page
              </Button>
            </div>

            {campaigns.isLoading ? (
              <Loading />
            ) : campList.length === 0 ? (
              <Empty text="No capture pages yet. Wire one to a lead magnet." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {campList.map((c) => (
                  <GlowCard key={c.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{c.name}</div>
                        <div className="mt-1 truncate text-xs text-muted-foreground">/lm/{c.slug}</div>
                        <div className="mt-2 text-xs">
                          <span className={c.active ? "text-primary" : "text-muted-foreground"}>
                            {c.active ? "Live" : "Paused"}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button size="icon" variant="ghost" onClick={() => copyLink(c.slug)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditCamp(c)}>Edit</Button>
                        <Button size="icon" variant="ghost" onClick={() => dropCamp({ data: { id: c.id } }).then(() => { invalidate("lm_campaigns"); toast.success("Deleted"); })}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ----------------------------- leads ---------------------------- */}
          <TabsContent value="leads" className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Captured contacts</h2>
              <Button variant="outline" className="gap-2" onClick={exportLeadsCsv} disabled={leadList.length === 0}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>

            {leads.isLoading ? (
              <Loading />
            ) : leadList.length === 0 ? (
              <Empty text="No leads yet. Share a capture page to start collecting." />
            ) : (
              <div className="glass-strong overflow-hidden rounded-2xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Confirmed</TableHead>
                      <TableHead>Captured</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadList.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.email}</TableCell>
                        <TableCell>{l.name ?? "—"}</TableCell>
                        <TableCell>{l.lm_campaigns?.name ?? "—"}</TableCell>
                        <TableCell>{l.confirmed ? "Yes" : "No"}</TableCell>
                        <TableCell>{new Date(l.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => dropLead({ data: { id: l.id } }).then(() => { invalidate("lm_leads"); toast.success("Removed"); })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* new document dialog */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>New lead magnet</DialogTitle>
            <DialogDescription>Name it and pick a format. You can write the content next.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} placeholder="The AI Creator Playbook" />
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={newDocType} onValueChange={setNewDocType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => docMut.mutate()} disabled={!newDocTitle.trim() || docMut.isPending}>
              {docMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit document */}
      <Dialog open={!!editDoc} onOpenChange={(o) => !o && setEditDoc(null)}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit lead magnet</DialogTitle>
            <DialogDescription>Content is stored as structured JSON, ready for PDF export.</DialogDescription>
          </DialogHeader>
          {editDoc && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={editDoc.title} onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={editDoc.type} onValueChange={(v) => setEditDoc({ ...editDoc, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editDoc.status} onValueChange={(v) => setEditDoc({ ...editDoc, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  rows={10}
                  value={editDoc.content?.body ?? ""}
                  onChange={(e) => setEditDoc({ ...editDoc, content: { ...(editDoc.content ?? {}), body: e.target.value } })}
                  placeholder={"# Chapter 1\n\nWrite or paste your lead magnet content here…"}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDoc(null)}>Cancel</Button>
            <Button className="gap-2" onClick={() => editDoc && saveDoc.mutate(editDoc)} disabled={saveDoc.isPending}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* new campaign */}
      <Dialog open={campOpen} onOpenChange={setCampOpen}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>New capture page</DialogTitle>
            <DialogDescription>Attach a lead magnet and start collecting emails.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign name</Label>
              <Input value={newCampName} onChange={(e) => setNewCampName(e.target.value)} placeholder="Playbook launch" />
            </div>
            <div className="space-y-2">
              <Label>Lead magnet</Label>
              <Select value={newCampDoc} onValueChange={setNewCampDoc}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None yet</SelectItem>
                  {docList.map((d) => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => campMut.mutate()} disabled={!newCampName.trim() || campMut.isPending}>
              {campMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit campaign */}
      <Dialog open={!!editCamp} onOpenChange={(o) => !o && setEditCamp(null)}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit capture page</DialogTitle>
            <DialogDescription>This copy renders on your public capture page.</DialogDescription>
          </DialogHeader>
          {editCamp && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign name</Label>
                <Input value={editCamp.name} onChange={(e) => setEditCamp({ ...editCamp, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input value={editCamp.headline} onChange={(e) => setEditCamp({ ...editCamp, headline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Subheadline</Label>
                <Textarea rows={3} value={editCamp.subheadline ?? ""} onChange={(e) => setEditCamp({ ...editCamp, subheadline: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>CTA label</Label>
                  <Input value={editCamp.cta_label} onChange={(e) => setEditCamp({ ...editCamp, cta_label: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Lead magnet</Label>
                  <Select value={editCamp.document_id ?? "none"} onValueChange={(v) => setEditCamp({ ...editCamp, document_id: v === "none" ? null : v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {docList.map((d) => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                <div>
                  <div className="text-sm font-medium">Live</div>
                  <div className="text-xs text-muted-foreground">Publicly reachable at /lm/{editCamp.slug}</div>
                </div>
                <Switch checked={!!editCamp.active} onCheckedChange={(v) => setEditCamp({ ...editCamp, active: v })} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                <div>
                  <div className="text-sm font-medium">Require email confirmation</div>
                  <div className="text-xs text-muted-foreground">Double opt-in before delivery</div>
                </div>
                <Switch checked={!!editCamp.require_email_confirm} onCheckedChange={(v) => setEditCamp({ ...editCamp, require_email_confirm: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditCamp(null)}>Cancel</Button>
            <Button className="gap-2" onClick={() => editCamp && saveCamp.mutate(editCamp)} disabled={saveCamp.isPending}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Loading() {
  return (
    <div className="grid place-items-center py-16">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="glass-strong rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
