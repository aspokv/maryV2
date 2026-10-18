import React, {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  AdaptiveDpr,
  useGLTF,
} from "@react-three/drei";
import { MathUtils, ACESFilmicToneMapping, Color } from "three";
import { scenePose } from "./choreography.mjs";
import { sculptureConfig } from "../site.config.mjs";

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Object({ progress, pointer, mobile, finish, paused, onReady }) {
  const { scene } = useGLTF(sculptureConfig.path, sculptureConfig.dracoPath);
  const pieces = useMemo(
    () =>
      sculptureConfig.parts
        .map((name) => scene.getObjectByName(name))
        .filter(Boolean),
    [scene],
  );
  const root = useRef();
  const ready = useRef(false);
  const elapsed = useRef(0);
  const materialColor = useMemo(() => new Color(), []);
  const { camera, viewport } = useThree();
  useFrame((state, dt) => {
    if (!root.current) return;
    const delta = Math.min(dt, 0.04);
    if (!paused) elapsed.current += delta;
    const pose = scenePose(progress.current, mobile);
    const breath = paused ? 0 : Math.sin(elapsed.current * 0.45) * 0.035;
    root.current.position.x = MathUtils.damp(
      root.current.position.x,
      viewport.width * pose.offsetX,
      5,
      delta,
    );
    root.current.position.y = MathUtils.damp(
      root.current.position.y,
      pose.offsetY + breath,
      5,
      delta,
    );
    root.current.scale.setScalar(
      MathUtils.damp(root.current.scale.x, pose.scale, 5, delta),
    );
    root.current.rotation.x = MathUtils.damp(
      root.current.rotation.x,
      pose.rotation[0] + pointer.current.y * 0.07,
      4,
      delta,
    );
    root.current.rotation.y = MathUtils.damp(
      root.current.rotation.y,
      pose.rotation[1] + pointer.current.x * 0.11 + pointer.current.drag,
      4,
      delta,
    );
    root.current.rotation.z = MathUtils.damp(
      root.current.rotation.z,
      pose.rotation[2],
      4,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      pose.cameraZ,
      4,
      delta,
    );
    materialColor.set(finish === "pearl" ? "#cbc4b5" : "#a5623d");
    root.current.children.forEach((mesh, i) => {
      const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
      mesh.position.x = MathUtils.damp(
        mesh.position.x,
        Math.cos(angle) * pose.explode * 0.7,
        4,
        delta,
      );
      mesh.position.y = MathUtils.damp(
        mesh.position.y,
        Math.sin(angle) * pose.explode * 0.7,
        4,
        delta,
      );
      mesh.position.z = MathUtils.damp(
        mesh.position.z,
        (i - 1) * pose.explode * 0.3,
        4,
        delta,
      );
      mesh.material.color.lerp(materialColor, 1 - Math.exp(-delta * 5));
      mesh.material.envMapIntensity = pose.light;
      mesh.material.metalness = finish === "pearl" ? 0.35 : 0.94;
      mesh.material.roughness = finish === "pearl" ? 0.3 : 0.25;
    });
    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(onReady);
    }
  });
  const pose = scenePose(0, mobile);
  return (
    <group
      ref={root}
      rotation={pose.rotation}
      position={[viewport.width * pose.offsetX, pose.offsetY, 0]}
      scale={pose.scale}
    >
      {pieces.map((piece) => (
        <mesh key={piece.name} geometry={piece.geometry}>
          <meshPhysicalMaterial
            color="#a5623d"
            metalness={0.94}
            roughness={0.25}
            clearcoat={0.25}
            clearcoatRoughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
function StudioEnvironment({ mobile }) {
  return (
    <>
      <ambientLight intensity={0.16} />
      <directionalLight position={[-3, 5, 3]} color="#ffe3cd" intensity={2.3} />
      <directionalLight
        position={[4, -2, -2]}
        color="#e5bf98"
        intensity={1.5}
      />
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#171310"]} />
        <Lightformer
          position={[-3, 3, 3]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[3, 6, 1]}
          intensity={4}
          color="#fff1de"
        />
        <Lightformer
          position={[3, 1, 2]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[1.1, 5, 1]}
          intensity={5}
          color="#fff3e4"
        />
        <Lightformer
          position={[0, 4, -3]}
          rotation={[Math.PI / 3, 0, 0]}
          scale={[5, 3, 1]}
          intensity={3}
          color="#d9e1e7"
        />
        <Lightformer
          position={[-3, -2, -1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[2, 3, 1]}
          intensity={3}
          color="#bc7443"
        />
      </Environment>
    </>
  );
}
export default function Sculpture({
  progress,
  mobile,
  finish,
  paused,
  active,
  onReady,
  onFail,
}) {
  const pointer = useRef({ x: 0, y: 0, drag: 0 });
  const start = useRef(null);
  const [dpr, setDpr] = useState(mobile ? 1 : 1.5);
  const move = (e) => {
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (start.current)
      pointer.current.drag =
        start.current.angle + (e.clientX - start.current.x) * 0.006;
  };
  return (
    <Boundary onFail={onFail}>
      <div
        className="sculpture-canvas"
        onPointerMove={move}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, angle: pointer.current.drag };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={() => {
          start.current = null;
        }}
        onPointerCancel={() => {
          start.current = null;
        }}
      >
        <Canvas
          dpr={dpr}
          frameloop={active ? "always" : "never"}
          camera={{ position: [0, 0, 6.6], fov: 34, near: 0.1, far: 30 }}
          gl={{
            alpha: true,
            antialias: !mobile,
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.domElement.addEventListener("webglcontextlost", onFail, {
              once: true,
            });
          }}
          fallback={null}
          performance={{ min: 0.55 }}
          onPointerMissed={() => {}}
        >
          <Suspense fallback={null}>
            <StudioEnvironment mobile={mobile} />
            <Object
              progress={progress}
              pointer={pointer}
              mobile={mobile}
              finish={finish}
              paused={paused}
              onReady={onReady}
            />
            <AdaptiveDpr pixelated />
          </Suspense>
          <FrameBudget lower={() => setDpr(mobile ? 0.85 : 1)} />
        </Canvas>
      </div>
    </Boundary>
  );
}
function FrameBudget({ lower }) {
  const stats = useRef({ sum: 0, count: 0, done: false });
  useFrame((_, dt) => {
    const s = stats.current;
    if (s.done) return;
    s.sum += Math.min(dt, 0.1);
    s.count++;
    if (s.count === 120) {
      if (s.sum > 3.5) lower();
      s.done = true;
    }
  });
  return null;
}
