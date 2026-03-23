import styles from "./SnapModal.module.css";
import { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

function SnapModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const [mode, setMode] = useState(null);
  const [input, setInput] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    startCamera(newMode);
  };

  // 🔥 CONVERT BASE64 → FILE
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };


   
const sendToBackend = async (file) => {
  console.log("Sending...");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "https://YOUR_PROJECT_ID.supabase.co/functions/v1/upload-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      },
    );

    const data = await res.json();

    console.log("RESULT:", data);

    setResult(data);
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};
  // 📸 CAPTURE IMAGE
  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    const file = dataURLtoFile(imageData, "capture.png");

    await sendToBackend(file);
  };

  // 🖼 UPLOAD IMAGE
  const openUpload = () => {
    setMode("upload");
    fileRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await sendToBackend(file);
    }
  };

  // ⌨️ PASTE INPUT
  const openPaste = () => {
    setMode("paste");
  };

  // 🛑 CLOSE MODAL
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setMode(null);
    setResult(null);
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

        {/* CAMERA */}
        {mode === "camera" && (
          <div className={styles.cameraBox}>
            <video ref={videoRef} autoPlay playsInline />

            <div className={styles.cameraControls}>
              <button onClick={captureImage} className={styles.captureBtn}>
                {loading ? "Processing..." : "Capture 📸"}
              </button>

              <button onClick={switchCamera} className={styles.switchBtn}>
                Switch 🔄
              </button>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {/* RESULT */}const data = JSON.parse(text);

        {result && (
          <div className={styles.resultBox}>
            <h3>Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        {/* UPLOAD */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFile}
          style={{ display: "none" }}
        />

        {/* PASTE */}
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
