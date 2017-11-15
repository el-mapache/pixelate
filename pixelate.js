(function(root) {
  root.pixler = root.pixler || {};

  function clamp(value, max) {
    return value > max ? max : value;
  }

  function getSubImage(uint8array, x, y, width, height) {
    const startPixel = y * width + x;
    let length = width * height * 4;
    length = length > uint8array.length ? uint8array.length - length : length;
    console.log(startPixel)
    return uint8array.slice(startPixel, startPixel + length);
  }

  // clean this up probaby!
  function getDominantColor(image, height, width) {
    const colorMap = {};
    const dominant = { value: null, count: 0 };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let pixel = y * width + x * 4;
        let color = image[pixel] << 24;
        color |= image[++pixel] << 16;
        color |= image[++pixel] << 8;

        if (color in colorMap) {
          colorMap[color] += 1;

          if (typeof dominant.value === 'number') {
            const currentColorIsDominant = colorMap[color] > dominant.count;

            if (currentColorIsDominant) {
              dominant.value = color;
              dominant.count = colorMap[color];
            }
          } else {
            dominant.value = color;
            dominant.count = 1;
          }
        } else {
          colorMap[color] = 1;
        }
      }
    }

    return dominant.value;
  }

  function pixelate(imageData, pixelSize) {
    const { data: pixels } = imageData;
    const sh = imageData.height;
    const sw = imageData.width;
    const pixelColorList = [];

    for (let y = 0; y < sh; y += pixelSize) {
      for (let x = 0; x < sw; x += pixelSize) {
        // const subImage = getSubImage(pixels, x, y, pixelSize, pixelSize);
        // const dominantColor = getDominantColor(subImage, pixelSize, pixelSize);
        //
        // for (let scy = y; scy < y + pixelSize; scy++) {
        //   for (let scx = x; scx < x + pixelSize; scx++) {
        //     if (!(scy >= 0 && scy < sh && scx >= 0 && scx < sw)) {
        //       continue;
        //     }
        //
        //     let currentPixel = (scy * sw + scx) * 4
        //     pixels[currentPixel] = dominantColor >> 24 & 0xff;
        //     pixels[++currentPixel] = dominantColor >> 16 & 0xff;
        //     pixels[++currentPixel] = dominantColor >> 8 & 0xff;
        //   }
        // }
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

    return [ pixelColorList, imageData ];
  }

  root.pixler.pixelate = pixelate;
})(window);
