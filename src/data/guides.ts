export interface Guide {
  id: string;
  title: string;
  kicker: string;
  excerpt: string;
  readMin: number;
  body: string[];
}

export const guides: Guide[] = [
  {
    id: "choosing-cpu",
    title: "How to choose the right CPU",
    kicker: "Fundamentals",
    readMin: 6,
    excerpt: "Cores, threads, clocks, and cache — what actually matters for your workload.",
    body: [
      "Your CPU is the conductor of every task your PC handles. Pick it for what you actually do — gaming workloads behave very differently from rendering or compiling code.",
      "For pure 1080p gaming, a 6-core chip with strong single-thread performance (Ryzen 5 7600, Core i5-13400F) is the sweet spot. Beyond 8 cores, returns flatten unless you encode video or render 3D.",
      "Pay attention to the platform: AM5 and LGA1700 give you DDR5 and a longer upgrade path. AM4 remains a fantastic budget platform if you want to spend more on the GPU.",
    ],
  },
  {
    id: "psu-sizing",
    title: "PSU sizing without the myths",
    kicker: "Power",
    readMin: 5,
    excerpt: "Wattage isn't a vanity metric. Here's how to size and certify your power supply.",
    body: [
      "Add CPU TDP + GPU TDP, then add ~150W headroom for the rest of the system and transient spikes. Aim to load the PSU around 50–70% for best efficiency.",
      "80 PLUS Gold is the modern baseline. Bronze is fine for budget builds; Platinum/Titanium are diminishing returns for most users.",
      "Buy from a reputable OEM. Cheap no-name PSUs are the single most common cause of inexplicable instability — and the only component that can take others with it when it fails.",
    ],
  },
  {
    id: "compatibility-101",
    title: "Compatibility 101",
    kicker: "Building",
    readMin: 7,
    excerpt: "Sockets, chipsets, RAM kits, and the small details that make a build actually boot.",
    body: [
      "CPU socket must match the motherboard socket exactly. AM5 CPUs need AM5 boards; LGA1700 needs LGA1700 — there are no adapters.",
      "RAM generation is tied to the CPU. AM5 and 12th/13th/14th-gen Intel use DDR5; AM4 uses DDR4. Always check the motherboard's QVL for tested kits at your target speed.",
      "Don't forget physical fit: GPU length, CPU cooler height, and PSU form factor against the case spec sheet. ITX builds especially live or die by millimeters.",
    ],
  },
  {
    id: "gpu-tier-guide",
    title: "Picking a GPU by resolution",
    kicker: "Graphics",
    readMin: 6,
    excerpt: "Match your GPU to your monitor — not the other way around.",
    body: [
      "1080p high refresh: RTX 4060 / RX 7600 deliver 100+ fps in modern titles with DLSS/FSR enabled.",
      "1440p sweet spot: RTX 4070 / RX 7800 XT give you maxed-out settings comfortably above 100 fps in most titles.",
      "4K and ultrawide: RTX 4080 SUPER and above. At this tier, also consider the rest of the system — a slow CPU will bottleneck even the best GPUs.",
    ],
  },
  {
    id: "cooling-guide",
    title: "Air vs AIO cooling",
    kicker: "Thermals",
    readMin: 5,
    excerpt: "When a $35 air cooler beats a $130 AIO — and when it doesn't.",
    body: [
      "Modern dual-tower air coolers like the Thermalright Peerless Assassin handle 200W+ CPUs in near silence and outlive most AIOs.",
      "240mm AIOs make sense for 125W+ Intel K-series and high-end Ryzen 9 chips, especially in cases with limited top clearance.",
      "360mm AIOs are for sustained all-core workloads — rendering, simulation, heavy compilation. For pure gaming, a good air cooler is almost always enough.",
    ],
  },
  {
    id: "storage-tiers",
    title: "Storage in 2025",
    kicker: "Storage",
    readMin: 4,
    excerpt: "Why every build now starts with NVMe — and where Gen4 actually matters.",
    body: [
      "Boot drive: 1TB NVMe Gen3 minimum. The OS, your apps, and 3–4 modern games will fill 500GB faster than you think.",
      "Gen4 NVMe matters for content creators moving large files. For gaming, real-world differences over Gen3 are minor today.",
      "SATA SSDs make sense only as bulk secondary storage. Mechanical hard drives belong in NAS builds, not your main PC.",
    ],
  },
];
