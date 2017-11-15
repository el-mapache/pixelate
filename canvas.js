(function(root, nodeRoot) {
  root.pixler = root.pixler || {};

  function Canvas(canvasEl) {
    this.canvas = canvasEl;
    this.context = this.canvas.getContext('2d');
  }

  let cachedInstance = null;

  Canvas.prototype = {
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

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

    resize(height, width) {
      return new Promise((resolve, reject) => {
        const ratio = Math.min(width / this.canvas.width, height / this.canvas.height);
        const newSize = {
          width: this.canvas.width * ratio,
          height: this.canvas.height * ratio
        };
        const nextData = this.canvas.toDataURL('image/png');
        const img = new Image();

        img.onload = (event) => {
          const image = event.target;

          image.height = newSize.height;
          image.width = newSize.width;
          this.canvas.width = newSize.width;
          this.canvas.height = newSize.height;
          this.canvas.style.height = `${newSize.height}px`;
          this.canvas.style.width = `${newSize.width}px`;

          this.clear();
          this.context.drawImage(image, 0, 0, newSize.width, newSize.height);

          return resolve();
        };

        img.src = nextData;
      });
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
