import styles from "./home.module.scss";

import Header from "../../Components/Header/header";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import TeamChooser from "../../Components/TeamChooser/teamChooser";
import ProjectChooser from "../../Components/ProjectChooser/projectChooser";

function Home(props) {
  const [tab, setTab] = useState("projects");

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}
    >
      <div className={styles.overlay}>
        <Header />

        <div className={styles.body}>
          <div className={styles.chooser}>
            <div className={styles.tab}>
              <button
                className={
                  tab == "projects" ? styles.tabButtonActive : styles.tabButton
                }
                onClick={() => setTab("projects")}
              >
                Projects
              </button>
              <button
                className={
                  tab == "teams" ? styles.tabButtonActive : styles.tabButton
                }
                onClick={() => setTab("teams")}
              >
                Teams
              </button>
            </div>
            {tab == "projects" && <ProjectChooser />}
            {tab == "teams" && <TeamChooser />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
