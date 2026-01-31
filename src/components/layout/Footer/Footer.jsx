//src/components/layout/Footer/Footer.jsx

import React from "react";
import "./Footer.css";

import GitHubIcon from "@mui/icons-material/GitHub";
import Tooltip from "@mui/material/Tooltip";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Tooltip title="GitHubページへ">
            <a
              href="https://github.com/MasatakeI/bbs_app.git"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <GitHubIcon />
            </a>
          </Tooltip>
        </div>
        <p className="copyright">
          &copy; {currentYear} 掲示板アプリ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
