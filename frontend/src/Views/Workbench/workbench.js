import styles from "./workbench.module.scss";

import Header from "../../Components/Header/header";
import UserDashboard from "../../Components/UserDashboard/userDashboard";

function Workbench() {
  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}
    >
      <div className={styles.overlay}>
        <Header />

        <div className={styles.body}>
          <UserDashboard />

          <div className={styles.panel}>
            <h2 id="label">In what team are we working in today?</h2>

            <div className="teamsContainer"></div>

            <button>Create Team</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Workbench;
