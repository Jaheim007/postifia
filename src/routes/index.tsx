import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap, Globe, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PLATFORMS } from "@/lib/platforms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Postify AI — Créez du contenu viral pour tous vos réseaux sociaux" },
      { name: "description", content: "Une seule idée. Tous vos réseaux. Postify AI génère vos posts Facebook, X, Instagram, LinkedIn, TikTok, Discord, Snapchat, Telegram et plus en un clic." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Fonctionnalités</a>
            <a href="#platforms" className="hover:text-foreground">Plateformes</a>
            <Link to="/pricing" className="hover:text-foreground">Tarifs</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90">Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-[300px] w-[300px] rounded-full bg-brand-accent/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center md:pt-32 md:pb-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Propulsé par Gemini Flash
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Créez du contenu <span className="text-brand-gradient">viral</span><br />
            pour tous vos réseaux sociaux
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Facebook, X/Twitter, Instagram, LinkedIn, TikTok, Discord, Snapchat, Telegram et plus encore.
            Une idée, 13 contenus optimisés en quelques secondes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="bg-brand-gradient text-white hover:opacity-90 px-6">
                Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">Voir les tarifs</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">10 générations gratuites par jour. Sans carte bancaire.</p>
        </div>

        {/* Mockup */}
        <div className="mx-auto max-w-4xl px-4 pb-20">
          <div className="relative rounded-2xl border border-border bg-card/50 p-2 shadow-2xl shadow-primary/10 backdrop-blur">
            <div className="rounded-xl bg-background/80 p-4 md:p-6">
              <div className="mb-3 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Votre idée</p>
                <p className="mt-1 font-medium">Je veux parler de leadership chrétien</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PLATFORMS.slice(0, 8).map((p) => (
                  <div key={p.key} className="rounded-lg border border-border bg-card p-3 text-left">
                    <p.icon className="h-4 w-4" style={{ color: p.color }} />
                    <p className="mt-2 text-xs font-medium">{p.label}</p>
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full rounded bg-muted" />
                      <div className="h-1.5 w-4/5 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Zap, title: "Ultra rapide", desc: "Génération instantanée grâce à Gemini Flash. Quelques secondes, 13 contenus." },
            { icon: Globe, title: "Tous les réseaux", desc: "13 plateformes couvertes. Format natif pour chaque audience." },
            { icon: ShieldCheck, title: "Ultra simple", desc: "Une idée. Un bouton. Vos contenus. Aucune complexité." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card/40 p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">13 plateformes en un clic</h2>
        <p className="mt-2 text-center text-muted-foreground">Chaque post est optimisé pour son réseau.</p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {PLATFORMS.map((p) => (
            <div key={p.key} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4">
              <p.icon className="h-5 w-5 shrink-0" style={{ color: p.color }} />
              <span className="truncate text-sm font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Prêt à publier partout ?</h2>
        <p className="mt-3 text-muted-foreground">Rejoignez les créateurs qui gagnent des heures chaque semaine.</p>
        <Link to="/register" className="mt-8 inline-block">
          <Button size="lg" className="bg-brand-gradient text-white hover:opacity-90">
            Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> Sans carte bancaire</span>
          <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> 10 générations/jour</span>
          <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> Annulez à tout moment</span>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Postify AI · Votre IA de contenu social.
      </footer>
    </div>
  );
}
