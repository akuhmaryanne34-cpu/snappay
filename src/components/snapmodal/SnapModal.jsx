import styles from "./snapModal.module.css";
import { useRef, useState } from "react";

function SnapModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [mode, setMode] = useState(null);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  // 📸 CAMERA ACCESS
  const openCamera = async () => {
    setMode("camera");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied");
    }
  };

  // 🖼 UPLOAD IMAGE
  const openUpload = () => {
    setMode("upload");
    fileRef.current.click();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image selected:", file);
    }
  };

  // ⌨️ PASTE INPUT
  const openPaste = () => {
    setMode("paste");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {!mode && (
          <>
            <h2>Send Money</h2>
            <p>Choose how you want to enter account details</p>

            <div className={styles.options}>
              <button onClick={openCamera} className={styles.option}>
                📸 Use Camera
              </button>

              <button onClick={openUpload} className={styles.option}>
                🖼 Upload Screenshot
              </button>

              <button onClick={openPaste} className={styles.option}>
                ⌨️ Paste Account Number
              </button>
            </div>
          </>
        )}

        {/* CAMERA VIEW */}
        {mode === "camera" && (
          <div className={styles.cameraBox}>
            <video ref={videoRef} autoPlay playsInline />
          </div>
        )}

        {/* UPLOAD INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFile}
          style={{ display: "none" }}
        />

        {/* PASTE INPUT */}
        {mode === "paste" && (
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Enter account number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        )}

        <button className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SnapModal;
