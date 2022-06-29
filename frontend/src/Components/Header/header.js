import styles from "./header.module.scss";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdPersonPin } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { logout } from "../../StateManagement/Reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <div className={styles.main}>
      <div className={styles.slogan}>
        <label id={styles.label}>
          Speed up with <b>Ensemble</b>
        </label>
      </div>

      <div className={styles.logo}>
        <img id={styles.logo} src="/Assets/logos/transparent.png" />
      </div>

      <div className={styles.accDiv}>
        <label className={styles.username}>
          {user ? user.firstname : "Guest"}
        </label>
        <div
          className={styles.menuDiv}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <MdPersonPin className={styles.avatar} size={35} />
          <AiFillCaretDown className={styles.dropIcon} />
          {showMenu && (
            <div className={styles.menu}>
              <div className={styles.menuItem}>
                <CgProfile className={styles.menuIcon} />
                <label
                  className={styles.menuText}
                  onClick={() => {
                    setShowProfile(true);
                  }}
                >
                  Profile
                </label>
              </div>

              <div
                className={styles.menuItem}
                onClick={() => {
                  dispatch(logout());
                }}
              >
                <BiLogOut className={styles.menuIcon} />
                <label className={styles.menuText}>Logout</label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
