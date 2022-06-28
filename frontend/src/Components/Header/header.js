import styles from "./header.module.scss";

import { FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <div className="main">
      <div className="slogan">
        <label id="label">
          Speed up with <b>Ensemble</b>
        </label>
      </div>

      <div className="logo">
        <img id="logo" src="/Assets/logos/transparent.png" />
      </div>

      <div className="user">
        <label id="name">Deepthi</label>
        <div>
          <FaUserCircle id="userIcon" size={48} />
        </div>
      </div>
    </div>
  );
}

export default Header;
