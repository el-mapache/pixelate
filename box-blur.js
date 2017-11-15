(function(root) {
  root.pixler = root.pixler || {};

  function clamp(value, max) {
    return value > max ? max : value;
  }

  function boxBlur(imageData, size = 15) {
    const { data: pixels } = imageData;
    const halfSize = (size / 2) | 0;
    const sh = imageData.height;
    const sw = imageData.width;
    let r, g, b;

    // naive first
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        let currentPixel = (y * sw + x) * 4;
        let count = 0;
        r = 0, g = 0, b = 0;

        for (let cy = -halfSize; cy < halfSize; cy++) {
          for (let cx = -halfSize; cx < halfSize; cx++ ) {
            const scy = y + cy;
            const scx = x + cx;

            if (!(scy >= 0 && scy < sh && scx >= 0 && scx < sw)) {
              continue;
            }

            let matrixOffset = (scy * sw + scx) * 4;

            r += pixels[matrixOffset];
            g += pixels[++matrixOffset];
            b += pixels[++matrixOffset];
            count += 1;
          }
        }

        pixels[currentPixel] =  clamp(r / count, 255);
        pixels[++currentPixel] = clamp(g / count, 255);
        pixels[++currentPixel] = clamp(b / count, 255);
      }
    }

    return imageData;
  }

  root.pixler.boxBlur = boxBlur;
})(window);
