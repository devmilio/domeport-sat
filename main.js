// Références UI
const uploadBtn = document.getElementById('uploadBtn');
const playBtn   = document.getElementById('playBtn');
const fileInput = document.getElementById('fileInput');

// Vidéo & dôme
const videoEl = document.getElementById('vid');
const domeEl  = document.getElementById('dome');

// Boutons 3D
const btnPlay3D      = document.getElementById('btnPlay3D');
const btnPlay3DLabel = document.getElementById('btnPlay3DLabel');

const BUTTONS_3D = [btnPlay3D];

const setUploadBtn = (txt, dis=false) => { uploadBtn.textContent = txt; uploadBtn.disabled = dis; };
const mapVideo = () => {
    domeEl.setAttribute('material', { shader: 'flat', side: 'double', color: '#FFF', src: '#vid' });
    const m = domeEl.components?.material?.material; if (m) m.needsUpdate = true;
};
const setButtonsOpacity = (alpha) => {
    BUTTONS_3D.forEach(el => el && el.setAttribute('material','opacity', alpha));
};
const setPlayLabel = () => {
    btnPlay3DLabel.setAttribute('value', videoEl.paused ? 'Play' : 'Pause');
};

// Upload (2D only now)
uploadBtn.addEventListener('click', () => fileInput.click());

// Gestion du fichier choisi
fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Veuillez choisir une vidéo (MP4 ou WebM).');
      return;
    }
    setUploadBtn('loading', true);
    playBtn.style.display = 'none';

    const url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.load();

    videoEl.addEventListener('canplay', () => {
      mapVideo();
      setUploadBtn('Upload video', false);
      playBtn.style.display = 'inline-block';
      setPlayLabel();
      setButtonsOpacity(0.95);
    }, { once:true });
});

// Bouton Play 2D
playBtn.addEventListener('click', () => {
    if (!videoEl.src) return;
    videoEl.play().catch(()=>{});
});

// Hover FX
const addHoverFX = (el) => {
    if (!el) return;
    el.addEventListener('mouseenter', () => el.setAttribute('scale', '1.05 1.05 1'));
    el.addEventListener('mouseleave', () => el.setAttribute('scale', '1 1 1'));
};
BUTTONS_3D.forEach(addHoverFX);

// Play/Pause 3D
btnPlay3D.addEventListener('click', () => {
    if (!videoEl.src) return;
    if (videoEl.paused) {
      videoEl.play().catch(()=>{});
    } else {
      videoEl.pause();
    }
    setPlayLabel();
});

// Gestion opacité
videoEl.addEventListener('play',  () => { setButtonsOpacity(0.5);  setPlayLabel(); });
videoEl.addEventListener('pause', () => { setButtonsOpacity(0.95); setPlayLabel(); });
videoEl.addEventListener('ended', () => { setButtonsOpacity(0.95); setPlayLabel(); });
