// src/components/layout/Header/Header/jsx

import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div to="/" className="logo" aria-label="ホームへ戻る">
        掲示板アプリ
      </div>
    </div>
  );
};

export default Header;
