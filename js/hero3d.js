/* hero3d.js – Three.js 3D PCB scene, lazy-loaded on capable desktops */
export async function initHero3D() {
  // Only on desktop, not reduced motion
  if (window.innerWidth < 900 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('hero3d-canvas');
  if (!canvas) return;

  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');

    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);

    // Board
    const boardGeo  = new THREE.BoxGeometry(5, 0.12, 3.5);
    const boardMat  = new THREE.MeshStandardMaterial({ color: 0x0d2b24, roughness: 0.8, metalness: 0.1 });
    const board     = new THREE.Mesh(boardGeo, boardMat);
    scene.add(board);

    // Chip (QFP package approximation)
    const chipGeo = new THREE.BoxGeometry(0.8, 0.08, 0.8);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 });
    const chip    = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(0, 0.1, 0);
    scene.add(chip);

    // Gold pads (emissive traces)
    const padGeo = new THREE.BoxGeometry(0.06, 0.02, 0.04);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xd6b266, emissive: 0xd6b266, emissiveIntensity: 0.5, metalness: 1, roughness: 0.2 });
    [-1.5, -1, -0.5, 0, 0.5, 1, 1.5].forEach(x => {
      [-1.3, 1.3].forEach(z => {
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.set(x, 0.065, z);
        scene.add(pad);
      });
    });

    // Signal trace (emissive, animated)
    const tracePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0.07, 0),
      new THREE.Vector3(-1.2, 0.07, 0.6),
      new THREE.Vector3(0, 0.07, 0.4),
      new THREE.Vector3(1.4, 0.07, -0.8),
    ]);
    const traceGeo = new THREE.TubeGeometry(tracePath, 30, 0.015, 4, false);
    const traceMat = new THREE.MeshStandardMaterial({ color: 0x6fe3c1, emissive: 0x6fe3c1, emissiveIntensity: 0.8, metalness: 0.5 });
    scene.add(new THREE.Mesh(traceGeo, traceMat));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xd6b266, 1.2);
    key.position.set(3, 4, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6fe3c1, 0.4);
    fill.position.set(-3, 2, 4);
    scene.add(fill);

    // Mouse tilt
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      targetX = (e.clientX / window.innerWidth  - 0.5) *  0.25;
      targetY = (e.clientY / window.innerHeight - 0.5) * -0.15;
    });

    let traceTime = 0;
    canvas.classList.add('active');
    document.getElementById('hero-board-img')?.setAttribute('style', 'display:none');

    function animate() {
      requestAnimationFrame(animate);
      board.rotation.y += (targetX - board.rotation.y) * 0.06;
      board.rotation.x += (targetY - board.rotation.x) * 0.06;
      chip.rotation.y  = board.rotation.y;
      chip.rotation.x  = board.rotation.x;
      traceTime += 0.02;
      traceMat.emissiveIntensity = 0.5 + Math.sin(traceTime) * 0.4;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const nw = canvas.parentElement.offsetWidth;
      const nh = canvas.parentElement.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

  } catch (err) {
    console.warn('Three.js not loaded, using image fallback', err);
  }
}
