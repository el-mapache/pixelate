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

    resize(height, width) {
      var hRatio = this.canvas.width / width;
      var vRatio =  this.canvas.height / height;
      var ratio = Math.min ( hRatio, vRatio );
      var centerShift_x = ( this.canvas.width - width * ratio ) / 2;
      var centerShift_y = ( this.canvas.height - height * ratio ) / 2;
      var oldImg = this.canvas.toDataURL('image/png');
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var img = new Image();

      img.onload = (event) => {
        const i = event.target;
        const { width, height } = i;

        this.context.drawImage(i, 0, 0, width, height,
          centerShift_x, centerShift_y, width * ratio, height * ratio);
      };

      img.src = oldImg;
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
