/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

/**
 * RigWise scroll-driven 3D PC.
 * Components fly in from offscreen and snap into place as the user scrolls.
 * Reverse scroll = disassemble. Idle = soft rotation.
 */

type PartName = "case" | "motherboard" | "cpu" | "ram1" | "ram2" | "gpu" | "psu" | "cooler" | "ssd" | "panel";

interface PartConfig {
  name: PartName;
  label: string;
  spec: string;
  // final resting position (assembled)
  to: [number, number, number];
  // origin offset (where it flies in from)
  from: [number, number, number];
  // when it locks in (0..1 progress)
  start: number;
  end: number;
}

// All positions are relative to the case interior. The case sits centered.
const PARTS: PartConfig[] = [
  { name: "case",        label: "Mid-Tower Case",  spec: "Steel · Tempered glass",
    to: [0, 0, 0],         from: [0, -8, 0],   start: 0.0, end: 0.08 },
  { name: "motherboard", label: "Motherboard",     spec: "ATX · DDR5",
    to: [0, 0.05, -0.55],  from: [-6, 0, -0.55], start: 0.08, end: 0.22 },
  { name: "cpu",         label: "CPU",             spec: "8C / 16T · 5.2 GHz",
    to: [-0.35, 0.45, -0.5], from: [0, 6, -0.5], start: 0.22, end: 0.34 },
  { name: "cooler",      label: "AIO Cooler",      spec: "240mm · 2× fans",
    to: [-0.35, 0.45, -0.35], from: [0, 7, 0.5], start: 0.34, end: 0.46 },
  { name: "ram1",        label: "DDR5 32GB",       spec: "6000 MT/s · CL30",
    to: [0.25, 0.55, -0.5],  from: [6, 2, -0.5], start: 0.46, end: 0.55 },
  { name: "ram2",        label: "",                spec: "",
    to: [0.42, 0.55, -0.5],  from: [6, 2, -0.5], start: 0.5,  end: 0.58 },
  { name: "ssd",         label: "NVMe SSD",        spec: "1 TB · Gen4 · 7000 MB/s",
    to: [0.7, -0.4, -0.5],   from: [6, -3, -0.5], start: 0.55, end: 0.65 },
  { name: "gpu",         label: "Graphics Card",   spec: "12 GB · DLSS 3",
    to: [0, -0.25, -0.25],   from: [0, -7, 1.5],  start: 0.65, end: 0.78 },
  { name: "psu",         label: "Power Supply",    spec: "850W · 80+ Gold",
    to: [0, -1.05, -0.4],    from: [0, -8, -0.4], start: 0.78, end: 0.88 },
  { name: "panel",       label: "Tempered Glass",  spec: "Side panel · 4mm",
    to: [0.82, 0, 0],        from: [8, 0, 0],     start: 0.88, end: 1.0 },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function partProgress(p: PartConfig, scroll: number) {
  if (scroll <= p.start) return 0;
  if (scroll >= p.end) return 1;
  return easeOutCubic((scroll - p.start) / (p.end - p.start));
}

function lerp3(from: [number, number, number], to: [number, number, number], t: number): [number, number, number] {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, from[2] + (to[2] - from[2]) * t];
}

// Materials
const matMetal = new THREE.MeshStandardMaterial({ color: "#1c1c1c", metalness: 0.85, roughness: 0.35 });
const matMatte = new THREE.MeshStandardMaterial({ color: "#0e0e0e", metalness: 0.4, roughness: 0.7 });
const matSilver = new THREE.MeshStandardMaterial({ color: "#bfbfbf", metalness: 0.95, roughness: 0.2 });
const matBoard = new THREE.MeshStandardMaterial({ color: "#0a0a0a", metalness: 0.2, roughness: 0.8 });
const matGlass = new THREE.MeshPhysicalMaterial({
  color: "#1a1a1a", metalness: 0, roughness: 0.05,
  transmission: 0.85, thickness: 0.2, transparent: true, opacity: 0.35,
});
const matAccent = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.3 });

function CaseFrame() {
  // Open frame (no right side panel — that's the glass)
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, 0, -0.7]} material={matMatte}>
        <boxGeometry args={[1.7, 2.4, 0.05]} />
      </mesh>
      {/* Left side panel */}
      <mesh position={[-0.85, 0, 0]} material={matMatte}>
        <boxGeometry args={[0.05, 2.4, 1.4]} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 1.2, 0]} material={matMatte}>
        <boxGeometry args={[1.7, 0.05, 1.4]} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -1.2, 0]} material={matMatte}>
        <boxGeometry args={[1.7, 0.05, 1.4]} />
      </mesh>
      {/* PSU shroud */}
      <mesh position={[0, -0.85, 0]} material={matMetal}>
        <boxGeometry args={[1.65, 0.4, 1.35]} />
      </mesh>
      {/* Front */}
      <mesh position={[0, 0, 0.7]} material={matMatte}>
        <boxGeometry args={[1.7, 2.4, 0.05]} />
      </mesh>
      {/* Front mesh detail */}
      {[-0.7, -0.45, -0.2, 0.05, 0.3, 0.55, 0.8].map((y) => (
        <mesh key={y} position={[0, y, 0.74]} material={matSilver}>
          <boxGeometry args={[1.5, 0.02, 0.005]} />
        </mesh>
      ))}
      {/* Power button accent */}
      <mesh position={[0.7, 1.05, 0.74]} material={matAccent}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 24]} />
      </mesh>
    </group>
  );
}

function Motherboard() {
  return (
    <group>
      <mesh material={matBoard}>
        <boxGeometry args={[1.4, 1.7, 0.04]} />
      </mesh>
      {/* Socket */}
      <mesh position={[-0.35, 0.4, 0.03]} material={matMetal}>
        <boxGeometry args={[0.4, 0.4, 0.03]} />
      </mesh>
      {/* RAM slots */}
      {[0.18, 0.27, 0.36, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.03]} material={matMetal}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
        </mesh>
      ))}
      {/* Chipset heatsink */}
      <mesh position={[0.1, -0.2, 0.03]} material={matSilver}>
        <boxGeometry args={[0.25, 0.25, 0.05]} />
      </mesh>
      {/* PCIe slot */}
      <mesh position={[0.1, -0.55, 0.03]} material={matMetal}>
        <boxGeometry args={[0.9, 0.05, 0.04]} />
      </mesh>
      {/* M.2 strip */}
      <mesh position={[0.45, -0.05, 0.03]} material={matMatte}>
        <boxGeometry args={[0.45, 0.08, 0.02]} />
      </mesh>
      {/* I/O shield */}
      <mesh position={[-0.6, 0.7, 0.03]} material={matSilver}>
        <boxGeometry args={[0.18, 0.3, 0.04]} />
      </mesh>
    </group>
  );
}

function CPU() {
  return (
    <group>
      <mesh material={matBoard}>
        <boxGeometry args={[0.34, 0.34, 0.04]} />
      </mesh>
      <mesh position={[0, 0, 0.03]} material={matSilver}>
        <boxGeometry args={[0.26, 0.26, 0.02]} />
      </mesh>
    </group>
  );
}

function Cooler() {
  return (
    <group>
      {/* Pump block */}
      <mesh material={matMetal}>
        <cylinderGeometry args={[0.16, 0.16, 0.18, 32]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} material={matAccent}>
        <cylinderGeometry args={[0.08, 0.08, 0.005, 32]} />
      </mesh>
      {/* Tubes */}
      <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, 0.2]} material={matMatte}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 16]} />
      </mesh>
      <mesh position={[-0.05, 0.5, 0]} rotation={[0, 0, -0.2]} material={matMatte}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 16]} />
      </mesh>
      {/* Radiator + 2 fans on top */}
      <mesh position={[0, 1.0, 0.2]} material={matMetal}>
        <boxGeometry args={[0.3, 0.08, 0.85]} />
      </mesh>
      {[-0.2, 0.2].map((z) => (
        <group key={z} position={[0, 1.08, z]}>
          <mesh material={matMatte}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
          </mesh>
          <FanBlades />
        </group>
      ))}
    </group>
  );
}

function FanBlades() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 3;
  });
  return (
    <group ref={ref} position={[0, 0.025, 0]}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 7, 0]} material={matSilver}>
          <boxGeometry args={[0.32, 0.005, 0.04]} />
        </mesh>
      ))}
      <mesh material={matMetal}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
      </mesh>
    </group>
  );
}

function RAMStick() {
  return (
    <group>
      <mesh material={matBoard}>
        <boxGeometry args={[0.06, 0.4, 0.4]} />
      </mesh>
      {/* Heatspreader */}
      <mesh position={[0, 0.05, 0]} material={matSilver}>
        <boxGeometry args={[0.07, 0.35, 0.42]} />
      </mesh>
      {/* Top fin accents */}
      {[-0.15, -0.05, 0.05, 0.15].map((z) => (
        <mesh key={z} position={[0, 0.24, z]} material={matAccent}>
          <boxGeometry args={[0.08, 0.01, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

function GPU() {
  return (
    <group>
      {/* PCB */}
      <mesh position={[0, 0.05, 0]} material={matBoard}>
        <boxGeometry args={[1.3, 0.18, 0.5]} />
      </mesh>
      {/* Shroud */}
      <mesh material={matMetal}>
        <boxGeometry args={[1.4, 0.32, 0.6]} />
      </mesh>
      {/* Two fans */}
      {[-0.32, 0.32].map((x) => (
        <group key={x} position={[x, 0.17, 0]}>
          <mesh material={matMatte}>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
          </mesh>
          <FanBlades />
        </group>
      ))}
      {/* Backplate accent line */}
      <mesh position={[0, -0.16, 0.31]} material={matAccent}>
        <boxGeometry args={[1.2, 0.01, 0.005]} />
      </mesh>
      {/* IO bracket */}
      <mesh position={[-0.72, 0.05, 0]} material={matSilver}>
        <boxGeometry args={[0.04, 0.4, 0.55]} />
      </mesh>
    </group>
  );
}

function PSU() {
  return (
    <group>
      <mesh material={matMetal}>
        <boxGeometry args={[1.5, 0.3, 1.2]} />
      </mesh>
      {/* Fan grille */}
      <mesh position={[0, 0.16, 0]} material={matMatte}>
        <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <FanBlades />
      </mesh>
    </group>
  );
}

function SSD() {
  return (
    <group>
      <mesh material={matSilver}>
        <boxGeometry args={[0.5, 0.04, 0.16]} />
      </mesh>
      <mesh position={[0, 0.025, 0]} material={matAccent}>
        <boxGeometry args={[0.1, 0.005, 0.08]} />
      </mesh>
    </group>
  );
}

function GlassPanel() {
  return (
    <mesh material={matGlass}>
      <boxGeometry args={[0.04, 2.4, 1.4]} />
    </mesh>
  );
}

interface PartProps {
  scroll: number;
}

function Part({ name, scroll, children, hideLabelBefore = 0.95 }: { name: PartName; scroll: number; children: React.ReactNode; hideLabelBefore?: number; }) {
  const cfg = PARTS.find((p) => p.name === name)!;
  const t = partProgress(cfg, scroll);
  const [x, y, z] = lerp3(cfg.from, cfg.to, t);
  const opacity = t;
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(x, y, z);
    }
  });

  const showLabel = cfg.label && t > 0.6 && scroll < hideLabelBefore;

  return (
    <group ref={ref}>
      <group scale={opacity < 0.05 ? 0 : 1}>
        {children}
      </group>
      {showLabel && (
        <Html
          position={[cfg.to[0] > 0 ? 1.3 : -1.3, 0.15, 0]}
          center
          style={{ pointerEvents: "none" }}
          distanceFactor={6}
        >
          <div className="pointer-events-none whitespace-nowrap rounded-md border border-hairline bg-background/85 px-2.5 py-1.5 backdrop-blur-md">
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{cfg.label}</div>
            <div className="text-[11px] font-mono text-foreground">{cfg.spec}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function PCAssembly({ scroll }: PartProps) {
  const root = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (root.current) {
      // Slow continuous rotation, slightly faster while assembled
      const speed = 0.12 + scroll * 0.15;
      root.current.rotation.y += dt * speed;
    }
  });

  return (
    <group ref={root} rotation={[0, -0.4, 0]}>
      <Part name="case" scroll={scroll}><CaseFrame /></Part>
      <Part name="motherboard" scroll={scroll}><Motherboard /></Part>
      <Part name="cpu" scroll={scroll}><CPU /></Part>
      <Part name="cooler" scroll={scroll}><Cooler /></Part>
      <Part name="ram1" scroll={scroll}><RAMStick /></Part>
      <Part name="ram2" scroll={scroll}><RAMStick /></Part>
      <Part name="ssd" scroll={scroll}><SSD /></Part>
      <Part name="gpu" scroll={scroll}><GPU /></Part>
      <Part name="psu" scroll={scroll}><PSU /></Part>
      <Part name="panel" scroll={scroll}><GlassPanel /></Part>

      {/* Pedestal */}
      <mesh position={[0, -1.4, 0]} material={matMatte}>
        <cylinderGeometry args={[1.2, 1.4, 0.05, 64]} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#ffffff" />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#ffffff" />
      <spotLight position={[0, -3, 4]} angle={0.5} penumbra={1} intensity={0.4} color="#ffffff" />
    </>
  );
}

interface SceneProps {
  /** Scroll progress 0..1 from the parent section */
  progress: number;
}

function Scene({ progress }: SceneProps) {
  // Smooth the incoming progress for nicer motion
  const smoothed = useRef(progress);
  const [, force] = useState(0);
  useFrame(() => {
    const target = progress;
    smoothed.current += (target - smoothed.current) * 0.08;
    force((n) => (Math.abs(target - smoothed.current) > 0.001 ? n + 1 : n));
  });

  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
          <PCAssembly scroll={smoothed.current} />
        </Float>
        <Environment preset="studio" />
      </Suspense>
    </>
  );
}

interface PCSceneProps {
  progress: number;
  className?: string;
}

export function PCScene({ progress, className = "" }: PCSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [3.6, 1.4, 3.6], fov: 38 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}

/** Hook that returns scroll progress within a target element (0..1). */
export function useScrollProgress(target: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Section pinned for its full scroll length: progress = 0 when top hits 0,
      // = 1 when bottom has scrolled up by (height - vh).
      const total = rect.height - vh;
      if (total <= 0) {
        setP(0);
        return;
      }
      const scrolled = -rect.top;
      const next = Math.max(0, Math.min(1, scrolled / total));
      setP(next);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);
  return p;
}

export const ASSEMBLY_STAGES = useMemoStages();

function useMemoStages() {
  // Static label list for the side rail
  return [
    { at: 0.05, title: "The Case", body: "It begins with a frame — steel, glass, intent." },
    { at: 0.18, title: "Motherboard", body: "The nervous system that ties it all together." },
    { at: 0.3,  title: "CPU & Cooler", body: "Compute and thermals locked into place." },
    { at: 0.5,  title: "Memory & Storage", body: "Speed where it matters most." },
    { at: 0.72, title: "Graphics", body: "Pixels rendered, frames delivered." },
    { at: 0.85, title: "Power", body: "Clean, efficient, sized for the load." },
    { at: 0.97, title: "Sealed", body: "Glass on. Build complete." },
  ];
}
