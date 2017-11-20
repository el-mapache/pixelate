(function(root) {
  root.pixler = root.pixler || {};

  function pixelate(imageData, pixelSize) {
    const { data: pixels } = imageData;
    const sh = imageData.height;
    const sw = imageData.width;
    const pixelColorList = [];

    for (let y = 0; y < sh; y += pixelSize) {
      for (let x = 0; x < sw; x += pixelSize) {
        let pixel = (y * sw + x) * 4;
        let color = pixels[pixel] << 24;
        color |= pixels[++pixel] << 16;
        color |= pixels[++pixel] << 8;

        pixelColorList.push(color);

        for (let scy = y; scy < y + pixelSize; scy++) {
          for (let scx = x; scx < x + pixelSize; scx++) {
            if (!(scy >= 0 && scy < sh && scx >= 0 && scx < sw)) {
              continue;
            }

            let destPix = (scy * sw + scx) * 4
            pixels[destPix] = color >> 24 & 0xff;
            pixels[++destPix] = color >> 16 & 0xff;
            pixels[++destPix] = color >> 8 & 0xff;
          }
        }
      }
    }

    return { imageData, pixelColorList };
  }

  root.pixler.pixelate = pixelate;
})(window);
