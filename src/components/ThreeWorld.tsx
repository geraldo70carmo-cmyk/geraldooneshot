import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Maximize2,
  Compass,
  Zap,
  MapPin,
  ChevronRight,
  Eye,
  Settings,
  HelpCircle,
  Volume2,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import {
  SECTORS,
  ALL_80_QUESTIONS,
  QuestionItem,
  calculateAccuracyPercentage,
  formatDuration,
} from '../game/grammarRules';
import { soundEffects } from '../utils/audioSystem';

interface ThreeWorldProps {
  currentQuestionId: number;
  answeredQuestionIds: number[];
  onOpenQuestion: (question: QuestionItem) => void;
  graphicsQuality: 'high' | 'low';
  onToggleGraphics: () => void;
  onOpenStudyGuide: () => void;
  onOpenMusicLounge: () => void;
  mode: 'avaliacao' | 'treino';
  questions?: QuestionItem[];
  startTime?: number;
  elapsedSeconds?: number;
  correctCount?: number;
  onLeaveGame?: () => void;
  onRestartGame?: () => void;
  onResetToZero?: () => void;
}

interface TerminalMeshMeta {
  mesh: THREE.Group;
  question: QuestionItem;
  sectorId: number;
  ringMesh: THREE.Mesh;
  haloLight: THREE.PointLight;
}

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  currentQuestionId,
  answeredQuestionIds,
  onOpenQuestion,
  graphicsQuality,
  onToggleGraphics,
  onOpenStudyGuide,
  onOpenMusicLounge,
  mode,
  questions = ALL_80_QUESTIONS,
  startTime = Date.now(),
  elapsedSeconds: propElapsedSeconds,
  correctCount = 0,
  onLeaveGame,
  onRestartGame,
  onResetToZero,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nearbyQuestion, setNearbyQuestion] = useState<QuestionItem | null>(null);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [activeSectorIndex, setActiveSectorIndex] = useState<number>(0);
  const [showFastTravel, setShowFastTravel] = useState<boolean>(false);
  const [showControlsHelp, setShowControlsHelp] = useState<boolean>(false);
  const [localElapsedSeconds, setLocalElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (propElapsedSeconds !== undefined) return;
    const timer = setInterval(() => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setLocalElapsedSeconds(secs);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, propElapsedSeconds]);

  const elapsedSeconds = propElapsedSeconds !== undefined ? propElapsedSeconds : localElapsedSeconds;

  const accuracy = calculateAccuracyPercentage(correctCount, answeredQuestionIds.length);

  // References for Three.js animation loop without re-renders
  const stateRef = useRef({
    camera: null as THREE.PerspectiveCamera | null,
    scene: null as THREE.Scene | null,
    renderer: null as THREE.WebGLRenderer | null,
    terminals: [] as TerminalMeshMeta[],
    playerPos: new THREE.Vector3(-4, 1.7, -6.5),
    playerVelocity: new THREE.Vector3(),
    pitch: 0,
    yaw: Math.PI,
    keys: {
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    },
    touchMove: { x: 0, y: 0 },
    touchLook: { deltaX: 0, deltaY: 0 },
    isInteracting: false,
    animFrameId: 0,
    clock: new THREE.Clock(),
    particles: null as THREE.Points | null,
    sectorPortals: [] as THREE.Group[],
  });

  const activeQuestion = questions.find((q) => q.id === currentQuestionId) || questions[0];

  // Teleport player directly to a specific question terminal
  const teleportToQuestion = useCallback((qId: number) => {
    const qIndex = qId - 1;
    // Each question is spaced along the Z axis
    // Z positions: Sector 1 (Z: 0, -20), Sector 2 (Z: -40, -60), etc.
    const targetZ = -(qIndex * 22) - 10;
    const targetX = qIndex % 2 === 0 ? -4 : 4;

    const state = stateRef.current;
    if (state.camera) {
      state.playerPos.set(targetX, 1.7, targetZ + 3.5);
      state.camera.position.copy(state.playerPos);
      state.yaw = Math.PI; // Look towards the terminal (into the negative Z)
      state.pitch = 0;
    }
    setShowFastTravel(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x03081e, graphicsQuality === 'high' ? 0.007 : 0.012);
    stateRef.current.scene = scene;

    // --- CAMERA SETUP ---
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      600
    );
    camera.position.copy(stateRef.current.playerPos);
    stateRef.current.camera = camera;

    // --- RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({
      antialias: graphicsQuality === 'high',
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, graphicsQuality === 'high' ? 1.5 : 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    stateRef.current.renderer = renderer;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0x0c1938, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(30, 80, 20);
    scene.add(dirLight);

    // --- ENVIRONMENT ARCHITECTURE (Chrono City Promenade) ---
    // Ground Promenade Grid
    const promenadeLength = 1900;
    const groundGeo = new THREE.PlaneGeometry(36, promenadeLength, 20, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050c1f,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -promenadeLength / 2 + 30;
    scene.add(ground);

    // Neon edge barriers along the promenade
    const barrierMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const barrierGeo = new THREE.BoxGeometry(0.3, 0.8, promenadeLength);
    const leftBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    leftBarrier.position.set(-18, 0.4, -promenadeLength / 2 + 30);
    scene.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    rightBarrier.position.set(18, 0.4, -promenadeLength / 2 + 30);
    scene.add(rightBarrier);

    // Cyber Skyscrapers lining both sides
    const buildingColors = [0x071536, 0x091b42, 0x0c2356, 0x06112a];
    const towerWindowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < 160; i++) {
      const zPos = -i * 12 + 25;
      const heightLeft = 40 + Math.random() * 90;
      const heightRight = 45 + Math.random() * 95;
      const widthLeft = 14 + Math.random() * 12;
      const widthRight = 14 + Math.random() * 12;

      // Left building
      const bLeftGeo = new THREE.BoxGeometry(widthLeft, heightLeft, 10);
      const bLeftMat = new THREE.MeshStandardMaterial({
        color: buildingColors[i % buildingColors.length],
        roughness: 0.5,
        metalness: 0.7,
      });
      const bLeft = new THREE.Mesh(bLeftGeo, bLeftMat);
      bLeft.position.set(-28 - widthLeft / 2, heightLeft / 2, zPos);
      scene.add(bLeft);

      // Windows band
      const winGeo = new THREE.BoxGeometry(0.2, heightLeft * 0.7, 0.4);
      const win = new THREE.Mesh(winGeo, towerWindowMat);
      win.position.set(-27.8, heightLeft / 2, zPos);
      scene.add(win);

      // Right building
      const bRightGeo = new THREE.BoxGeometry(widthRight, heightRight, 10);
      const bRightMat = new THREE.MeshStandardMaterial({
        color: buildingColors[(i + 1) % buildingColors.length],
        roughness: 0.5,
        metalness: 0.7,
      });
      const bRight = new THREE.Mesh(bRightGeo, bRightMat);
      bRight.position.set(28 + widthRight / 2, heightRight / 2, zPos);
      scene.add(bRight);
    }

    // --- 8 SECTOR HOLOGRAPHIC ARCHES / PORTALS ---
    const portals: THREE.Group[] = [];
    SECTORS.forEach((sec, idx) => {
      const portalGroup = new THREE.Group();
      const zSec = -(idx * 220) - 5;

      // Outer Torus Arch
      const archGeo = new THREE.TorusGeometry(14, 0.4, 8, 32, Math.PI);
      const archMat = new THREE.MeshBasicMaterial({
        color: sec.accentHex,
        wireframe: true,
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 0, 0);
      portalGroup.add(arch);

      // Light pillars
      const pillarGeo = new THREE.CylinderGeometry(0.6, 0.8, 16, 12);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
      });
      const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
      leftPillar.position.set(-14, 8, 0);
      portalGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      rightPillar.position.set(14, 8, 0);
      portalGroup.add(rightPillar);

      // Portal energy beacon light
      if (graphicsQuality === 'high') {
        const pLight = new THREE.PointLight(sec.accentHex, 1.8, 25);
        pLight.position.set(0, 10, 0);
        portalGroup.add(pLight);
      }

      portalGroup.position.set(0, 0, zSec);
      scene.add(portalGroup);
      portals.push(portalGroup);
    });
    stateRef.current.sectorPortals = portals;

    // --- 16 MISSION TERMINALS (2 per sector) ---
    const terminalList: TerminalMeshMeta[] = [];

    questions.forEach((q, idx) => {
      const termGroup = new THREE.Group();
      const targetZ = -(idx * 22) - 10;
      const targetX = idx % 2 === 0 ? -4 : 4;

      // Pedestal
      const pedGeo = new THREE.CylinderGeometry(0.8, 1.1, 1.2, 8);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const pedestal = new THREE.Mesh(pedGeo, pedMat);
      pedestal.position.y = 0.6;
      termGroup.add(pedestal);

      // Holographic Floating Crystal / Screen
      const screenGeo = new THREE.OctahedronGeometry(0.6, 0);
      const sector = SECTORS.find((s) => s.id === q.sectorId) || SECTORS[0];
      const screenMat = new THREE.MeshStandardMaterial({
        color: sector.accentHex,
        emissive: sector.accentHex,
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.5,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.y = 1.8;
      termGroup.add(screen);

      // Rotating Energy Ring
      const ringGeo = new THREE.RingGeometry(1.2, 1.4, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: sector.accentHex,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      termGroup.add(ring);

      // Halo PointLight
      const haloLight = new THREE.PointLight(sector.accentHex, 1.2, 8);
      haloLight.position.set(0, 2, 0);
      termGroup.add(haloLight);

      termGroup.position.set(targetX, 0, targetZ);
      scene.add(termGroup);

      terminalList.push({
        mesh: termGroup,
        question: q,
        sectorId: q.sectorId,
        ringMesh: ring,
        haloLight,
      });
    });

    stateRef.current.terminals = terminalList;

    // --- FLOATING PARTICLES (Cyber Dust & Energy Motes) ---
    if (graphicsQuality === 'high') {
      const particleCount = 600;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 60;
        pPos[i + 1] = Math.random() * 30 + 0.5;
        pPos[i + 2] = -Math.random() * promenadeLength + 20;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.35,
        transparent: true,
        opacity: 0.6,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);
      stateRef.current.particles = particles;
    }

    // --- CONTROLS / INPUT LISTENERS ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.code in stateRef.current.keys) {
        (stateRef.current.keys as Record<string, boolean>)[e.code] = true;
      }
      if (e.code === 'KeyE') {
        const nearby = checkNearbyTerminal();
        if (nearby) {
          soundEffects.interact();
          onOpenQuestion(nearby);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.code in stateRef.current.keys) {
        (stateRef.current.keys as Record<string, boolean>)[e.code] = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked) return;
      const sensitivity = 0.0022;
      const state = stateRef.current;
      state.yaw -= e.movementX * sensitivity;
      state.pitch -= e.movementY * sensitivity;
      state.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, state.pitch));
    };

    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === container);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // --- ANIMATION / RENDER LOOP ---
    const checkNearbyTerminal = () => {
      const pPos = stateRef.current.playerPos;
      for (const item of stateRef.current.terminals) {
        const dist = pPos.distanceTo(item.mesh.position);
        if (dist < 4.0) {
          return item.question;
        }
      }
      return null;
    };

    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const state = stateRef.current;
      if (!state.camera || !state.renderer) return;

      // Update movement
      const moveSpeed = 8.5;
      const forward = new THREE.Vector3(
        -Math.sin(state.yaw),
        0,
        -Math.cos(state.yaw)
      ).normalize();
      const right = new THREE.Vector3(
        Math.cos(state.yaw),
        0,
        -Math.sin(state.yaw)
      ).normalize();

      const moveDir = new THREE.Vector3();
      if (state.keys.KeyW || state.keys.ArrowUp) moveDir.add(forward);
      if (state.keys.KeyS || state.keys.ArrowDown) moveDir.sub(forward);
      if (state.keys.KeyA || state.keys.ArrowLeft) moveDir.sub(right);
      if (state.keys.KeyD || state.keys.ArrowRight) moveDir.add(right);

      // Touch joystick movement
      if (state.touchMove.x !== 0 || state.touchMove.y !== 0) {
        moveDir.add(right.clone().multiplyScalar(state.touchMove.x));
        moveDir.sub(forward.clone().multiplyScalar(state.touchMove.y));
      }

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        state.playerPos.addScaledVector(moveDir, moveSpeed * delta);
      }

      // Boundary Collisions (Keep player on promenade)
      state.playerPos.x = Math.max(-16, Math.min(16, state.playerPos.x));
      state.playerPos.z = Math.max(-promenadeLength + 30, Math.min(25, state.playerPos.z));
      state.playerPos.y = 1.7; // fixed eye level

      // Update Camera orientation
      state.camera.position.copy(state.playerPos);
      const euler = new THREE.Euler(state.pitch, state.yaw, 0, 'YXZ');
      state.camera.quaternion.setFromEuler(euler);

      // Animate Terminals
      const timeSec = now * 0.001;
      state.terminals.forEach((item) => {
        // Spin the floating crystal
        const crystal = item.mesh.children[1];
        if (crystal) {
          crystal.rotation.y = timeSec * 1.5;
          crystal.rotation.x = Math.sin(timeSec * 2) * 0.2;
          crystal.position.y = 1.8 + Math.sin(timeSec * 3 + item.question.id) * 0.12;
        }
        // Pulse ring
        if (item.ringMesh) {
          item.ringMesh.rotation.z = timeSec * 0.8;
        }
      });

      // Check proximity to terminal
      const nearby = checkNearbyTerminal();
      setNearbyQuestion(nearby);

      // Calculate active sector from Z position
      const sectorIdx = Math.max(
        0,
        Math.min(7, Math.floor((-state.playerPos.z + 10) / 220))
      );
      setActiveSectorIndex(sectorIdx);

      // Render
      state.renderer.render(scene, state.camera);
      state.animFrameId = requestAnimationFrame(animate);
    };

    stateRef.current.animFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !stateRef.current.camera || !stateRef.current.renderer) return;
      stateRef.current.camera.aspect = container.clientWidth / container.clientHeight;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(stateRef.current.animFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [graphicsQuality, onOpenQuestion, isPointerLocked]);

  // Request pointer lock for first-person mouse look
  const handleCanvasClick = () => {
    if (!isPointerLocked && containerRef.current) {
      containerRef.current.requestPointerLock();
    }
    // Also if clicking directly on a nearby terminal, open it
    if (nearbyQuestion) {
      soundEffects.interact();
      onOpenQuestion(nearbyQuestion);
    }
  };

  const currentSector = SECTORS[activeSectorIndex] || SECTORS[0];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair"
      />

      {/* Crosshair in First Person */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
            nearbyQuestion
              ? 'border-cyan-400 bg-cyan-400/40 scale-150 animate-pulse'
              : 'border-white/30 bg-white/10'
          }`}
        />
      </div>

      {/* TOP HUD BAR */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-20">
        {/* Left: Sector & Progress Indicator */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => onOpenQuestion(activeQuestion)}
            className="px-4 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 shadow-xl flex items-center gap-3 cursor-pointer hover:border-cyan-400 transition"
            title="Clique para abrir a missão atual"
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-cyan-400 tracking-wider">
                  SETOR {currentSector.id}/8 • {currentSector.name.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentSector.theme}
                </span>
              </div>
              <div className="text-xs text-white font-bold flex flex-wrap items-center gap-2 mt-0.5">
                <span>QUESTÃO: #{activeQuestion.id.toString().padStart(2, '0')}/80</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400">
                  {answeredQuestionIds.length}/80 Concluídas
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300 font-mono">
                  {accuracy}% Acerto
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-mono">
                  ⏱ {formatDuration(elapsedSeconds)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenQuestion(activeQuestion)}
            className="px-3 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg hover:from-cyan-400 hover:to-blue-500 transition"
          >
            Acessar Terminal #{activeQuestion.id}
          </button>

          {/* Quick teleport / Map button */}
          <button
            onClick={() => setShowFastTravel(true)}
            className="p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/60 transition shadow-xl"
            title="Abrir Mapa / Teletransporte Rápido de Setores"
          >
            <Compass className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Quick actions (Apostila, Trilha Sonora, Controles) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onOpenStudyGuide}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 text-xs font-bold transition shadow-lg"
          >
            <Zap className="w-4 h-4" />
            <span>Guia Didático</span>
          </button>

          <button
            onClick={onOpenMusicLounge}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-950/40 text-xs font-bold transition shadow-lg"
          >
            <Volume2 className="w-4 h-4" />
            <span>Music Lounge</span>
          </button>

          <button
            onClick={onToggleGraphics}
            className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition shadow-lg"
            title={`Alternar Gráficos (Atual: ${graphicsQuality === 'high' ? 'Alto' : 'Leve'})`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowControlsHelp(true)}
            className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition shadow-lg"
            title="Ajuda de Controles"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {onRestartGame && (
            <button
              onClick={onRestartGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 text-xs font-bold transition shadow-lg"
              title="Reiniciar Jogo"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reiniciar</span>
            </button>
          )}

          {onResetToZero && (
            <button
              onClick={onResetToZero}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-rose-500/70 text-rose-300 hover:bg-rose-950/50 hover:text-white text-xs font-bold transition shadow-lg"
              title="Zerar cronômetro (00:00) e percentual (0%) e recomeçar da Missão #1"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Zerar Tempo e %</span>
            </button>
          )}

          {onLeaveGame && (
            <button
              onClick={onLeaveGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-xs font-bold transition shadow-lg"
              title="Sair do Jogo"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sair</span>
            </button>
          )}
        </div>
      </div>

      {/* PROXIMITY INTERACTION BANNER [ E ] */}
      {nearbyQuestion && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => {
              soundEffects.interact();
              onOpenQuestion(nearbyQuestion);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wider shadow-2xl shadow-cyan-400/50 border-2 border-white flex items-center gap-3 transition-transform active:scale-95"
          >
            <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs">
              [ E ]
            </span>
            <span>INTERAGIR — TERMINAL DA MISSÃO #{nearbyQuestion.id}</span>
          </button>
        </div>
      )}

      {/* FIRST-PERSON POINTER LOCK INSTRUCTION NOTICE */}
      {!isPointerLocked && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-200 text-xs font-mono flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Clique na tela para controlar a câmera com o mouse (ESC para liberar)</span>
          </div>
        </div>
      )}

      {/* FAST TRAVEL / MAP MODAL */}
      {showFastTravel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-black text-white">Mapa de Chrono City • Teletransporte de Missões</h3>
              </div>
              <button
                onClick={() => setShowFastTravel(false)}
                className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1 rounded bg-slate-800"
              >
                ESC / Fechar
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Escolha uma das 80 missões para se posicionar imediatamente diante do terminal no cenário tridimensional:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {questions.map((q) => {
                const isAnswered = answeredQuestionIds.includes(q.id);
                const isCurrent = q.id === currentQuestionId;

                return (
                  <button
                    key={q.id}
                    onClick={() => teleportToQuestion(q.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-white'
                        : isAnswered
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 hover:bg-emerald-950/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">
                        MISSÃO #{q.id.toString().padStart(2, '0')}
                      </span>
                      {isAnswered && (
                        <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate mt-1">
                      {q.sectorName}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono mt-1">
                      Ir para terminal →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS HELP MODAL */}
      {showControlsHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Controles de Exploração 3D
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300">W / S</span>
                <span>Avançar / Recuar</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300">A / D</span>
                <span>Mover para Esquerda / Direita</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300">Mouse</span>
                <span>Olhar ao redor (após clicar na tela)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300">E</span>
                <span>Interagir com o Terminal de Missão</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300">ESC</span>
                <span>Liberar o cursor do mouse</span>
              </div>
            </div>

            <button
              onClick={() => setShowControlsHelp(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
