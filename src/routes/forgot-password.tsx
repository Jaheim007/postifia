import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Email envoyé. Vérifiez votre boîte de réception.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="p-4"><Logo /></header>
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4">
        <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recevez un lien de réinitialisation.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-brand-gradient text-white">Envoyer</Button>
        </form>
        <Link to="/login" className="mt-4 text-center text-xs text-muted-foreground hover:text-foreground">Retour à la connexion</Link>
      </main>
    </div>
  );
}
