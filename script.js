const imageInput = document.getElementById('image-input');
const uploadZone = document.getElementById('upload-zone');
const canvas = document.getElementById('canvas');
const palette = document.getElementById('palette');
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

uploadZone.addEventListener('click', () => imageInput.click());

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.style.borderColor = '#fff';
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.style.borderColor = '#aaa';
});

uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  handleImage(file);
});

imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  handleImage(file);
});

function handleImage(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      document.getElementById('image-preview').innerHTML = `<img src="${img.src}">`;
      extractColorsFromImage(img);

    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function extractColorsFromImage(img) {
  const colorThief = new ColorThief();

  // Ensure image is loaded
  if (img.complete) {
    const paletteColors = colorThief.getPalette(img, 6);
    const hexColors = paletteColors.map(rgb => rgbToHex(...rgb));

    palette.innerHTML = '';
    hexColors.forEach((hex, i) => {
      const swatch = document.createElement('div');
      swatch.className = 'swatch';
      swatch.style.background = hex;
      swatch.setAttribute('data-hex', hex);
      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(hex);
        showCopiedPopup();
      });
      palette.appendChild(swatch);
      gsap.from(swatch, { opacity: 0, y: 30, delay: i * 0.1 });
    });

    gsap.to(document.body, {
      duration: 1,
      background: `linear-gradient(135deg, ${hexColors[0]}, ${hexColors[1]})`
    });
  } else {
    img.addEventListener('load', () => extractColorsFromImage(img));
  }
}


function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x =>
    x.toString(16).padStart(2, '0')
  ).join('');
}

function showCopiedPopup() {
  const popup = document.getElementById('copied-popup');
  gsap.to(popup, { opacity: 1,})}

gsap.from("h1", {
  opacity: 0,
  y: -50,
  scale: 0.8,
  duration: 1.2,
  ease: "power3.out"
});
