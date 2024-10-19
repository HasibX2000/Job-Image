export const resizeImage = (imageSource, targetSize, maxSizeInBytes) => {
  return new Promise((resolve) => {
    const processImage = (imgSrc) => {
      const img = new Image();
      img.onload = () => {
        // First, crop to 1:1 ratio
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);

        // Now resize to target size
        const resizeCanvas = document.createElement("canvas");
        resizeCanvas.width = targetSize;
        resizeCanvas.height = targetSize;
        const resizeCtx = resizeCanvas.getContext("2d");

        resizeCtx.drawImage(canvas, 0, 0, size, size, 0, 0, targetSize, targetSize);

        let quality = 0.9;
        let resizedImage = resizeCanvas.toDataURL("image/jpeg", quality);

        while (resizedImage.length > maxSizeInBytes && quality > 0.1) {
          quality -= 0.1;
          resizedImage = resizeCanvas.toDataURL("image/jpeg", quality);
        }

        resolve(resizedImage);
      };
      img.src = imgSrc;
    };

    if (typeof imageSource === "string" && imageSource.startsWith("data:")) {
      // If imageSource is already a data URL, process it directly
      processImage(imageSource);
    } else {
      // If imageSource is a Blob or File, read it as a data URL first
      const reader = new FileReader();
      reader.onload = (e) => {
        processImage(e.target.result);
      };
      reader.readAsDataURL(imageSource);
    }
  });
};

export const resizeSignature = (imageSource, targetWidth, targetHeight, maxSizeInBytes) => {
  return new Promise((resolve) => {
    const processImage = (imgSrc) => {
      const img = new Image();
      img.onload = () => {
        // First, crop to 15:4 ratio (300:80)
        const aspectRatio = targetWidth / targetHeight;
        let cropWidth, cropHeight, startX, startY;

        if (img.width / img.height > aspectRatio) {
          cropHeight = img.height;
          cropWidth = cropHeight * aspectRatio;
          startY = 0;
          startX = (img.width - cropWidth) / 2;
        } else {
          cropWidth = img.width;
          cropHeight = cropWidth / aspectRatio;
          startX = 0;
          startY = (img.height - cropHeight) / 2;
        }

        const canvas = document.createElement("canvas");
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        // Now resize to target size
        const resizeCanvas = document.createElement("canvas");
        resizeCanvas.width = targetWidth;
        resizeCanvas.height = targetHeight;
        const resizeCtx = resizeCanvas.getContext("2d");

        resizeCtx.drawImage(canvas, 0, 0, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);

        let quality = 0.9;
        let resizedImage = resizeCanvas.toDataURL("image/png", quality);

        while (resizedImage.length > maxSizeInBytes && quality > 0.1) {
          quality -= 0.1;
          resizedImage = resizeCanvas.toDataURL("image/png", quality);
        }

        resolve(resizedImage);
      };
      img.src = imgSrc;
    };

    if (typeof imageSource === "string" && imageSource.startsWith("data:")) {
      // If imageSource is already a data URL, process it directly
      processImage(imageSource);
    } else {
      // If imageSource is a Blob or File, read it as a data URL first
      const reader = new FileReader();
      reader.onload = (e) => {
        processImage(e.target.result);
      };
      reader.readAsDataURL(imageSource);
    }
  });
};
