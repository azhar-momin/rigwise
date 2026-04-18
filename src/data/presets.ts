import { components } from "./components";

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  budget: number;
  useCase: "Office" | "Gaming" | "Editing" | "General" | "Creator";
  partIds: string[];
}

const pick = (id: string) => components.find((c) => c.id === id)!;

export const presets: Preset[] = [
  {
    id: "office-30k",
    name: "Office Essential",
    tagline: "Quiet, efficient, all-day productivity.",
    budget: 30000,
    useCase: "Office",
    partIds: ["cpu-i3-13100f", "mb-b760m", "ram-ddr4-16-3200", "ssd-500-nvme", "psu-550-b", "cool-stock", "case-mb311"],
  },
  {
    id: "gaming-60k",
    name: "1080p Gaming",
    tagline: "High-refresh esports & AAA at 1080p Ultra.",
    budget: 60000,
    useCase: "Gaming",
    partIds: ["cpu-r5-5600", "mb-b550m", "ram-ddr4-16-3200", "gpu-rtx-4060", "ssd-1tb-nvme", "psu-650-g", "cool-pa120", "case-4000d"],
  },
  {
    id: "creator-100k",
    name: "Creator Workstation",
    tagline: "Editing, rendering, multi-tasking.",
    budget: 100000,
    useCase: "Creator",
    partIds: ["cpu-r7-7700x", "mb-b650m", "ram-ddr5-32-6000", "gpu-rtx-4070", "ssd-1tb-gen4", "psu-750-g", "cool-aio240", "case-4000d"],
  },
  {
    id: "gaming-150k",
    name: "1440p Enthusiast",
    tagline: "Maxed-out 1440p, ray tracing, DLSS.",
    budget: 150000,
    useCase: "Gaming",
    partIds: ["cpu-i5-14600k", "mb-z790", "ram-ddr5-32-6000", "gpu-rtx-4070s", "ssd-1tb-gen4", "psu-850-g", "cool-aio240", "case-4000d"],
  },
  {
    id: "studio-220k",
    name: "Studio Powerhouse",
    tagline: "8K editing, 3D rendering, no compromise.",
    budget: 220000,
    useCase: "Editing",
    partIds: ["cpu-r9-7900x", "mb-x670e", "ram-ddr5-64-6000", "gpu-rtx-4080s", "ssd-2tb-gen4", "psu-850-g", "cool-aio360", "case-4000d"],
  },
  {
    id: "compact-90k",
    name: "Compact ITX",
    tagline: "Small form factor, big performance.",
    budget: 90000,
    useCase: "Gaming",
    partIds: ["cpu-r5-7600", "mb-b650m", "ram-ddr5-32-6000", "gpu-rtx-4060ti", "ssd-1tb-gen4", "psu-650-g", "cool-aio240", "case-nr200"],
  },
];

export function presetTotal(p: Preset) {
  return p.partIds.reduce((sum, id) => sum + (pick(id)?.price ?? 0), 0);
}

export function presetParts(p: Preset) {
  return p.partIds.map(pick);
}
