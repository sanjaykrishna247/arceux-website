import * as THREE from 'three';

// Procedural textures so the robot looks machined without shipping image assets.

function brushedTexture() {
  const s = 512;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(128,128,128)';
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * s;
    const v = 100 + Math.random() * 70;
    g.strokeStyle = `rgba(${v},${v},${v},${0.25 + Math.random() * 0.35})`;
    g.lineWidth = Math.random() * 1.2 + 0.2;
    g.beginPath();
    const x = Math.random() * s;
    g.moveTo(x - 200, y);
    g.lineTo(x + 200 + Math.random() * 200, y + (Math.random() - 0.5) * 0.8);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  t.anisotropy = 8;
  return t;
}

function treadTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 32;
  const g = c.getContext('2d');
  g.fillStyle = '#b39472';
  g.fillRect(0, 0, 256, 32);
  g.fillStyle = '#8d7152';
  for (let i = 0; i < 32; i++) g.fillRect(i * 8, 0, 3, 32);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** The 7" HMI screen: a tiny drawn UI so the display reads as "on". */
function screenTexture() {
  const w = 320;
  const h = 180;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = '#0a1628';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#12233f';
  g.fillRect(0, 0, w, 26);
  g.fillStyle = '#e9edf5';
  g.font = '600 14px monospace';
  g.fillText('ARCEUX-01', 10, 18);
  g.fillStyle = '#1f9d6b';
  g.beginPath();
  g.arc(w - 64, 13, 5, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#9fb3d1';
  g.fillText('READY', w - 54, 18);
  // map
  g.strokeStyle = '#2f7fd6';
  g.lineWidth = 2;
  g.strokeRect(12, 38, 180, 128);
  g.fillStyle = '#1b3358';
  for (let i = 0; i < 4; i++) g.fillRect(28 + i * 40, 52, 22, 40);
  g.strokeStyle = '#e8622c';
  g.setLineDash([5, 4]);
  g.beginPath();
  g.moveTo(24, 150);
  g.lineTo(24, 110);
  g.lineTo(170, 110);
  g.lineTo(170, 60);
  g.stroke();
  g.setLineDash([]);
  // stats
  g.fillStyle = '#9fb3d1';
  g.font = '12px monospace';
  ['BATT  86%', 'SPD 0.50', 'NAV2  OK', 'LIDAR 7.6'].forEach((s, i) => g.fillText(s, 206, 52 + i * 30));
  g.fillStyle = '#1f9d6b';
  g.fillRect(206, 58, 98 * 0.86, 4);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let cache;

export function getMaterials() {
  if (cache) return cache;
  const brushed = brushedTexture();
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);

  cache = {
    steel: std({ color: '#c3c8ce', metalness: 0.92, roughness: 0.34, roughnessMap: brushed, bumpMap: brushed, bumpScale: 0.4 }),
    steelLight: std({ color: '#dfe2e6', metalness: 0.85, roughness: 0.28, roughnessMap: brushed }),
    steelDark: std({ color: '#7c838c', metalness: 0.9, roughness: 0.38, roughnessMap: brushed }),
    chrome: std({ color: '#e6e8ea', metalness: 1, roughness: 0.12 }),
    white: phys({ color: '#f2f1ec', roughness: 0.45, clearcoat: 0.3 }),
    black: std({ color: '#1c1e22', metalness: 0.25, roughness: 0.55 }),
    rubber: std({ color: '#222429', metalness: 0, roughness: 0.92 }),
    tyre: std({ color: '#ffffff', map: treadTexture(), metalness: 0, roughness: 0.85 }),
    tyreSide: std({ color: '#a88a68', metalness: 0, roughness: 0.8 }),
    red: phys({ color: '#d0142c', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 }),
    orange: phys({ color: '#e8622c', roughness: 0.35, clearcoat: 0.6, metalness: 0.1 }),
    green: phys({ color: '#1f9d6b', roughness: 0.3, clearcoat: 1, emissive: '#1f9d6b', emissiveIntensity: 0.35 }),
    greenPort: std({ color: '#2c9a54', roughness: 0.5 }),
    led: std({ color: '#35d08f', emissive: '#1fd08a', emissiveIntensity: 1.2, toneMapped: false }),
    tote: phys({
      color: '#1c64c4',
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.55,
      side: THREE.DoubleSide,
    }),
    toteRib: phys({ color: '#1857ad', roughness: 0.45, clearcoat: 0.3, envMapIntensity: 0.5 }),
    toteDeep: phys({ color: '#123f7e', roughness: 0.6, envMapIntensity: 0.4, side: THREE.DoubleSide }),
    arm: std({ color: '#8f959c', metalness: 0.7, roughness: 0.35, roughnessMap: brushed }),
    armDark: std({ color: '#3a3e45', metalness: 0.5, roughness: 0.45 }),
    glass: phys({ color: '#05070a', metalness: 0.2, roughness: 0.04, clearcoat: 1 }),
    lens: phys({ color: '#1a2b4a', metalness: 0.4, roughness: 0.02, clearcoat: 1, iridescence: 0.6 }),
    screen: std({ color: '#ffffff', map: screenTexture(), emissive: '#ffffff', emissiveMap: null, emissiveIntensity: 0, roughness: 0.2, metalness: 0.1 }),
    sideScreen: std({ color: '#0d2138', emissive: '#2f7fd6', emissiveIntensity: 0.55, roughness: 0.15 }),
    pcbGreen: std({ color: '#1e6b40', roughness: 0.6 }),
    pcbTeal: std({ color: '#0f6d8c', roughness: 0.6 }),
    pcbRed: std({ color: '#9b1c24', roughness: 0.6 }),
    pcbBlue: std({ color: '#1e3f8f', roughness: 0.6 }),
    pcbPurple: std({ color: '#4a2a7a', roughness: 0.6 }),
    battery: std({ color: '#2a2e35', metalness: 0.3, roughness: 0.5 }),
    copper: std({ color: '#c77b3e', metalness: 1, roughness: 0.3 }),
  };
  // The screen should glow with its own UI.
  cache.screen.emissiveMap = cache.screen.map;
  cache.screen.emissiveIntensity = 0.9;
  return cache;
}
