// Realistic mock component database for RigWise.
// Prices in INR. Benchmark scores are approximate, representative figures.

export type Category = "cpu" | "gpu" | "motherboard" | "ram" | "storage" | "psu" | "cooler" | "case";

export interface PCComponent {
  id: string;
  category: Category;
  brand: string;
  name: string;
  price: number;       // INR
  tdp?: number;        // Watts
  socket?: string;
  chipset?: string;
  formFactor?: string;
  capacityGB?: number;
  speedMHz?: number;
  benchmark?: number;  // normalized 0-100 for headline score
  benchmarks?: Record<string, number>;
  link?: string;
  highlights?: string[];
}

export const components: PCComponent[] = [
  // CPUs
  { id: "cpu-r5-5600", category: "cpu", brand: "AMD", name: "Ryzen 5 5600", price: 12500, tdp: 65, socket: "AM4", benchmark: 72,
    benchmarks: { cinebenchR23: 11200, gamingFps1080p: 142 },
    link: "https://www.amazon.in/s?k=ryzen+5+5600",
    highlights: ["6 cores / 12 threads", "Great 1080p gaming value"] },
  { id: "cpu-r5-7600", category: "cpu", brand: "AMD", name: "Ryzen 5 7600", price: 21500, tdp: 65, socket: "AM5", benchmark: 84,
    benchmarks: { cinebenchR23: 15300, gamingFps1080p: 168 },
    link: "https://www.amazon.in/s?k=ryzen+5+7600",
    highlights: ["AM5 future-proof", "DDR5"] },
  { id: "cpu-r7-7700x", category: "cpu", brand: "AMD", name: "Ryzen 7 7700X", price: 28900, tdp: 105, socket: "AM5", benchmark: 90,
    benchmarks: { cinebenchR23: 19800, gamingFps1080p: 178 },
    link: "https://www.amazon.in/s?k=ryzen+7+7700x" },
  { id: "cpu-i3-13100f", category: "cpu", brand: "Intel", name: "Core i3-13100F", price: 9800, tdp: 58, socket: "LGA1700", benchmark: 58,
    benchmarks: { cinebenchR23: 9800, gamingFps1080p: 118 },
    link: "https://www.amazon.in/s?k=i3+13100f",
    highlights: ["Budget gaming", "No iGPU"] },
  { id: "cpu-i5-13400f", category: "cpu", brand: "Intel", name: "Core i5-13400F", price: 17500, tdp: 65, socket: "LGA1700", benchmark: 78,
    benchmarks: { cinebenchR23: 14200, gamingFps1080p: 156 } },
  { id: "cpu-i5-14600k", category: "cpu", brand: "Intel", name: "Core i5-14600K", price: 27500, tdp: 125, socket: "LGA1700", benchmark: 88,
    benchmarks: { cinebenchR23: 24300, gamingFps1080p: 182 } },
  { id: "cpu-i7-14700k", category: "cpu", brand: "Intel", name: "Core i7-14700K", price: 38900, tdp: 125, socket: "LGA1700", benchmark: 95,
    benchmarks: { cinebenchR23: 33800, gamingFps1080p: 196 } },
  { id: "cpu-r9-7900x", category: "cpu", brand: "AMD", name: "Ryzen 9 7900X", price: 39900, tdp: 170, socket: "AM5", benchmark: 96,
    benchmarks: { cinebenchR23: 28900, gamingFps1080p: 188 } },

  // GPUs
  { id: "gpu-rtx-4060", category: "gpu", brand: "NVIDIA", name: "RTX 4060 8GB", price: 27500, tdp: 115, benchmark: 70,
    benchmarks: { timespy: 10500, gamingFps1440p: 68 },
    link: "https://www.amazon.in/s?k=rtx+4060",
    highlights: ["DLSS 3", "Efficient"] },
  { id: "gpu-rtx-4060ti", category: "gpu", brand: "NVIDIA", name: "RTX 4060 Ti 8GB", price: 36900, tdp: 160, benchmark: 78,
    benchmarks: { timespy: 13900, gamingFps1440p: 82 } },
  { id: "gpu-rtx-4070", category: "gpu", brand: "NVIDIA", name: "RTX 4070 12GB", price: 52900, tdp: 200, benchmark: 86,
    benchmarks: { timespy: 17800, gamingFps1440p: 104 } },
  { id: "gpu-rtx-4070s", category: "gpu", brand: "NVIDIA", name: "RTX 4070 SUPER", price: 64900, tdp: 220, benchmark: 90,
    benchmarks: { timespy: 20100, gamingFps1440p: 118 } },
  { id: "gpu-rtx-4080s", category: "gpu", brand: "NVIDIA", name: "RTX 4080 SUPER", price: 99900, tdp: 320, benchmark: 96,
    benchmarks: { timespy: 28200, gamingFps1440p: 152 } },
  { id: "gpu-rx-7600", category: "gpu", brand: "AMD", name: "Radeon RX 7600 8GB", price: 24500, tdp: 165, benchmark: 66,
    benchmarks: { timespy: 10200, gamingFps1440p: 62 } },
  { id: "gpu-rx-7700xt", category: "gpu", brand: "AMD", name: "Radeon RX 7700 XT 12GB", price: 41900, tdp: 245, benchmark: 82,
    benchmarks: { timespy: 16400, gamingFps1440p: 96 } },
  { id: "gpu-rx-7800xt", category: "gpu", brand: "AMD", name: "Radeon RX 7800 XT 16GB", price: 52900, tdp: 263, benchmark: 88,
    benchmarks: { timespy: 18900, gamingFps1440p: 112 } },

  // Motherboards
  { id: "mb-b550m", category: "motherboard", brand: "MSI", name: "B550M-A PRO", price: 9500, socket: "AM4", chipset: "B550", formFactor: "mATX", benchmark: 60,
    highlights: ["DDR4", "Solid VRMs"] },
  { id: "mb-b650m", category: "motherboard", brand: "Gigabyte", name: "B650M DS3H", price: 14500, socket: "AM5", chipset: "B650", formFactor: "mATX", benchmark: 75 },
  { id: "mb-x670e", category: "motherboard", brand: "ASUS", name: "TUF X670E-PLUS", price: 27900, socket: "AM5", chipset: "X670E", formFactor: "ATX", benchmark: 92 },
  { id: "mb-b760m", category: "motherboard", brand: "MSI", name: "PRO B760M-A WiFi", price: 16500, socket: "LGA1700", chipset: "B760", formFactor: "mATX", benchmark: 76 },
  { id: "mb-z790", category: "motherboard", brand: "ASUS", name: "TUF Z790-PLUS WiFi", price: 28900, socket: "LGA1700", chipset: "Z790", formFactor: "ATX", benchmark: 90 },

  // RAM
  { id: "ram-ddr4-16-3200", category: "ram", brand: "Corsair", name: "Vengeance LPX 16GB (2x8) DDR4 3200", price: 3800, capacityGB: 16, speedMHz: 3200, benchmark: 60,
    highlights: ["DDR4", "Reliable"] },
  { id: "ram-ddr4-32-3600", category: "ram", brand: "G.Skill", name: "Ripjaws V 32GB (2x16) DDR4 3600", price: 7200, capacityGB: 32, speedMHz: 3600, benchmark: 72 },
  { id: "ram-ddr5-32-6000", category: "ram", brand: "Corsair", name: "Vengeance 32GB (2x16) DDR5 6000", price: 9900, capacityGB: 32, speedMHz: 6000, benchmark: 88 },
  { id: "ram-ddr5-64-6000", category: "ram", brand: "G.Skill", name: "Trident Z5 64GB (2x32) DDR5 6000", price: 19900, capacityGB: 64, speedMHz: 6000, benchmark: 95 },

  // Storage
  { id: "ssd-500-nvme", category: "storage", brand: "Crucial", name: "P3 500GB NVMe Gen3", price: 3200, capacityGB: 500, benchmark: 55,
    benchmarks: { read: 3500, write: 1900 } },
  { id: "ssd-1tb-nvme", category: "storage", brand: "Samsung", name: "980 1TB NVMe Gen3", price: 5900, capacityGB: 1000, benchmark: 70,
    benchmarks: { read: 3500, write: 3000 } },
  { id: "ssd-1tb-gen4", category: "storage", brand: "WD", name: "Black SN770 1TB Gen4", price: 6800, capacityGB: 1000, benchmark: 84,
    benchmarks: { read: 5150, write: 4900 } },
  { id: "ssd-2tb-gen4", category: "storage", brand: "Samsung", name: "990 PRO 2TB Gen4", price: 16900, capacityGB: 2000, benchmark: 96,
    benchmarks: { read: 7450, write: 6900 } },

  // PSUs
  { id: "psu-550-b", category: "psu", brand: "Corsair", name: "CV550 550W Bronze", price: 4200, tdp: 550, benchmark: 55 },
  { id: "psu-650-g", category: "psu", brand: "Corsair", name: "RM650 650W Gold", price: 8900, tdp: 650, benchmark: 80 },
  { id: "psu-750-g", category: "psu", brand: "Cooler Master", name: "MWE 750W Gold V2", price: 9900, tdp: 750, benchmark: 86 },
  { id: "psu-850-g", category: "psu", brand: "Corsair", name: "RM850x 850W Gold", price: 13900, tdp: 850, benchmark: 92 },

  // Coolers
  { id: "cool-stock", category: "cooler", brand: "AMD", name: "Wraith Stealth (Stock)", price: 0, benchmark: 30 },
  { id: "cool-pa120", category: "cooler", brand: "Thermalright", name: "Peerless Assassin 120 SE", price: 3500, benchmark: 72 },
  { id: "cool-aio240", category: "cooler", brand: "Deepcool", name: "LE520 240mm AIO", price: 7900, benchmark: 86 },
  { id: "cool-aio360", category: "cooler", brand: "Arctic", name: "Liquid Freezer III 360", price: 13900, benchmark: 96 },

  // Cases
  { id: "case-mb311", category: "case", brand: "Cooler Master", name: "MasterBox MB311L", price: 3900, formFactor: "mATX", benchmark: 60 },
  { id: "case-4000d", category: "case", brand: "Corsair", name: "4000D Airflow", price: 8500, formFactor: "ATX", benchmark: 88 },
  { id: "case-nr200", category: "case", brand: "Cooler Master", name: "NR200P", price: 7900, formFactor: "ITX", benchmark: 82 },
  { id: "case-pop-air", category: "case", brand: "Fractal", name: "Pop Air", price: 6900, formFactor: "ATX", benchmark: 78 },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function byCategory(cat: Category) {
  return components.filter((c) => c.category === cat);
}
