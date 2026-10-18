// Browser side of scripts/render-assets.mjs. Mirrors the lighting in Sculpture.jsx.
import * as THREE from "three";
import { createStrand } from "../src/experience/helix.mjs";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/dm-sans/400.css";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setClearColor(0x000000, 0);

function environment() {
  const env = new THREE.Scene();
  env.background = new THREE.Color("#5a463a");
  const forms = [
    [[-3, 3, 3], [3, 6], 4, "#fff1de"],
    [[3, 1, 2], [1.1, 5], 5, "#fff3e4"],
    [[0, 4, -3], [5, 3], 3, "#d9e1e7"],
    [[-3, -2, -1], [2, 3], 3, "#c99a6b"],
  ];
  for (const [position, [w, h], intensity, color] of forms) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    mesh.position.set(...position);
    mesh.scale.set(w, h, 1);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  }
  return new THREE.PMREMGenerator(renderer).fromScene(env, 0.02).texture;
}

const scene = new THREE.Scene();
scene.environment = environment();
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const key = new THREE.DirectionalLight("#ffe3cd", 2.3);
key.position.set(-3, 5, 3);
const rim = new THREE.DirectionalLight("#e5bf98", 1.5);
rim.position.set(4, -2, -2);
scene.add(key, rim);
const material = new THREE.MeshPhysicalMaterial({
  color: "#d2ab82",
  metalness: 0.8,
  roughness: 0.28,
  clearcoat: 0.45,
  clearcoatRoughness: 0.25,
  envMapIntensity: 1.4,
});
const root = new THREE.Group();
const spinner = new THREE.Group();
root.add(spinner);
scene.add(root);
const strands = [0, 1, 2].map((i) => {
  const strand = createStrand(i, 320, 28);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(strand.positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(strand.normals, 3));
  geometry.setIndex(new THREE.BufferAttribute(strand.indices, 1));
  spinner.add(new THREE.Mesh(geometry, material));
  return { strand, geometry };
});

window.renderHelix = ({ wind, spin, tilt = [-0.14, -0.42], width, height, scale = 1 }) => {
  for (const { strand, geometry } of strands) {
    strand.update(wind);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
    geometry.computeBoundingSphere();
  }
  root.rotation.set(tilt[0], 0, tilt[1]);
  root.scale.setScalar(scale);
  spinner.rotation.y = spin;
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 30);
  camera.position.z = 6.6;
  renderer.setSize(width, height, false);
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL("image/webp", 0.88);
};

window.avatar = async () => {
  const img = new Image();
  img.src = "/images/mariana-original.jpg";
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  // Face crop measured on the 683×1024 portrait.
  canvas.getContext("2d").drawImage(img, 200, 180, 300, 300, 0, 0, 128, 128);
  return canvas.toDataURL("image/webp", 0.9);
};

window.og = async (helix) => {
  const card = document.getElementById("og");
  card.innerHTML = `
    <div style="position:relative;width:1200px;height:630px;background:radial-gradient(ellipse 50% 70% at 76% 55%,#efe1d1,#f7f2ec 70%);color:#3a2a20;font-family:'DM Sans';overflow:hidden">
      <div style="position:absolute;left:58px;top:36px;font-size:14px;letter-spacing:.3em">MARIANA STREY</div>
      <div style="position:absolute;left:58px;right:58px;top:78px;border-top:1px solid rgba(58,42,32,.18)"></div>
      <div style="position:absolute;left:58px;top:168px;font-family:'Cormorant Garamond';font-size:96px;line-height:.95;letter-spacing:-.04em">
        A sua beleza<br><em style="font-weight:500;color:#875935">não segue</em><br>um padrão.
      </div>
      <div style="position:absolute;left:62px;bottom:72px;font-size:14px;letter-spacing:.12em;color:#6e5c4f">BIOMEDICINA ESTÉTICA · CAXIAS DO SUL · CRBM-5 6569</div>
      <img src="${helix}" style="position:absolute;right:40px;top:40px;height:560px">
    </div>`;
  await document.fonts.ready;
  await card.querySelector("img").decode();
};

window.assetsReady = true;
