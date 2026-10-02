import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTelemetry } from '../../context/TelemetryContext';
import { STATIONS_METADATA } from '../../data/stationsData';
import type { ModuleHotspot } from '../../types/telemetry';
import { HotspotDrawer } from './HotspotDrawer';
import { LowBandwidthView } from './LowBandwidthView';
import {
  CloudSnow,
  Compass,
  Flame,
  Moon,
  Sun,
  Grid,
} from 'lucide-react';

type ViewMode = 'day' | 'thermal' | 'aurora' | 'wireframe';
type CameraPreset = 'overview' | 'power' | 'living' | 'fuel' | 'meteo';

/* =========================================================================
   PROCEDURAL TEXTURE GENERATORS (Authentic High-Res Polar Architectural Textures)
   ========================================================================= */

// 1. Rocky Moraine Terrain Texture (Schirmacher Oasis & Larsemann Hills)
function createRockyMoraineTexture(isMaitri: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base Earthy Moraine Background (Brown, Ochre, Grey Gravel)
  ctx.fillStyle = isMaitri ? '#827361' : '#938470';
  ctx.fillRect(0, 0, 1024, 1024);

  // Gravel, pebbles, and rock noise
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 2.5 + 0.5;
    const shade = Math.floor(Math.random() * 70 - 35);
    ctx.fillStyle = `rgb(${130 + shade}, ${115 + shade}, ${98 + shade})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scattered Boulders
  for (let b = 0; b < 250; b++) {
    const bx = Math.random() * 1024;
    const by = Math.random() * 1024;
    const bw = Math.random() * 12 + 4;
    const bh = Math.random() * 8 + 3;
    ctx.fillStyle = Math.random() > 0.5 ? '#5c5245' : '#453e34';
    ctx.beginPath();
    ctx.ellipse(bx, by, bw, bh, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vehicle dirt tracks on Maitri / Bharati moraine
  ctx.strokeStyle = 'rgba(70, 60, 48, 0.45)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(100, 900);
  ctx.bezierCurveTo(350, 750, 450, 550, 850, 450);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(350, 750);
  ctx.bezierCurveTo(450, 800, 600, 780, 950, 850);
  ctx.stroke();

  // Natural snow drift patches nestled in depressions
  const snowPatches = isMaitri ? 120 : 160;
  for (let s = 0; s < snowPatches; s++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 1024;
    const sw = Math.random() * 45 + 15;
    const sh = Math.random() * 25 + 8;
    const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, sw);
    grad.addColorStop(0, 'rgba(235, 243, 250, 0.88)');
    grad.addColorStop(0.6, 'rgba(220, 232, 242, 0.55)');
    grad.addColorStop(1, 'rgba(220, 232, 242, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(sx, sy, sw, sh, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// 2. Bharati Metallic Panel Cladding Texture
function createBharatiFacadeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth composite metallic silver-grey
  ctx.fillStyle = '#8C97A0';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal architectural panel seams
  ctx.strokeStyle = '#5E6971';
  ctx.lineWidth = 3;
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Subtle rivet/fastener dots along seam
    ctx.fillStyle = '#4A535A';
    for (let x = 16; x < 512; x += 32) {
      ctx.fillRect(x, y - 1, 2, 2);
    }
  }

  // Vertical panel break lines
  ctx.strokeStyle = 'rgba(94, 105, 113, 0.7)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Continuous Ribbon Window Strip Texture (Bharati)
function createRibbonWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Deep tinted architectural glass
  ctx.fillStyle = '#102230';
  ctx.fillRect(0, 0, 1024, 128);

  // Subtle interior warm glow / reflection gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, 'rgba(40, 80, 110, 0.6)');
  grad.addColorStop(0.5, 'rgba(15, 35, 50, 0.9)');
  grad.addColorStop(1, 'rgba(30, 60, 80, 0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 128);

  // Window mullions (vertical dividers every 48px)
  ctx.fillStyle = '#3A444C';
  for (let x = 0; x < 1024; x += 48) {
    ctx.fillRect(x, 0, 4, 128);
  }

  // Horizontal window frame border
  ctx.fillStyle = '#2A333A';
  ctx.fillRect(0, 0, 1024, 6);
  ctx.fillRect(0, 122, 1024, 6);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Roof Solar PV Panel Texture
function createSolarGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep navy monocrystalline silicon
  ctx.fillStyle = '#152438';
  ctx.fillRect(0, 0, 256, 256);

  // Cell borders
  ctx.strokeStyle = '#284666';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  // Silver busbars
  ctx.strokeStyle = '#8EADC9';
  ctx.lineWidth = 1;
  for (let i = 16; i <= 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

// 5. Corrugated Shipping Container Texture (Maitri & Bharati logistics)
function createContainerTexture(colorHex: string, label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 256);

  // Corrugation vertical ridges (shadows and highlights)
  for (let x = 0; x < 512; x += 16) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(x, 0, 5, 256);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x + 5, 0, 4, 256);
  }

  // White stencil label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(label, 40, 135);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6. Indian National Flag Texture
function createIndianFlagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;

  // Saffron
  ctx.fillStyle = '#FF9933';
  ctx.fillRect(0, 0, 300, 66.6);

  // White
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 66.6, 300, 66.6);

  // Green
  ctx.fillStyle = '#138808';
  ctx.fillRect(0, 133.3, 300, 66.6);

  // Navy Blue Ashoka Chakra in center
  ctx.strokeStyle = '#000080';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(150, 100, 22, 0, Math.PI * 2);
  ctx.stroke();

  // 24 Spokes
  for (let s = 0; s < 24; s++) {
    const angle = (s * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(150 + Math.cos(angle) * 22, 100 + Math.sin(angle) * 22);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

/* =========================================================================
   MAIN POLAR 3D TWIN COMPONENT
   ========================================================================= */

export const PolarStation3D: React.FC = () => {
  const {
    activeStation,
    hotspots,
    setSelectedHotspot,
    lowBandwidthMode,
    telemetry,
  } = useTelemetry();

  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [hoveredHotspot, setHoveredHotspot] = useState<ModuleHotspot | null>(null);
  const [isBlizzard, setIsBlizzard] = useState<boolean>(true);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);
  const snowParticlesRef = useRef<THREE.Points | null>(null);
  const hotspotMeshesRef = useRef<{ mesh: THREE.Mesh; ring: THREE.Mesh; hotspot: ModuleHotspot }[]>([]);
  const animatedElements = useRef<THREE.Object3D[]>([]);
  const windSpeedRef = useRef(telemetry.windSpeedKnots);
  const hotspotsRef = useRef(hotspots);
  windSpeedRef.current = telemetry.windSpeedKnots;
  hotspotsRef.current = hotspots;

  // Orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 1.8, 0));
  const cameraSpherical = useRef({ radius: 32, theta: Math.PI / 4, phi: Math.PI / 3.4 });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const metadata = STATIONS_METADATA[activeStation];

  // Camera presets
  const applyCameraPreset = (preset: CameraPreset) => {
    if (preset === 'overview') {
      cameraSpherical.current = { radius: 32, theta: Math.PI / 4, phi: Math.PI / 3.4 };
      cameraTargetRef.current.set(0, 2.0, 0);
    } else if (preset === 'power') {
      if (activeStation === 'bharati') {
        cameraSpherical.current = { radius: 18, theta: -Math.PI / 3, phi: Math.PI / 3.8 };
        cameraTargetRef.current.set(0, 2.2, -3.0);
      } else {
        cameraSpherical.current = { radius: 18, theta: -Math.PI / 2.5, phi: Math.PI / 3.8 };
        cameraTargetRef.current.set(-4.0, 2.4, -0.5);
      }
    } else if (preset === 'living') {
      if (activeStation === 'bharati') {
        cameraSpherical.current = { radius: 16, theta: Math.PI * 0.45, phi: Math.PI / 3.6 };
        cameraTargetRef.current.set(-1.5, 3.8, 5.5);
      } else {
        cameraSpherical.current = { radius: 18, theta: Math.PI * 0.35, phi: Math.PI / 3.6 };
        cameraTargetRef.current.set(-6.5, 2.4, 3.0);
      }
    } else if (preset === 'fuel') {
      if (activeStation === 'bharati') {
        cameraSpherical.current = { radius: 18, theta: Math.PI * 0.8, phi: Math.PI / 3.6 };
        cameraTargetRef.current.set(8.5, 1.8, 3.5);
      } else {
        cameraSpherical.current = { radius: 20, theta: -Math.PI * 0.75, phi: Math.PI / 3.8 };
        cameraTargetRef.current.set(-6.0, 2.2, -6.5);
      }
    } else if (preset === 'meteo') {
      if (activeStation === 'bharati') {
        cameraSpherical.current = { radius: 16, theta: 0, phi: Math.PI / 4.2 };
        cameraTargetRef.current.set(0, 5.2, 0);
      } else {
        cameraSpherical.current = { radius: 16, theta: Math.PI * 0.2, phi: Math.PI / 3.8 };
        cameraTargetRef.current.set(3.0, 3.5, 6.0);
      }
    }
  };

  useEffect(() => {
    if (lowBandwidthMode) return;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    animatedElements.current = [];

    const bgColors: Record<ViewMode, number> = {
      day: 0x090F1B,
      thermal: 0x040710,
      aurora: 0x020814,
      wireframe: 0x010307,
    };
    scene.background = new THREE.Color(bgColors[viewMode]);
    scene.fog = new THREE.FogExp2(bgColors[viewMode], 0.016);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Photorealistic Antarctic Sun & Sky Lighting
    const ambientLight = new THREE.AmbientLight(
      viewMode === 'aurora' ? 0x00f2fe : viewMode === 'thermal' ? 0x1a2b4c : 0xb8d4eb,
      viewMode === 'aurora' ? 0.7 : 0.85
    );
    scene.add(ambientLight);

    // Low Antarctic sun casting realistic long shadows across the gravel
    const sunLight = new THREE.DirectionalLight(0xfff8ee, viewMode === 'aurora' ? 0.4 : 1.35);
    sunLight.position.set(24, 18, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Fill skylight (cool blue reflection from polar sky)
    const skyFill = new THREE.DirectionalLight(0x7096b8, 0.5);
    skyFill.position.set(-18, 12, -18);
    scene.add(skyFill);

    // 5. Procedural Moraine Ground
    const isMaitri = activeStation === 'maitri';
    const groundTex = createRockyMoraineTexture(isMaitri);
    const groundGeo = new THREE.PlaneGeometry(80, 80, 64, 64);
    groundGeo.rotateX(-Math.PI / 2);

    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const gx = pos.getX(i);
      const gz = pos.getZ(i);
      const dist = Math.sqrt(gx * gx + gz * gz);
      let gy = (Math.sin(gx * 0.12) * Math.cos(gz * 0.14) * 0.7);
      if (dist > 12) {
        gy += Math.sin(gx * 0.08) * 1.8 + Math.cos(gz * 0.09) * 1.4;
      }
      pos.setY(i, gy);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      map: viewMode === 'wireframe' ? undefined : groundTex,
      color: viewMode === 'thermal' ? 0x071120 : viewMode === 'wireframe' ? 0x00f2fe : 0xd6cbbd,
      roughness: 0.95,
      metalness: 0.05,
      wireframe: viewMode === 'wireframe',
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -0.05;
    scene.add(groundMesh);

    // Helper: Indian National Flagpole
    const createFlagpole = (fx: number, fz: number) => {
      const poleGroup = new THREE.Group();
      poleGroup.position.set(fx, 0, fz);

      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 7.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
      );
      mast.position.y = 3.75;
      mast.castShadow = true;
      poleGroup.add(mast);

      const flagTex = createIndianFlagTexture();
      const flagGeo = new THREE.PlaneGeometry(1.6, 1.0);
      const flagMat = new THREE.MeshStandardMaterial({
        map: flagTex,
        side: THREE.DoubleSide,
        roughness: 0.6,
      });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(0.8, 6.8, 0);
      flag.rotation.y = Math.PI / 4;
      poleGroup.add(flag);

      return poleGroup;
    };

    // Helper: ISO Shipping Container
    const createContainer = (cx: number, cy: number, cz: number, ry: number, color: string, label: string) => {
      const cGeo = new THREE.BoxGeometry(4.2, 1.8, 1.8);
      const tex = createContainerTexture(color, label);
      const cMat = new THREE.MeshStandardMaterial({
        map: viewMode === 'wireframe' ? undefined : tex,
        color: viewMode === 'thermal' ? (color === '#E65100' ? 0xff4500 : 0x00a8ff) : (viewMode === 'wireframe' ? 0x00f2fe : undefined),
        metalness: 0.4,
        roughness: 0.6,
        wireframe: viewMode === 'wireframe',
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(cx, cy + 0.9, cz);
      cMesh.rotation.y = ry;
      cMesh.castShadow = true;
      cMesh.receiveShadow = true;
      return cMesh;
    };

    // =========================================================================
    // MODEL 1: BHARATI RESEARCH STATION (Exact Architecture from Reference Image 1)
    // =========================================================================
    if (activeStation === 'bharati') {
      const bharatiGroup = new THREE.Group();

      const facadeTex = createBharatiFacadeTexture();
      const windowTex = createRibbonWindowTexture();
      const solarTex = createSolarGridTexture();

      const hullMat = new THREE.MeshStandardMaterial({
        map: viewMode === 'wireframe' ? undefined : facadeTex,
        color: viewMode === 'thermal' ? 0xff5500 : (viewMode === 'wireframe' ? 0x00f2fe : 0xA2ACB5),
        metalness: 0.72,
        roughness: 0.28,
        wireframe: viewMode === 'wireframe',
      });

      const ribbonWindowMat = new THREE.MeshStandardMaterial({
        map: viewMode === 'wireframe' ? undefined : windowTex,
        color: viewMode === 'thermal' ? 0x00f2fe : (viewMode === 'wireframe' ? 0x00f2fe : 0x1b2d3d),
        roughness: 0.15,
        metalness: 0.85,
        wireframe: viewMode === 'wireframe',
      });

      // 1. Aerodynamic Main Hull Body
      const hullWidth = 8.6;
      const hullLength = 22.0;
      const hullHeight = 3.6;
      const stiltElevationY = 2.6; // elevated on stilts above ground

      // Central core
      const coreGeo = new THREE.BoxGeometry(hullWidth, hullHeight, hullLength);
      const coreMesh = new THREE.Mesh(coreGeo, hullMat);
      coreMesh.position.set(0, stiltElevationY + hullHeight / 2, 0);
      coreMesh.castShadow = true;
      coreMesh.receiveShadow = true;
      bharatiGroup.add(coreMesh);

      // Angled Chamfered Underside (Aerodynamic hull bottom seen in photo)
      const underBevelShape = new THREE.Shape();
      underBevelShape.moveTo(-hullWidth / 2, 0);
      underBevelShape.lineTo(hullWidth / 2, 0);
      underBevelShape.lineTo(hullWidth / 2 - 1.2, -1.2);
      underBevelShape.lineTo(-hullWidth / 2 + 1.2, -1.2);
      underBevelShape.closePath();

      const extrudeSettings = { depth: hullLength, bevelEnabled: false };
      const underGeo = new THREE.ExtrudeGeometry(underBevelShape, extrudeSettings);
      underGeo.center();
      const underMesh = new THREE.Mesh(underGeo, hullMat);
      underMesh.position.set(0, stiltElevationY, 0);
      underMesh.castShadow = true;
      underMesh.receiveShadow = true;
      bharatiGroup.add(underMesh);

      // 2. Front Cantilevered Panoramic Observation Glass Lounge (Facing Positive Z)
      const frontGlassGeo = new THREE.BoxGeometry(hullWidth - 0.4, 2.2, 0.4);
      const frontGlassMat = new THREE.MeshStandardMaterial({
        color: 0x00F2FE,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.72,
        emissive: 0x004455,
        emissiveIntensity: 0.35,
      });
      const frontGlass = new THREE.Mesh(frontGlassGeo, frontGlassMat);
      frontGlass.position.set(0, stiltElevationY + 1.8, hullLength / 2 + 0.1);
      bharatiGroup.add(frontGlass);

      // Structural vertical mullions across panoramic front window
      for (let mx = -3.6; mx <= 3.6; mx += 1.2) {
        const mullion = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 2.3, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x2A333A, metalness: 0.8 })
        );
        mullion.position.set(mx, stiltElevationY + 1.8, hullLength / 2 + 0.1);
        bharatiGroup.add(mullion);
      }

      // 3. Continuous Ribbon Windows on Long Lateral Walls (Left & Right)
      const ribbonGeo = new THREE.PlaneGeometry(hullLength - 2.0, 1.2);
      const leftRibbon = new THREE.Mesh(ribbonGeo, ribbonWindowMat);
      leftRibbon.rotation.y = -Math.PI / 2;
      leftRibbon.position.set(-hullWidth / 2 - 0.02, stiltElevationY + 2.0, 0);
      bharatiGroup.add(leftRibbon);

      const rightRibbon = new THREE.Mesh(ribbonGeo, ribbonWindowMat);
      rightRibbon.rotation.y = Math.PI / 2;
      rightRibbon.position.set(hullWidth / 2 + 0.02, stiltElevationY + 2.0, 0);
      bharatiGroup.add(rightRibbon);

      // 4. Rooftop Structure & Observation Penthouse Deck
      const roofTopY = stiltElevationY + hullHeight;

      // Solar PV Panels on Rooftop Wings
      const solarRoofGeo = new THREE.PlaneGeometry(hullWidth - 0.6, hullLength - 1.0);
      solarRoofGeo.rotateX(-Math.PI / 2);
      const solarRoofMat = new THREE.MeshStandardMaterial({
        map: viewMode === 'wireframe' ? undefined : solarTex,
        color: viewMode === 'wireframe' ? 0x00f2fe : 0x1A2B3C,
        metalness: 0.85,
        roughness: 0.25,
      });
      const solarRoof = new THREE.Mesh(solarRoofGeo, solarRoofMat);
      solarRoof.position.set(0, roofTopY + 0.02, 0);
      bharatiGroup.add(solarRoof);

      // Raised central observation penthouse
      const penthouseGeo = new THREE.BoxGeometry(5.2, 1.6, 6.4);
      const penthouse = new THREE.Mesh(penthouseGeo, hullMat);
      penthouse.position.set(0, roofTopY + 0.8, -1.0);
      penthouse.castShadow = true;
      bharatiGroup.add(penthouse);

      // Rooftop terrace perimeter railings (tubular steel)
      const railMat = new THREE.MeshStandardMaterial({ color: 0xD0D7DE, metalness: 0.9, roughness: 0.2 });
      const railPostGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8);
      const railPosts = [
        [-2.4, -4.0], [2.4, -4.0], [-2.4, 2.0], [2.4, 2.0],
        [-2.4, -1.0], [2.4, -1.0], [0, -4.0], [0, 2.0]
      ];
      railPosts.forEach(([rx, rz]) => {
        const post = new THREE.Mesh(railPostGeo, railMat);
        post.position.set(rx, roofTopY + 2.1, rz);
        bharatiGroup.add(post);
      });

      // Anemometer & weather mast on roof
      const metMast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      metMast.position.set(-1.8, roofTopY + 2.8, -1.0);
      bharatiGroup.add(metMast);

      // 5. Heavy V-Shaped Structural Steel Stilts (Exact Pylons from Photo)
      const stiltMat = new THREE.MeshStandardMaterial({
        color: 0x22272E,
        metalness: 0.85,
        roughness: 0.35,
      });
      const concretePedestalMat = new THREE.MeshStandardMaterial({
        color: 0x8C9298,
        roughness: 0.9,
      });

      const stiltPylonStationsZ = [-8.5, -4.5, -0.5, 3.5, 7.5];
      stiltPylonStationsZ.forEach((sz) => {
        // Left V-Leg
        const legGeo = new THREE.CylinderGeometry(0.14, 0.16, stiltElevationY * 1.15, 12);
        const legLeft = new THREE.Mesh(legGeo, stiltMat);
        legLeft.position.set(-2.8, stiltElevationY / 2, sz);
        legLeft.rotation.z = 0.22;
        legLeft.castShadow = true;
        bharatiGroup.add(legLeft);

        // Right V-Leg
        const legRight = new THREE.Mesh(legGeo, stiltMat);
        legRight.position.set(2.8, stiltElevationY / 2, sz);
        legRight.rotation.z = -0.22;
        legRight.castShadow = true;
        bharatiGroup.add(legRight);

        // Concrete foundation pedestals
        const pedLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 12), concretePedestalMat);
        pedLeft.position.set(-3.2, 0.15, sz);
        pedLeft.receiveShadow = true;
        bharatiGroup.add(pedLeft);

        const pedRight = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 12), concretePedestalMat);
        pedRight.position.set(3.2, 0.15, sz);
        pedRight.receiveShadow = true;
        bharatiGroup.add(pedRight);
      });

      // 6. Access Staircase with Handrails Leading Underneath
      const stairMat = new THREE.MeshStandardMaterial({ color: 0x6E7681, metalness: 0.7 });
      const stairFlight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 4.5), stairMat);
      stairFlight.position.set(2.4, stiltElevationY / 2, -6.5);
      stairFlight.rotation.x = -0.52;
      bharatiGroup.add(stairFlight);

      // 7. Ground Logistics: Red Maritime Shipping Containers (from Photo)
      bharatiGroup.add(createContainer(8.5, 0, 3.5, 0.1, '#B93826', 'NCPOR-01'));
      bharatiGroup.add(createContainer(8.5, 0, 5.8, 0.05, '#B93826', 'NCPOR-02'));
      bharatiGroup.add(createContainer(8.5, 1.8, 4.6, 0.08, '#D84315', 'POLAR-JET'));
      bharatiGroup.add(createContainer(-8.0, 0, -3.0, 0.3, '#3F51B5', 'SCIENCE-01'));

      // 8. Tracked Arctic Bulldozer / Snowcat Excavator (Visible in Photo Background)
      const dozerGroup = new THREE.Group();
      dozerGroup.position.set(-11.0, 0, 6.0);
      dozerGroup.rotation.y = -0.4;

      const dozerBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.4, 3.2),
        new THREE.MeshStandardMaterial({ color: 0xD4A017, roughness: 0.4 })
      );
      dozerBody.position.y = 1.2;
      dozerGroup.add(dozerBody);

      const dozerCab = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.2, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 })
      );
      dozerCab.position.set(0, 2.4, -0.4);
      dozerGroup.add(dozerCab);

      const trackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
      const leftTrack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 3.6), trackMat);
      leftTrack.position.set(-1.3, 0.35, 0);
      dozerGroup.add(leftTrack);

      const rightTrack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 3.6), trackMat);
      rightTrack.position.set(1.3, 0.35, 0);
      dozerGroup.add(rightTrack);

      bharatiGroup.add(dozerGroup);

      // 9. Indian National Flagpole
      bharatiGroup.add(createFlagpole(-7.5, 8.5));

      // 10. Wind Turbines on Nearby Ridge
      const turbineGroup = new THREE.Group();
      turbineGroup.position.set(-14.0, 0, -8.0);
      const tMast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.24, 7.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xE6EDF3, metalness: 0.8 })
      );
      tMast.position.y = 3.75;
      turbineGroup.add(tMast);

      const nacelle = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
      );
      nacelle.position.set(0, 7.5, 0);
      turbineGroup.add(nacelle);

      const rotor = new THREE.Group();
      rotor.position.set(0, 7.5, 0.65);
      const bladeGeo = new THREE.BoxGeometry(0.14, 3.2, 0.05);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xF0F6FC });
      for (let b = 0; b < 3; b++) {
        const bMesh = new THREE.Mesh(bladeGeo, bladeMat);
        bMesh.position.y = 1.4;
        const bHolder = new THREE.Group();
        bHolder.rotation.z = (b * Math.PI * 2) / 3;
        bHolder.add(bMesh);
        rotor.add(bHolder);
      }
      turbineGroup.add(rotor);
      animatedElements.current.push(rotor);
      bharatiGroup.add(turbineGroup);

      // 11. Two Expedition Scientists in Polar Parkas for Human Scale
      const createScientist = (sx: number, sz: number, suitColor: number) => {
        const pGroup = new THREE.Group();
        pGroup.position.set(sx, 0, sz);
        // Body parka
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.24, 0.8, 8),
          new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.8 })
        );
        body.position.y = 0.9;
        pGroup.add(body);
        // Hood
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0x111111 })
        );
        head.position.y = 1.45;
        pGroup.add(head);
        return pGroup;
      };
      bharatiGroup.add(createScientist(5.2, 6.2, 0x1565C0)); // Blue parka
      bharatiGroup.add(createScientist(5.8, 6.6, 0xF57F17)); // Yellow parka

      scene.add(bharatiGroup);

    } else {
      // =========================================================================
      // MODEL 2: MAITRI RESEARCH STATION (Exact Architecture from Reference Image 2)
      // =========================================================================
      const maitriGroup = new THREE.Group();

      const roofMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'thermal' ? 0xff4500 : (viewMode === 'wireframe' ? 0x00f2fe : 0xE5EAEF),
        roughness: 0.45,
        metalness: 0.2,
        wireframe: viewMode === 'wireframe',
      });

      const wallMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'thermal' ? 0x3388ff : (viewMode === 'wireframe' ? 0x00f2fe : 0x7E92A2),
        roughness: 0.55,
        metalness: 0.35,
        wireframe: viewMode === 'wireframe',
      });

      const stiltMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.85 });

      // Helper function to build a modular wing with ribbed pitched roof & windows
      const createMaitriWing = (length: number, width: number, wx: number, wz: number, ry: number) => {
        const wing = new THREE.Group();
        wing.position.set(wx, 0.8, wz);
        wing.rotation.y = ry;

        const h = 2.2;
        // Main container body
        const body = new THREE.Mesh(new THREE.BoxGeometry(width, h, length), wallMat);
        body.position.y = h / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        wing.add(body);

        // Pitched roof (triangular cross-section)
        const roofShape = new THREE.Shape();
        roofShape.moveTo(-width / 2 - 0.2, 0);
        roofShape.lineTo(0, 0.8);
        roofShape.lineTo(width / 2 + 0.2, 0);
        roofShape.closePath();

        const roofExtrude = new THREE.ExtrudeGeometry(roofShape, { depth: length + 0.4, bevelEnabled: false });
        roofExtrude.center();
        const roofMesh = new THREE.Mesh(roofExtrude, roofMat);
        roofMesh.position.set(0, h + 0.4, 0);
        roofMesh.castShadow = true;
        wing.add(roofMesh);

        // Windows along side
        const winMat = new THREE.MeshStandardMaterial({ color: 0x1E3A5F, roughness: 0.1, metalness: 0.9 });
        for (let wz_pos = -length / 2 + 1.2; wz_pos < length / 2 - 0.8; wz_pos += 1.8) {
          const win1 = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.65), winMat);
          win1.rotation.y = -Math.PI / 2;
          win1.position.set(-width / 2 - 0.02, h / 2 + 0.2, wz_pos);
          wing.add(win1);

          const win2 = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.65), winMat);
          win2.rotation.y = Math.PI / 2;
          win2.position.set(width / 2 + 0.02, h / 2 + 0.2, wz_pos);
          wing.add(win2);
        }

        // Support I-beams stilts underneath
        for (let sz = -length / 2 + 0.8; sz <= length / 2 - 0.8; sz += 2.4) {
          const st1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), stiltMat);
          st1.position.set(-width / 2 + 0.3, -0.4, sz);
          wing.add(st1);
          const st2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), stiltMat);
          st2.position.set(width / 2 - 0.3, -0.4, sz);
          wing.add(st2);
        }

        return wing;
      };

      // 1. THE ICONIC "Z" MAIN COMPLEX (From Reference Image 2)
      // South Long Living Wing
      maitriGroup.add(createMaitriWing(14.0, 3.2, -1.0, 3.2, Math.PI / 2));

      // Connecting Diagonal / Link Corridor
      maitriGroup.add(createMaitriWing(9.0, 3.0, 5.2, -0.5, 0));

      // North Science & Habitat Wing
      maitriGroup.add(createMaitriWing(11.0, 3.2, 0.5, -4.5, Math.PI / 2));

      // 2. ICONIC GREENHOUSE / CORNER PANORAMIC GLASS LOUNGE (Southern Corner from Photo)
      const greenhouseGroup = new THREE.Group();
      greenhouseGroup.position.set(-8.2, 0.8, 3.2);

      const ghMat = new THREE.MeshStandardMaterial({
        color: 0x38A3A5, // Turquoise green framed greenhouse
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.78,
      });

      const ghMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 3.4), ghMat);
      ghMesh.position.y = 1.1;
      greenhouseGroup.add(ghMesh);

      // Angled bay window front
      const ghNose = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 2.2, 6, 1, false, 0, Math.PI),
        ghMat
      );
      ghNose.rotation.y = -Math.PI / 2;
      ghNose.position.set(-1.2, 1.1, 0);
      greenhouseGroup.add(ghNose);
      maitriGroup.add(greenhouseGroup);

      // 3. PRIYADARSHINI FRESHWATER GLACIAL LAKE (Exact Location from Photo)
      const lakeGroup = new THREE.Group();
      lakeGroup.position.set(-14.0, 0.02, 6.0);

      // Aquamarine glacial water
      const lakeGeo = new THREE.CircleGeometry(7.5, 32);
      lakeGeo.rotateX(-Math.PI / 2);
      const lakeMat = new THREE.MeshStandardMaterial({
        color: 0x2A9D8F,
        roughness: 0.1,
        metalness: 0.85,
        transparent: true,
        opacity: 0.82,
      });
      const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
      lakeGroup.add(lakeMesh);

      // White frozen perimeter rim
      const iceRim = new THREE.Mesh(
        new THREE.RingGeometry(6.8, 7.8, 32),
        new THREE.MeshStandardMaterial({ color: 0xF0F8FF, roughness: 0.3 })
      );
      iceRim.rotateX(-Math.PI / 2);
      iceRim.position.y = 0.01;
      lakeGroup.add(iceRim);
      maitriGroup.add(lakeGroup);

      // Secondary Meltwater Pond (between wings as seen in aerial photo)
      const smallPond = new THREE.Mesh(
        new THREE.CircleGeometry(2.8, 24),
        lakeMat
      );
      smallPond.rotateX(-Math.PI / 2);
      smallPond.position.set(1.5, 0.02, -0.8);
      maitriGroup.add(smallPond);

      // 4. BRIGHT ORANGE FUEL & LOGISTICS CONTAINERS (from Photo)
      maitriGroup.add(createContainer(-6.0, 0, -6.5, 0, '#E65100', 'FUEL-D80'));
      maitriGroup.add(createContainer(-6.0, 0, -4.6, 0, '#E65100', 'FUEL-JET'));
      maitriGroup.add(createContainer(-3.5, 0, -6.0, Math.PI / 2, '#D84315', 'NCPOR-01'));
      maitriGroup.add(createContainer(2.8, 0, 5.8, Math.PI / 2, '#E65100', 'SUPPLY-A'));
      maitriGroup.add(createContainer(4.8, 0, 5.8, Math.PI / 2, '#E65100', 'SUPPLY-B'));

      // 5. MASSIVE FUEL DRUM STORAGE FIELD (hundreds of barrels as seen in aerial photo)
      const drumField = new THREE.Group();
      drumField.position.set(-10.5, 0, -9.0);
      const drumGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 8);
      const drumMatYellow = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.7, roughness: 0.4 });
      const drumMatRed = new THREE.MeshStandardMaterial({ color: 0xDC2626, metalness: 0.7, roughness: 0.4 });

      // Rows of organized barrels
      for (let rx = 0; rx < 10; rx++) {
        for (let rz = 0; rz < 8; rz++) {
          const drum = new THREE.Mesh(drumGeo, (rx + rz) % 2 === 0 ? drumMatYellow : drumMatRed);
          drum.position.set(rx * 0.45, 0.28, rz * 0.45);
          drum.castShadow = true;
          drumField.add(drum);
        }
      }
      maitriGroup.add(drumField);

      // 6. GENERATOR & BOILER WORKSHOP BUILDING
      const genHouse = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 2.2, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x546E7A, roughness: 0.5, metalness: 0.4 })
      );
      genHouse.position.set(-4.0, 1.1, -0.5);
      genHouse.castShadow = true;
      maitriGroup.add(genHouse);

      // Dual exhaust smoke stacks
      const stackMat = new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.9 });
      const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 12), stackMat);
      s1.position.set(-3.4, 2.5, -0.8);
      maitriGroup.add(s1);
      const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 12), stackMat);
      s2.position.set(-3.4, 2.5, -0.2);
      maitriGroup.add(s2);

      // 7. ELEVATED SILVER FUEL PIPELINE (Snaking across moraine)
      const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6.0, 0.5, -6.5),
        new THREE.Vector3(-5.0, 0.5, -3.5),
        new THREE.Vector3(-4.0, 0.5, -1.5),
        new THREE.Vector3(-3.0, 0.5, 1.0),
      ]);
      const pipeGeo = new THREE.TubeGeometry(pipeCurve, 24, 0.12, 8, false);
      const pipeMat = new THREE.MeshStandardMaterial({ color: 0xD0D7DE, metalness: 0.9, roughness: 0.2 });
      const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
      maitriGroup.add(pipeMesh);

      // 8. METEOROLOGICAL TOWER & RADOME
      const metTower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.18, 5.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xE53935 })
      );
      metTower.position.set(3.0, 2.75, 6.0);
      maitriGroup.add(metTower);

      // Rotating anemometer cups
      const anemometer = new THREE.Group();
      anemometer.position.set(3.0, 5.5, 6.0);
      for (let c = 0; c < 3; c++) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
        arm.position.x = 0.3;
        const armHolder = new THREE.Group();
        armHolder.rotation.y = (c * Math.PI * 2) / 3;
        armHolder.add(arm);
        anemometer.add(armHolder);
      }
      animatedElements.current.push(anemometer);
      maitriGroup.add(anemometer);

      // Radome Satellite Dish
      const radome = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0xFAFAFA, roughness: 0.4 })
      );
      radome.position.set(7.0, 2.4, -1.0);
      radome.castShadow = true;
      maitriGroup.add(radome);

      // 9. Indian National Flagpole
      maitriGroup.add(createFlagpole(1.2, 5.0));

      scene.add(maitriGroup);
    }

    // =========================================================================
    // INTERACTIVE 3D HOTSPOT NODES
    // =========================================================================
    hotspotMeshesRef.current = [];

    hotspotsRef.current.forEach((hotspot) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...hotspot.position);

      const statusColor =
        hotspot.status === 'optimal'
          ? 0x10b981
          : hotspot.status === 'warning'
          ? 0xffb800
          : 0xff4b4b;

      // Outer Glowing Sphere
      const sphereGeo = new THREE.SphereGeometry(0.38, 20, 20);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: statusColor,
        emissive: statusColor,
        emissiveIntensity: 0.75,
        roughness: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.userData = { hotspot };
      pinGroup.add(sphere);

      // Pulsing Base Ring
      const ringGeo = new THREE.RingGeometry(0.48, 0.64, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: statusColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = -0.15;
      pinGroup.add(ring);

      scene.add(pinGroup);
      hotspotMeshesRef.current.push({ mesh: sphere, ring, hotspot });
    });

    // =========================================================================
    // WEATHER BLIZZARD / CRYOSPHERE PARTICLES
    // =========================================================================
    const particleCount = 2400;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      snowPos[p * 3] = (Math.random() - 0.5) * 80;
      snowPos[p * 3 + 1] = Math.random() * 30;
      snowPos[p * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isBlizzard ? 0.22 : 0.12,
      transparent: true,
      opacity: isBlizzard ? 0.7 : 0.35,
    });
    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);
    snowParticlesRef.current = snowParticles;

    // =========================================================================
    // RAYCASTING & ORBIT INTERACTIONS
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      setTooltipPos({ x: e.clientX, y: e.clientY });

      raycaster.setFromCamera(mouse, camera);
      const meshes = hotspotMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const found = intersects[0].object.userData.hotspot as ModuleHotspot;
        setHoveredHotspot(found);
        container.style.cursor = 'pointer';
      } else {
        setHoveredHotspot(null);
        container.style.cursor = isDraggingRef.current ? 'grabbing' : 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = hotspotMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const found = intersects[0].object.userData.hotspot as ModuleHotspot;
        setSelectedHotspot(found);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMoveDrag = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraSpherical.current.theta -= deltaX * 0.007;
      cameraSpherical.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2.05, cameraSpherical.current.phi - deltaY * 0.007)
      );

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraSpherical.current.radius = Math.max(
        8,
        Math.min(65, cameraSpherical.current.radius + e.deltaY * 0.025)
      );
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousemove', handlePointerMove);
    domEl.addEventListener('click', handleClick);
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveDrag);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // =========================================================================
    // ANIMATION LOOP (60 FPS)
    // =========================================================================
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera Position Spherical Lerp
      const { radius, theta, phi } = cameraSpherical.current;
      const target = cameraTargetRef.current;

      const camX = target.x + radius * Math.sin(phi) * Math.sin(theta);
      const camY = target.y + radius * Math.cos(phi);
      const camZ = target.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
      camera.lookAt(target);

      // Rotate Wind Turbines / Anemometer
      animatedElements.current.forEach((el) => {
        el.rotation.z += delta * (windSpeedRef.current * 0.1);
        el.rotation.y += delta * (windSpeedRef.current * 0.08);
      });

      // Blizzard Particle Drift
      if (snowParticlesRef.current) {
        const positions = snowParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const drift = (windSpeedRef.current / 25) * 0.05;

        for (let p = 0; p < particleCount; p++) {
          positions[p * 3] += drift;
          positions[p * 3 + 1] -= 0.14;

          if (positions[p * 3 + 1] < 0) {
            positions[p * 3 + 1] = 28;
            positions[p * 3] = (Math.random() - 0.5) * 75;
          }
          if (positions[p * 3] > 40) {
            positions[p * 3] = -40;
          }
        }
        snowParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Hotspot gentle bounce
      hotspotMeshesRef.current.forEach(({ mesh }, index) => {
        mesh.position.y = Math.sin(elapsedTime * 2.5 + index) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousemove', handlePointerMove);
      domEl.removeEventListener('click', handleClick);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('wheel', handleWheel);

      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [activeStation, lowBandwidthMode, viewMode, isBlizzard, setSelectedHotspot]);

  useEffect(() => {
    const hotspotsById = new Map(hotspots.map((hotspot) => [hotspot.id, hotspot]));

    hotspotMeshesRef.current.forEach((item) => {
      const hotspot = hotspotsById.get(item.hotspot.id);
      if (!hotspot) return;

      item.hotspot = hotspot;
      item.mesh.userData.hotspot = hotspot;
      item.mesh.parent?.position.set(...hotspot.position);

      const statusColor =
        hotspot.status === 'optimal'
          ? 0x10b981
          : hotspot.status === 'warning'
          ? 0xffb800
          : 0xff4b4b;
      const sphereMaterial = item.mesh.material as THREE.MeshStandardMaterial;
      const ringMaterial = item.ring.material as THREE.MeshBasicMaterial;
      sphereMaterial.color.setHex(statusColor);
      sphereMaterial.emissive.setHex(statusColor);
      ringMaterial.color.setHex(statusColor);
    });
  }, [hotspots]);

  if (lowBandwidthMode) {
    return <LowBandwidthView />;
  }

  return (
    <div className="relative w-full h-[640px] sm:h-[720px] rounded-2xl overflow-hidden border border-polar-border bg-polar-dark shadow-glass">
      {/* 3D WebGL Canvas Target Container */}
      <div ref={containerRef} className="w-full h-full select-none" />

      {/* Top Floating Station Banner & Real-Photo Verified Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-lg bg-polar-card/90 backdrop-blur-md border border-polar-border pointer-events-auto flex items-center gap-2.5 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-polar-cyan animate-ping-slow"></div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide uppercase font-mono flex items-center gap-1.5">
              <span>{metadata.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-polar-cyan/20 text-polar-cyan font-bold">
                Photo-Accurate Twin
              </span>
            </div>
            <div className="text-[10px] text-polar-cyan font-mono">
              {metadata.hindiName} • {metadata.climateZone}
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-polar-card/90 backdrop-blur-md border border-polar-border pointer-events-auto hidden md:flex items-center gap-3 text-xs font-mono">
          <span className="text-polar-textMuted">Coordinates:</span>
          <span className="text-white font-bold">{metadata.coordinates.lat}, {metadata.coordinates.lng}</span>
          <span className="text-polar-border">|</span>
          <span className="text-polar-textMuted">Winter Crew:</span>
          <span className="text-polar-cyan font-bold">{metadata.currentCrew} Scientists</span>
        </div>
      </div>

      {/* Top Right: View Mode & Weather Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2">
        <div className="p-1 rounded-lg bg-polar-card/90 backdrop-blur-md border border-polar-border flex items-center gap-1 shadow-lg">
          <button
            onClick={() => setViewMode('day')}
            title="Antarctic Daylight View"
            className={`p-1.5 rounded text-xs transition-all ${
              viewMode === 'day'
                ? 'bg-polar-cyan/20 text-polar-cyan border border-polar-cyan/40 font-bold'
                : 'text-polar-textMuted hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('thermal')}
            title="Thermal Heatmap View (FLIR Simulation)"
            className={`p-1.5 rounded text-xs transition-all ${
              viewMode === 'thermal'
                ? 'bg-polar-alert/20 text-polar-alert border border-polar-alert/40 font-bold'
                : 'text-polar-textMuted hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('aurora')}
            title="Aurora Australis Night View"
            className={`p-1.5 rounded text-xs transition-all ${
              viewMode === 'aurora'
                ? 'bg-polar-blue/20 text-polar-blue border border-polar-blue/40 font-bold'
                : 'text-polar-textMuted hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('wireframe')}
            title="Cybernetic Wireframe Mode"
            className={`p-1.5 rounded text-xs transition-all ${
              viewMode === 'wireframe'
                ? 'bg-polar-cyan/20 text-polar-cyan border border-polar-cyan/40 font-bold'
                : 'text-polar-textMuted hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setIsBlizzard((prev) => !prev)}
          title="Toggle Polar Cryosphere Snow Particles"
          className={`p-2 rounded-lg backdrop-blur-md border text-xs transition-all shadow-lg flex items-center gap-1.5 font-mono ${
            isBlizzard
              ? 'bg-polar-cyan/15 border-polar-cyan/40 text-polar-cyan'
              : 'bg-polar-card/90 border-polar-border text-polar-textMuted hover:text-white'
          }`}
        >
          <CloudSnow className="w-4 h-4" />
          <span className="hidden sm:inline">{isBlizzard ? 'Blizzard Active' : 'Calm Air'}</span>
        </button>
      </div>

      {/* Bottom Center: Camera Presets Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-polar-card/90 backdrop-blur-xl border border-polar-border shadow-2xl">
        <span className="text-[10px] font-mono text-polar-textMuted px-2 hidden sm:inline uppercase">
          Camera Target:
        </span>
        <button
          onClick={() => applyCameraPreset('overview')}
          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-polar-cyan/15 hover:text-polar-cyan transition-colors text-white"
        >
          Overview
        </button>
        <button
          onClick={() => applyCameraPreset('power')}
          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-polar-cyan/15 hover:text-polar-cyan transition-colors text-white"
        >
          Power Grid
        </button>
        <button
          onClick={() => applyCameraPreset('living')}
          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-polar-cyan/15 hover:text-polar-cyan transition-colors text-white"
        >
          {activeStation === 'bharati' ? 'Panoramic Lounge' : 'Habitat & Lounge'}
        </button>
        <button
          onClick={() => applyCameraPreset('fuel')}
          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-polar-cyan/15 hover:text-polar-cyan transition-colors text-white"
        >
          {activeStation === 'bharati' ? 'Cargo Staging' : 'Fuel Drums & Tanks'}
        </button>
        <button
          onClick={() => applyCameraPreset('meteo')}
          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-polar-cyan/15 hover:text-polar-cyan transition-colors text-white"
        >
          {activeStation === 'bharati' ? 'Rooftop Terrace' : 'Weather Tower'}
        </button>
      </div>

      {/* Bottom Left: Orbit & Zoom Instruction Hint */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-dark/80 backdrop-blur-md border border-polar-border text-[11px] font-mono text-polar-textMuted">
        <Compass className="w-3.5 h-3.5 text-polar-cyan" />
        <span>Click node to inspect • Drag to Orbit • Scroll to Zoom</span>
      </div>

      {/* Hover Tooltip HUD over 3D Hotspot */}
      {hoveredHotspot && (
        <div
          className="fixed z-50 pointer-events-none p-3 rounded-lg bg-polar-card/95 backdrop-blur-md border border-polar-cyan/60 shadow-glow-cyan text-xs font-mono transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-polar-border">
            <span className="font-bold text-white">{hoveredHotspot.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                hoveredHotspot.status === 'optimal'
                  ? 'bg-polar-success/20 text-polar-success'
                  : hoveredHotspot.status === 'warning'
                  ? 'bg-polar-warning/20 text-polar-warning'
                  : 'bg-polar-alert/20 text-polar-alert'
              }`}
            >
              {hoveredHotspot.status}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-4 text-polar-textMuted text-[11px]">
            <span>Temp: <strong className="text-white">{hoveredHotspot.temperature}°C</strong></span>
            <span>Load: <strong className="text-polar-cyan">{hoveredHotspot.powerDrawKw} kW</strong></span>
          </div>
          <div className="mt-1 text-[10px] text-polar-cyan font-semibold">
            Click to open telemetry drawer →
          </div>
        </div>
      )}

      {/* Slide-over Telemetry Drawer */}
      <HotspotDrawer />
    </div>
  );
};
