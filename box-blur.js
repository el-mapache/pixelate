(function(root) {
  root.pixler = root.pixler || {};

  function boxBlur(imageData, size = 9) {
    const { data: pixels } = imageData;
    const halfSize = (size / 2) | 0;
    const sh = imageData.height;
    const sw = imageData.width;
    const sum = [];

    // naive first
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        let currentPixel = (y * sw + x) * 4;
        sum.length = 0;
        let color;

        for (let cy = -halfSize; cy < halfSize; cy++) {
          for (let cx = -halfSize; cx < halfSize; cx++ ) {
            const scy = y + cy;
            const scx = x + cx;

            if (!(scy >= 0 && scy < sh && scx >= 0 && scx < sw)) {
              continue;
            }

            let matrixOffset = (scy * sw + scx) * 4;

            let result = pixels[matrixOffset] << 24; // roy
            result |= pixels[++matrixOffset] << 16; // gee
            result |= pixels[++matrixOffset] << 8; // biv

            sum.push(result);
          }
        }

        color = sum.reduce((m, v) => { return m + v; }, 0) / sum.length;
        pixels[currentPixel] =  color >> 24 & 0xff;
        pixels[++currentPixel] = color >> 16 & 0xff;
        pixels[++currentPixel] = color >> 8 & 0xff;
      }
    }

    return imageData;
  }

  root.pixler.boxBlur = boxBlur;
})(window);
