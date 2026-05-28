import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Music2,
  MessageCircle,
  Ghost,
  Send,
  MessagesSquare,
  Hash,
  Image as ImageIcon,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type PlatformKey =
  | "facebook"
  | "twitter"
  | "instagram_caption"
  | "instagram_carousel"
  | "linkedin"
  | "tiktok"
  | "discord"
  | "snapchat"
  | "telegram"
  | "whatsapp"
  | "hashtags"
  | "image_prompt"
  | "cta";

export const PLATFORMS: { key: PlatformKey; label: string; icon: LucideIcon; color: string }[] = [
  { key: "facebook",            label: "Facebook",            icon: Facebook,        color: "#1877F2" },
  { key: "twitter",             label: "X / Twitter Thread",  icon: Twitter,         color: "#000000" },
  { key: "instagram_caption",   label: "Instagram Caption",   icon: Instagram,       color: "#E1306C" },
  { key: "instagram_carousel",  label: "Instagram Carrousel", icon: Instagram,       color: "#C13584" },
  { key: "linkedin",            label: "LinkedIn",            icon: Linkedin,        color: "#0A66C2" },
  { key: "tiktok",              label: "TikTok / Reels",      icon: Music2,          color: "#FE2C55" },
  { key: "discord",             label: "Discord",             icon: MessagesSquare,  color: "#5865F2" },
  { key: "snapchat",            label: "Snapchat",            icon: Ghost,           color: "#FFFC00" },
  { key: "telegram",            label: "Telegram",            icon: Send,            color: "#26A5E4" },
  { key: "whatsapp",            label: "WhatsApp",            icon: MessageCircle,   color: "#25D366" },
  { key: "hashtags",            label: "Hashtags",            icon: Hash,            color: "#8B5CF6" },
  { key: "image_prompt",        label: "Prompt image IA",     icon: ImageIcon,       color: "#6366F1" },
  { key: "cta",                 label: "Call To Action",      icon: Megaphone,       color: "#F59E0B" },
];

export type GeneratedContent = Record<PlatformKey, string>;
