import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12 11v3.2h5.3c-.2 1.4-1.7 4.1-5.3 4.1-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 4.3 14.5 3.5 12 3.5 6.9 3.5 2.8 7.6 2.8 12.5S6.9 21.5 12 21.5c6.9 0 9.3-4.8 9.3-7.4 0-.5-.1-.9-.1-1.1H12z"/>
    </svg>
  );
}

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Bienvenue !");
    navigate({ to: "/dashboard" });
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) toast.error(r.error.message);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="p-4"><Logo /></header>
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-8">
        <h1 className="text-2xl font-bold">Se connecter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bon retour sur Postify AI.</p>
        <Button onClick={google} variant="outline" className="mt-6 w-full gap-2">
          <GoogleIcon /> Continuer avec Google
        </Button>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-brand-gradient text-white">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <Link to="/forgot-password" className="hover:text-foreground">Mot de passe oublié ?</Link>
          <Link to="/register" className="hover:text-foreground">Créer un compte</Link>
        </div>
      </main>
    </div>
  );
}
