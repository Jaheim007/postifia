import { useState } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PLATFORMS, type GeneratedContent, type PlatformKey } from "@/lib/platforms";

export function ResultsGrid({
  content,
  onRegenerate,
  regenerating,
}: {
  content: GeneratedContent;
  onRegenerate?: (k: PlatformKey) => void;
  regenerating?: PlatformKey | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PLATFORMS.map((p) => (
        <ResultCard
          key={p.key}
          platform={p}
          text={content[p.key] ?? ""}
          onRegenerate={onRegenerate ? () => onRegenerate(p.key) : undefined}
          isRegenerating={regenerating === p.key}
        />
      ))}
    </div>
  );
}

function ResultCard({
  platform,
  text,
  onRegenerate,
  isRegenerating,
}: {
  platform: (typeof PLATFORMS)[number];
  text: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const Icon = platform.icon;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${platform.label} copié !`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card/40 transition hover:border-primary/40">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: platform.color }} />
          <span className="text-sm font-semibold">{platform.label}</span>
        </div>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <Button size="icon" variant="ghost" onClick={onRegenerate} disabled={isRegenerating} aria-label="Régénérer">
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={copy} aria-label="Copier">
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-foreground/90">
        {text || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}
