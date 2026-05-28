import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

const PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    desc: "Pour découvrir Postify AI",
    features: ["10 générations / jour", "13 plateformes", "Historique 30 jours", "Support communautaire"],
    cta: "Commencer",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19€",
    period: "/mois",
    desc: "Pour les créateurs réguliers",
    features: ["500 générations / mois", "Toutes les plateformes", "Historique illimité", "Tons personnalisés", "Support prioritaire"],
    cta: "Bientôt disponible",
    href: "#",
    highlight: true,
  },
  {
    name: "Business",
    price: "49€",
    period: "/mois",
    desc: "Pour les équipes et agences",
    features: ["Générations illimitées", "Multi-utilisateurs", "API access", "Marque blanche", "Support dédié"],
    cta: "Bientôt disponible",
    href: "#",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-5xl">Des tarifs simples</h1>
          <p className="mt-3 text-muted-foreground">Commencez gratuitement. Évoluez quand vous voulez.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${p.highlight ? "border-primary/50 bg-card shadow-xl shadow-primary/10" : "border-border bg-card/40"}`}
            >
              {p.highlight && (
                <div className="mb-3 inline-flex rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  Populaire
                </div>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={p.href} className="mt-6 block">
                <Button
                  className={`w-full ${p.highlight ? "bg-brand-gradient text-white" : ""}`}
                  variant={p.highlight ? "default" : "outline"}
                  disabled={p.href === "#"}
                >
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
