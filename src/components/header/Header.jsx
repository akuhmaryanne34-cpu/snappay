import styles from "./Header.Module.Css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Snap <span>PAY</span>
      </div>

      {/* DESKTOP NAV */}
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* AUTH BUTTONS */}
      <div className={styles.authButtons}>
        <Link to="/login" className={styles.login}>
          Login
        </Link>
        <Link to="/signup" className={styles.signup}>
          Get Started
        </Link>
      </div>

      {/* HAMBURGER */}
      <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {menuOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </div>

          {/* CLOSE BUTTON */}
          <div className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
            ✕
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
