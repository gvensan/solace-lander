import {
  Network,
  Cable,
  Code2,
  PenTool,
  Activity,
  Bot,
  MessagesSquare,
  MessageCircle,
  FolderGit2,
  FileText,
  PlayCircle,
  Video,
  ScrollText,
  BarChart3,
  MonitorPlay,
  Trophy,
  FileSpreadsheet,
  Lightbulb,
  Newspaper,
  FlaskConical,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

// Maps data-driven icon names to lucide components.
const ICONS: Record<string, ComponentType<LucideProps>> = {
  Network,
  Cable,
  Code2,
  PenTool,
  Activity,
  Bot,
  MessagesSquare,
  MessageCircle,
  Github: FolderGit2, // lucide removed the Github brand icon; alias the data name
  FileText,
  PlayCircle,
  Video,
  ScrollText,
  BarChart3,
  MonitorPlay,
  Trophy,
  FileSpreadsheet,
  Lightbulb,
  Newspaper,
  FlaskConical,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name] ?? Network;
  return <Cmp {...props} />;
}
