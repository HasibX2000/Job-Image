import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { resizeImage } from "../utils/imageUtils";
import uploadIcon from "../assets/upload.png"; // Import the icon

export default function ImageResizer() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setOriginalFileName(file.name.split(".")[0]);
        setResizedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleResize = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const resized = await resizeImage(croppedImage, 300, 100 * 1024);
      setResizedImage(resized);
    }
  };

  const handleDownload = (format) => {
    if (resizedImage) {
      const link = document.createElement("a");
      link.href = resizedImage;
      link.download = `${originalFileName}_resized.${format}`;
      link.click();
    }
  };

  return (
    <div className="image-resizer">
      <h2>Image Resizer</h2>
      <label className="file-input-wrapper">
        <img src={uploadIcon} alt="Upload" className="upload-icon" />
        Choose an image
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
      {image && (
        <div className="cropper-container">
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>
      )}
      {image && <button onClick={handleResize}>Resize Image</button>}
      {resizedImage && (
        <div className="resized-image-container">
          <img src={resizedImage} alt="Resized" className="resized-image" />
          <div className="download-buttons">
            <button onClick={() => handleDownload("png")}>Download PNG</button>
            <button onClick={() => handleDownload("jpg")}>Download JPG</button>
          </div>
        </div>
      )}
    </div>
  );
}
