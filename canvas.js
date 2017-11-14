(function(root, nodeRoot) {
  root.pixler = root.pixler || {};

  function Canvas(canvasEl) {
    this.canvas = canvasEl;
    this.context = this.canvas.getContext('2d');
  }

  let cachedInstance = null;

  Canvas.prototype = {
    scale(sizeX, sizeY, scale = root.devicePixelRatio) {
      this.canvas.style.height = `${sizeY}px`;
      this.canvas.style.width = `${sizeX}px`;

      this.canvas.height = sizeY * scale;
      this.canvas.width = sizeX * scale;

      this.context.scale(scale, scale);
    },

    writeImage(img, x = 0, y = 0) {
      this.scale(img.width, img.height);
      this.context.drawImage(img, x, y);
    },

    writeData(data) {
      this.context.putImageData(data, 0, 0);
    },

    readImage() {
      const { canvas } = this;
      return this.context.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  root.pixler.canvasInterface = function(canvasEl) {
    if (!cachedInstance) {
      cachedInstance = new Canvas(canvasEl);
    }

    return cachedInstance;
  };
})(window, document);
