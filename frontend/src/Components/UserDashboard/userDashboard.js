import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { GrView } from "react-icons/gr";
import { BiTable } from "react-icons/bi";
import { MdTableChart, MdOutlineKeyboardBackspace } from "react-icons/md";
import { HiOutlineLink } from "react-icons/hi";
import { CgNotes } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import { RiArtboardFill } from "react-icons/ri";
import { AiOutlineFolderView } from "react-icons/ai";

import styles from "./userDashboard.module.scss";

function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <div
        className={styles.back}
        onClick={() => {
          navigate("/user/home");
        }}
      >
        <MdOutlineKeyboardBackspace className={styles.backIcon} size={35} />
        <label>Home</label>
      </div>

      <NavLink
        to="projectOverview"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <AiOutlineFolderView className={styles.tabIcon} size={21} />
        Project Overview
      </NavLink>

      <NavLink
        to="database"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <BiTable className={styles.tabIcon} size={21} />
        Database
      </NavLink>

      <NavLink
        to="classes"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <MdTableChart className={styles.tabIcon} size={21} />
        Classes
      </NavLink>

      <NavLink
        to="endpoints"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <HiOutlineLink className={styles.tabIcon} size={21} />
        Endpoints
      </NavLink>

      <NavLink
        to="notes"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <CgNotes className={styles.tabIcon} size={21} />
        Notes
      </NavLink>

      <NavLink
        to="tasks"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <FaTasks className={styles.tabIcon} size={21} />
        Tasks
      </NavLink>

      <NavLink
        to="meetings"
        className={(navData) =>
          navData.isActive ? styles.active : styles.link
        }
      >
        <RiArtboardFill className={styles.tabIcon} size={21} />
        Meetings
      </NavLink>
    </div>
  );
}

export default UserDashboard;
