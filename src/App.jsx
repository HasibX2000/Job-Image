import { useState } from "react";
import ImageResizer from "./components/ImageResizer";
import SignatureResizer from "./components/SignatureResizer";
import Footer from "./components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState("image");

  return (
    <div className="app">
      <h1>Image and Signature Resizer For Job Application</h1>
      <div className="tabs">
        <button
          onClick={() => setActiveTab("image")}
          className={activeTab === "image" ? "active" : ""}
        >
          Image Resizer
        </button>
        <button
          onClick={() => setActiveTab("signature")}
          className={activeTab === "signature" ? "active" : ""}
        >
          Signature Resizer
        </button>
      </div>
      <div className="content">
        {activeTab === "image" ? <ImageResizer /> : <SignatureResizer />}
      </div>
      <Footer />
    </div>
  );
}
