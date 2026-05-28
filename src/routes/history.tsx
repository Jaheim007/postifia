import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ResultsGrid } from "@/components/ResultsGrid";
import type { GeneratedContent } from "@/lib/platforms";

export const Route = createFileRoute("/history")({ component: HistoryPage });

type Row = {
  id: string;
  topic: string;
  tone: string;
  language: string;
  content: GeneratedContent;
  created_at: string;
};

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("generations")
      .select("id, topic, tone, language, content, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setRows((data ?? []) as Row[]));
  }, [user]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <Link to="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Button></Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">Historique</h1>
        <p className="mt-1 text-sm text-muted-foreground">Retrouvez vos 50 dernières générations.</p>

        {rows === null && <div className="mt-8 text-sm text-muted-foreground">Chargement…</div>}
        {rows && rows.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/20 p-10 text-center">
            <p className="text-sm text-muted-foreground">Aucune génération pour le moment.</p>
            <Link to="/dashboard"><Button className="mt-4 bg-brand-gradient text-white">Générer mon premier contenu</Button></Link>
          </div>
        )}

        {selected ? (
          <div className="mt-6">
            <button onClick={() => setSelected(null)} className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'historique
            </button>
            <div className="mb-4 rounded-xl border border-border bg-card/40 p-4">
              <p className="text-xs text-muted-foreground">{selected.tone} · {selected.language.toUpperCase()}</p>
              <p className="mt-1 font-medium">{selected.topic}</p>
            </div>
            <ResultsGrid content={selected.content} />
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card/40">
            {rows?.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setSelected(r)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-accent/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{r.topic}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.tone} · {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
