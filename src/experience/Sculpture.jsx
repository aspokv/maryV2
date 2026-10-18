import React, {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import {
  MathUtils,
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  MeshPhysicalMaterial,
  Sphere,
  Vector3,
} from "three";
import { scenePose } from "./choreography.mjs";
import { createStrand } from "./helix.mjs";

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
const FINISHES = {
  champagne: { color: "#d2ab82", metalness: 0.8, roughness: 0.28, iridescence: 0 },
  pearl: { color: "#efe5d8", metalness: 0.12, roughness: 0.24, iridescence: 0.55 },
};
function Helix({ progress, pointer, mobile, finish, paused, onReady }) {
  const strands = useMemo(() => {
    const initial = scenePose(0, mobile).wind;
    return [0, 1, 2].map((i) => {
      const strand = createStrand(i, mobile ? 150 : 220, mobile ? 14 : 18);
      strand.update(initial);
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new BufferAttribute(strand.positions, 3).setUsage(DynamicDrawUsage),
      );
      geometry.setAttribute(
        "normal",
        new BufferAttribute(strand.normals, 3).setUsage(DynamicDrawUsage),
      );
      geometry.setIndex(new BufferAttribute(strand.indices, 1));
      geometry.boundingSphere = new Sphere(new Vector3(), 2.6);
      return { strand, geometry };
    });
  }, [mobile]);
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        ...FINISHES.champagne,
        clearcoat: 0.45,
        clearcoatRoughness: 0.25,
        iridescenceIOR: 1.35,
      }),
    [],
  );
  useEffect(
    () => () => {
      strands.forEach(({ geometry }) => geometry.dispose());
      material.dispose();
    },
    [strands, material],
  );
  const root = useRef();
  const spinner = useRef();
  const ready = useRef(false);
  const elapsed = useRef(0);
  const wind = useRef(scenePose(0, mobile).wind);
  const wound = useRef(wind.current);
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
      pose.tilt[0] + pointer.current.y * 0.07,
      4,
      delta,
    );
    root.current.rotation.z = MathUtils.damp(
      root.current.rotation.z,
      pose.tilt[1],
      4,
      delta,
    );
    spinner.current.rotation.y = MathUtils.damp(
      spinner.current.rotation.y,
      pose.spin + pointer.current.x * 0.11 + pointer.current.drag,
      4,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      pose.cameraZ,
      4,
      delta,
    );
    wind.current = MathUtils.damp(wind.current, pose.wind, 4, delta);
    if (Math.abs(wind.current - wound.current) > 0.0015) {
      wound.current = wind.current;
      strands.forEach(({ strand, geometry }) => {
        strand.update(wind.current);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
      });
    }
    const look = FINISHES[finish];
    materialColor.set(look.color);
    material.color.lerp(materialColor, 1 - Math.exp(-delta * 5));
    material.envMapIntensity = pose.light;
    material.metalness = look.metalness;
    material.roughness = look.roughness;
    material.iridescence = look.iridescence;
    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(onReady);
    }
  });
  const pose = scenePose(0, mobile);
  return (
    <group
      ref={root}
      rotation={[pose.tilt[0], 0, pose.tilt[1]]}
      position={[viewport.width * pose.offsetX, pose.offsetY, 0]}
      scale={pose.scale}
    >
      <group ref={spinner} rotation={[0, pose.spin, 0]}>
        {strands.map(({ geometry }, i) => (
          <mesh key={i} geometry={geometry} material={material} />
        ))}
      </group>
    </group>
  );
}
function StudioEnvironment({ mobile }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[-3, 5, 3]} color="#ffe3cd" intensity={2.3} />
      <directionalLight
        position={[4, -2, -2]}
        color="#e5bf98"
        intensity={1.5}
      />
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#5a463a"]} />
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
          color="#c99a6b"
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
            <Helix
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
