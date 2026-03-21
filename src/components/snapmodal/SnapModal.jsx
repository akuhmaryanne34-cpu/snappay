import styles from "./snapModal.module.css";
import { useRef, useState } from "react";

function SnapModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const [mode, setMode] = useState(null);
  const [input, setInput] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [stream, setStream] = useState(null);

  if (!isOpen) return null;

  // 📸 START CAMERA
  const startCamera = async (mode = "environment") => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      setStream(newStream);
    } catch (err) {
      alert("Camera access denied");
    }
  };

  // OPEN CAMERA
  const openCamera = () => {
    setMode("camera");
    startCamera(facingMode);
  };

  // 🔄 SWITCH CAMERA
  const switchCamera = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);

    // stop current stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    startCamera(newMode);
  };

  // 📸 CAPTURE IMAGE
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    console.log("Captured Image:", imageData);
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

  // 🛑 CLOSE MODAL + STOP CAMERA
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setMode(null);
    onClose();
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

            <div className={styles.cameraControls}>
              <button onClick={captureImage} className={styles.captureBtn}>
                Capture 📸
              </button>

              <button onClick={switchCamera} className={styles.switchBtn}>
                Switch 🔄
              </button>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
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

        <button className={styles.close} onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SnapModal;
