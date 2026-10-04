"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

function roundedShape(width: number, height: number, radius: number) {
  const s = new THREE.Shape(), x = -width / 2, y = -height / 2;
  s.moveTo(x + radius, y); s.lineTo(x + width - radius, y);
  s.quadraticCurveTo(x + width, y, x + width, y + radius);
  s.lineTo(x + width, y + height - radius);
  s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  s.lineTo(x + radius, y + height);
  s.quadraticCurveTo(x, y + height, x, y + height - radius);
  s.lineTo(x, y + radius); s.quadraticCurveTo(x, y, x + radius, y);
  return s;
}

function flatCard(width: number, height: number, radius: number) {
  const geometry = new THREE.ShapeGeometry(roundedShape(width, height, radius), 16);
  const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
  for (let i = 0; i < positions.count; i++) uv.setXY(i, positions.getX(i) / width + .5, positions.getY(i) / height + .5);
  return geometry;
}

export default function SocialScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement); el.classList.add("scene-ready");
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.z = 9.4;
    const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    const env = pmrem.fromScene(room, .04); scene.environment = env.texture; room.dispose();
    const textures: THREE.Texture[] = [];
    const chrome = new THREE.MeshStandardMaterial({ color: "#8b9688", metalness: .95, roughness: .2 });
    const dark = new THREE.MeshStandardMaterial({ color: "#182018", metalness: .35, roughness: .3 });
    const lime = new THREE.MeshPhysicalMaterial({ color: "#caff00", metalness: .18, roughness: .22, clearcoat: 1 });
    const sculpture = new THREE.Group(); scene.add(sculpture);
    const phone = new THREE.Group(); sculpture.add(phone);
    phone.rotation.set(.07, -.2, -.13);
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(2.2, 4.15, .27), { depth: .19, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .035, bevelThickness: .035, curveSegments: 16 }), chrome);
    body.position.z = -.12; phone.add(body);
    const bezel = new THREE.Mesh(flatCard(2.11, 4.06, .25), dark); bezel.position.z = .108; phone.add(bezel);

    const screenCanvas = document.createElement("canvas"); screenCanvas.width = 540; screenCanvas.height = 1040;
    const screenCtx = screenCanvas.getContext("2d")!;
    const screenTexture = new THREE.CanvasTexture(screenCanvas); screenTexture.colorSpace = THREE.SRGBColorSpace; textures.push(screenTexture);
    const photo = new Image();
    function paintScreen() {
      const c = screenCtx;
      c.fillStyle = "#182018"; c.fillRect(0, 0, 540, 1040);
      if (photo.complete && photo.naturalWidth) {
        const h = 780, scale = Math.max(540 / photo.naturalWidth, h / photo.naturalHeight);
        c.save(); c.beginPath(); c.rect(0, 115, 540, h); c.clip();
        c.drawImage(photo, (540 - photo.naturalWidth * scale) / 2, 115 + (h - photo.naturalHeight * scale) / 2, photo.naturalWidth * scale, photo.naturalHeight * scale); c.restore();
      }
      const shade = c.createLinearGradient(0, 550, 0, 900); shade.addColorStop(0, "#18201800"); shade.addColorStop(1, "#182018"); c.fillStyle = shade; c.fillRect(0, 550, 540, 370);
      c.fillStyle = "#f4f4eb"; c.font = "bold 26px sans-serif"; c.fillText("kadraj.social", 30, 91);
      c.font = "22px sans-serif"; c.fillText("•••", 469, 88);
      c.fillStyle = "#caff00"; c.beginPath(); c.roundRect(25, 720, 137, 37, 18); c.fill();
      c.fillStyle = "#182018"; c.font = "bold 17px sans-serif"; c.fillText("YENİ İÇERİK", 42, 745);
      c.fillStyle = "#f4f4eb"; c.font = "bold 59px sans-serif"; c.fillText("AKIŞI", 25, 819); c.fillText("DEĞİŞTİR.", 25, 881);
      c.fillStyle = "#caff00"; c.font = "35px sans-serif"; c.fillText("♡  ↗", 30, 941);
      c.fillStyle = "#f4f4eb"; c.font = "18px sans-serif"; c.fillText("Fikirden, son kareye.", 30, 982);
      c.fillStyle = "#8c9580"; c.font = "16px sans-serif"; c.fillText("REELS  /  KREATİF STÜDYO", 30, 1015);
      c.fillStyle = "#0a0d0a"; c.beginPath(); c.roundRect(188, 15, 164, 30, 15); c.fill();
      c.fillStyle = "#f4f4eb55"; c.beginPath(); c.arc(270, 440, 55, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.moveTo(258, 410); c.lineTo(258, 470); c.lineTo(302, 440); c.closePath(); c.fill();
      screenTexture.needsUpdate = true;
    }
    paintScreen();
    photo.onload = () => { paintScreen(); renderer.render(scene, camera); }; photo.src = "/media/work-01.jpg";
    const screen = new THREE.Mesh(flatCard(1.98, 3.89, .2), new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false })); screen.position.z = .12; phone.add(screen);
    const sideButton = new THREE.Mesh(new RoundedBoxGeometry(.055, .52, .085, 2, .022), chrome); sideButton.position.set(1.132, .63, -.01); phone.add(sideButton);

    const makeBadge = (title: string, subtitle: string, symbol: string, inverse = false) => {
      const canvas = document.createElement("canvas"); canvas.width = 560; canvas.height = 330;
      const c = canvas.getContext("2d")!;
      c.fillStyle = inverse ? "#caff00" : "#f4f4eb"; c.fillRect(0, 0, 560, 330);
      c.fillStyle = "#26301f"; c.font = "bold 34px sans-serif"; c.fillText(title, 30, 217);
      c.fillStyle = "#69735b"; c.font = "19px sans-serif"; c.fillText(subtitle, 30, 263);
      c.fillStyle = inverse ? "#26301f" : "#26301f"; c.font = "bold 103px sans-serif"; c.fillText(symbol, 28, 128);
      c.font = "22px sans-serif"; c.fillText("✳", 498, 45);
      const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
      const badge = new THREE.Group();
      const shell = new THREE.Mesh(new RoundedBoxGeometry(1.45, .87, .09, 3, .045), inverse ? lime : chrome); badge.add(shell);
      const front = new THREE.Mesh(flatCard(1.4, .82, .04), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })); front.position.z = .049; badge.add(front);
      sculpture.add(badge); return badge;
    };
    const reels = makeBadge("Reels & video", "DURDURUP BAKTIRAN FİKİRLER", "▶", true);
    reels.position.set(-1.55, .86, .48); reels.rotation.set(-.1, .2, .14);
    const story = makeBadge("Marka hikâyesi", "HER EKRANDA AYNI KARAKTER", "#");
    story.position.set(1.55, -.95, .46); story.rotation.set(.06, -.2, -.1);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -.35); heartShape.bezierCurveTo(-.85, .05, -.65, .8, 0, .4); heartShape.bezierCurveTo(.65, .8, .85, .05, 0, -.35);
    const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(heartShape, { depth: .16, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .07, bevelThickness: .07, curveSegments: 20 }), lime);
    heart.scale.setScalar(.72); heart.position.set(1.63, 1.25, .2); heart.rotation.set(.05, -.25, .15); sculpture.add(heart);
    const bubble = new THREE.Mesh(new THREE.TorusGeometry(.25, .075, 16, 48), chrome); bubble.position.set(-1.6, -1.25, .4); bubble.rotation.set(.1, .3, 0); sculpture.add(bubble);
    const shadowCanvas = document.createElement("canvas"); shadowCanvas.width = 128; shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext("2d")!, gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "#20271a60"); gradient.addColorStop(1, "#20271a00"); shadowCtx.fillStyle = gradient; shadowCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas); textures.push(shadowTexture);
    const shadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: shadowTexture, transparent: true, depthWrite: false })); shadow.scale.set(4.5, .55, 1); shadow.position.set(0, -2.4, -.5); scene.add(shadow);
    const key = new THREE.DirectionalLight("#ffffff", 3); key.position.set(3, 5, 4); scene.add(key);
    const fill = new THREE.DirectionalLight("#d9efbb", 2); fill.position.set(-4, 3, -2); scene.add(fill);

    const pointer = { x: 0, y: 0 };
    let visible = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)"); let reduced = motion.matches;
    const resize = () => {
      const { width, height } = el.getBoundingClientRect(); camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix(); renderer.setSize(width, height); renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    const move = (event: PointerEvent) => { pointer.x = (event.clientX / window.innerWidth - .5) * .35; pointer.y = (event.clientY / window.innerHeight - .5) * .2; };
    window.addEventListener("pointermove", move, { passive: true });
    let elapsed = 0, previous = 0;
    const render = (time: number) => {
      if (el.closest("[inert]")) { previous = time; return; }
      const delta = Math.min((time - previous) / 1000, .05); previous = time; elapsed += delta;
      const scroll = Math.min(window.scrollY / window.innerHeight, 1);
      sculpture.rotation.y += (pointer.x + Math.sin(elapsed * .35) * .06 + scroll * .45 - sculpture.rotation.y) * .05;
      sculpture.rotation.x += (pointer.y - sculpture.rotation.x) * .05;
      phone.position.y = Math.sin(elapsed * .65) * .055;
      reels.position.y = .86 + Math.sin(elapsed * .8) * .1;
      story.position.y = -.95 + Math.sin(elapsed * .7 + 1) * .1;
      heart.rotation.y = -.25 + Math.sin(elapsed * .6) * .25;
      heart.position.y = 1.25 + Math.sin(elapsed * .9 + 2) * .09;
      bubble.position.y = -1.25 + Math.sin(elapsed * .7) * .08;
      renderer.render(scene, camera);
    };
    const sync = () => { renderer.setAnimationLoop(visible && !document.hidden && !reduced ? render : null); if (reduced) renderer.render(scene, camera); };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }); io.observe(el);
    const preference = () => { reduced = motion.matches; sync(); }; motion.addEventListener("change", preference);
    document.addEventListener("visibilitychange", sync); sync();
    return () => {
      renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect(); photo.onload = null;
      window.removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", preference);
      const materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m)); } });
      materials.forEach(m => m.dispose()); shadow.material.dispose(); textures.forEach(t => t.dispose());
      env.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove(); el.classList.remove("scene-ready");
    };
  }, []);
  return <div ref={host} className="orbit-scene" aria-hidden="true"><div className="social-scene-fallback"><span>kadraj.social</span><b>AKIŞI<br />DEĞİŞTİR.</b><small>REELS · İÇERİK · TASARIM</small></div></div>;
}
