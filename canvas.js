(function(root, nodeRoot) {
  root.pixler = root.pixler || {};

  let cachedInstance = null;

  function Canvas(canvasEl) {
    if (!(canvasEl instanceof HTMLElement) && typeof canvasEl !== 'string') {
      throw new TypeError('argument must be a dom selector or HTMLElement.');
    }

    this.canvas = typeof canvasEl === 'string' ? document.querySelector(canvasEl) : canvasEl;
    this.context = this.canvas.getContext('2d');
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
      this.activeContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

      if (img instanceof ImageData) {
        this.activeContext.putImageData(img, x, y);
      } else if (img instanceof HTMLImageElement) {
        this.scale(img.width, img.height);
        this.activeContext.drawImage(img, x, y);
      }
    },

    scale(sizeX, sizeY, scale = root.devicePixelRatio) {
      this.canvas.style.height = `${sizeY}px`;
      this.canvas.style.width = `${sizeX}px`;

      this.canvas.height = sizeY * scale;
      this.canvas.width = sizeX * scale;

      this.context.scale(scale, scale);
    },

    write(img, x = 0, y = 0, width = this.canvas.width, height = this.canvas.height) {
      if (validImageType(img)) {
        this.activeContext = this.context;
        this.internalWrite(img, x, y, width, height);
      }
    },

    getDataURL() {
      return this.activeContext.canvas.toDataURL('image/png');
    },

    resizeAndDraw(height, width) {
      return new Promise((resolve, reject) => {
        const ratio = Math.min(width / this.canvas.width, height / this.canvas.height);
        const newSize = {
          width: this.canvas.width * ratio,
          height: this.canvas.height * ratio
        };

        const nextData = this.getDataURL();
        const img = new Image();

        img.onload = (event) => {
          const image = event.target;

          image.height = newSize.height;
          image.width = newSize.width;

          this.clear();
          this.scale(image.width, image.height);
          this.activeContext.drawImage(image, 0, 0, image.width, image.height);

          return resolve();
        };

        img.src = nextData;
      });
    },

    read() {
      const context = this.activeContext;
      return context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    }
  };

  root.pixler.canvasInterface = function(canvasEl) {
    if (!cachedInstance) {
      cachedInstance = new Canvas(canvasEl);
    }

    return cachedInstance;
  };
})(window, document);
