import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient shadow-md shadow-primary/30">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <span className="text-base font-semibold tracking-tight">
        Postify <span className="text-brand-gradient">AI</span>
      </span>
    </Link>
  );
}
