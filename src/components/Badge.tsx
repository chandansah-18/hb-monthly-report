import type { BadgeTone } from "../types";

const toneClassMap: Record<BadgeTone, string> = {
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
  blue: "badge-blue",
  gray: "badge-gray",
};

export function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  return <span className={`badge ${toneClassMap[tone]}`}>{label}</span>;
}
