(function(root, nodeRoot) {
  root.pixler = root.pixler || {};

  function Canvas(canvasEl) {
    if (!(canvasEl instanceof HTMLElement) && typeof canvasEl !== 'string') {
      throw new TypeError('argument must be a dom selector or HTMLElement.');
    }

    const canvas = typeof canvasEl === 'string' ? document.querySelector(canvasEl) : canvasEl;

    this.context = canvas.getContext('2d');
    this.backingContext = document.createElement('canvas').getContext('2d');
    this.activeContext = this.context;
  }

  function validImageType(img) {
    if (!(img instanceof ImageData) && !(img instanceof HTMLImageElement)) {
      return false;
    }

    return true;
  }

  Canvas.prototype = {
    clear() {
      const canvas = this.canvas;
      this.activeContext.clearRect(0, 0, canvas.width, canvas.height);
    },

    get canvas() {
      return this.activeContext.canvas;
    },

    context() {
      return this.context;
    },

    store(image) {
      this.activeContext = this.backingContext;
      this.internalWrite(image, 0, 0);
    },

    internalWrite(img, x, y) {
      if (!validImageType(img)) {
        return;
      }

      this.scale(img.width, img.height);
      this.clear();

      if (img instanceof ImageData) {
        this.activeContext.putImageData(img, x, y);
      } else if (img instanceof HTMLImageElement) {
        this.activeContext.drawImage(img, x, y, img.width, img.height);
      }
    },

    write(img, x = 0, y = 0) {
      if (validImageType(img)) {
        this.activeContext = this.context;
        this.internalWrite(img, x, y);
      }
    },

    scale(sizeX, sizeY, scale = root.devicePixelRatio) {
      const canvas = this.canvas;

      canvas.style.height = `${sizeY}px`;
      canvas.style.width = `${sizeX}px`;

      canvas.height = sizeY * scale;
      canvas.width = sizeX * scale;

      this.activeContext.scale(scale, scale);
    },

    getDataURL() {
      return this.canvas.toDataURL('image/png');
    },

    resize(height, width) {
      const canvas = this.canvas;

      return new Promise((resolve, reject) => {
        const ratio = Math.min(width / canvas.width, height / canvas.height);
        const newSize = {
          width: canvas.width * ratio,
          height: canvas.height * ratio
        };
        const img = new Image();

        img.onload = (event) => {
          const image = event.target;

          image.height = newSize.height;
          image.width = newSize.width;

          this.store(image);

          return resolve(image);
        };

        img.src = this.getDataURL();
      });
    },

    read() {
      const context = this.activeContext;
      return context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  root.pixler.canvasInterface = function(canvasEl) {
    return new Canvas(canvasEl);
  };
})(window, document);
