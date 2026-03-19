import styles from "./Hero.Module.Css";
import herobg2 from "../../assets/images/herobg2.png";
import { useState } from "react";
import SnapModal from "../snapmodal/SnapModal";

function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${herobg2})` }}
      >
        <div className={styles.overlay}></div>

        <div className={styles.container}>
          <div className={styles.left}>
            <h1 className={styles.title}>
              Snap. Scan. <br />
              <span>Send Money Instantly.</span>
            </h1>

            <p className={styles.subtitle}>
              Skip typing account numbers. Just scan and send money in seconds
              with Snappay.
            </p>

            <button className={styles.btn} onClick={() => setOpen(true)}>
              Snap Now 
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <SnapModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default Hero;
