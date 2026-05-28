import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, History, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResultsGrid } from "@/components/ResultsGrid";
import { PLATFORMS, type GeneratedContent } from "@/lib/platforms";
import { generateContent, getUsage } from "@/lib/api/generate.functions";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const TONES = [
  { v: "Professionnel", l: "Professionnel" },
  { v: "Inspirant", l: "Inspirant" },
  { v: "Spirituel", l: "Spirituel" },
  { v: "Viral", l: "Viral" },
  { v: "Motivation", l: "Motivation" },
  { v: "Éducatif", l: "Éducatif" },
];

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Inspirant");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [busy, setBusy] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    getUsage().then(setUsage).catch(() => {});
  }, [user]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (topic.trim().length < 3) return toast.error("Décrivez votre idée (au moins 3 caractères).");
    setBusy(true);
    setContent(null);
    try {
      const res = await generateContent({ data: { topic: topic.trim(), tone, language } });
      setContent(res.content as GeneratedContent);
      setUsage({ used: res.creditsUsed, limit: res.creditsLimit });
      toast.success("Contenu généré !");
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de génération");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();
  const left = usage ? Math.max(0, usage.limit - usage.used) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            {left !== null && (
              <div className="hidden rounded-full border border-border bg-card/60 px-3 py-1 text-xs sm:flex">
                <span className="text-muted-foreground">Crédits :&nbsp;</span>
                <span className="font-semibold">{left}/{usage!.limit}</span>
              </div>
            )}
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">{initials}</div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.navigate({ to: "/history" })}>
                  <History className="mr-2 h-4 w-4" /> Historique
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.navigate({ to: "/pricing" })}>
                  Plans & tarifs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">Que voulez-vous publier aujourd'hui ?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Une idée. 13 contenus optimisés. En quelques secondes.</p>

        <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-card/40 p-4 md:p-5">
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Exemple : Je veux parler de leadership chrétien"
            className="min-h-32 resize-none border-0 bg-transparent text-base focus-visible:ring-0 md:text-lg"
            disabled={busy}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-auto min-w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={(v) => setLanguage(v as "fr" | "en")}>
              <SelectTrigger className="w-auto min-w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Button
              type="submit"
              size="lg"
              disabled={busy || (left !== null && left <= 0)}
              className="bg-brand-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90"
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Générer le contenu
            </Button>
          </div>

          {left !== null && left <= 0 && (
            <p className="mt-3 text-xs text-destructive">
              Limite quotidienne atteinte. <Link to="/pricing" className="underline">Passez au plan Pro</Link>.
            </p>
          )}
        </form>

        {/* Results */}
        <div id="results" className="mt-10">
          {busy && (
            <div className="grid gap-4 md:grid-cols-2">
              {PLATFORMS.map((p) => (
                <div key={p.key} className="rounded-2xl border border-border bg-card/30 p-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="mt-3 h-3 w-full" />
                  <Skeleton className="mt-2 h-3 w-5/6" />
                  <Skeleton className="mt-2 h-3 w-4/6" />
                </div>
              ))}
            </div>
          )}
          {!busy && content && <ResultsGrid content={content} />}
          {!busy && !content && (
            <div className="rounded-2xl border border-dashed border-border bg-card/20 p-10 text-center text-sm text-muted-foreground">
              Vos contenus apparaîtront ici.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
