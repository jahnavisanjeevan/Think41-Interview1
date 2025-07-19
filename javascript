const upload = document.getElementById('upload');
const originalCanvas = document.getElementById('originalCanvas');
const smoothedCanvas = document.getElementById('smoothedCanvas');
const ctxOriginal = originalCanvas.getContext('2d');
const ctxSmoothed = smoothedCanvas.getContext('2d');

let imgWidth, imgHeight;

upload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      imgWidth = img.width;
      imgHeight = img.height;

      originalCanvas.width = imgWidth;
      originalCanvas.height = imgHeight;
      smoothedCanvas.width = imgWidth;
      smoothedCanvas.height = imgHeight;

      ctxOriginal.drawImage(img, 0, 0);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function applySmoothing() {
  const imageData = ctxOriginal.getImageData(0, 0, imgWidth, imgHeight);
  const data = imageData.data;
  const smoothedData = new Uint8ClampedArray(data.length);

  function getIndex(x, y) {
    return (y * imgWidth + x) * 4;
  }

  for (let y = 1; y < imgHeight - 1; y++) {
    for (let x = 1; x < imgWidth - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = getIndex(x + dx, y + dy) + c;
            sum += data[idx];
          }
        }
        const i = getIndex(x, y) + c;
        smoothedData[i] = sum / 9;
      }
      smoothedData[getIndex(x, y) + 3] = 255; // alpha
    }
  }

  const output = new ImageData(smoothedData, imgWidth, imgHeight);
  ctxSmoothed.putImageData(output, 0, 0);
}
