import styles from "./projectOverview.module.scss";
import { showModal } from "../../StateManagement/Reducers/modalReducer";
import Modal from "../Modal/modal";
import { useSelector } from "react-redux";

function ProjectOverview() {
  const modalState = useSelector((state) => state.modal);
  return (
    <div className={styles.panelView}>
      {modalState.showModal && modalState.action == "editProject" && (
        <Modal heading={"Edit Project"}></Modal>
      )}

      <h2>Project Overview</h2>

      <div className={styles.header}>
        <div className={styles.headerDiv}>
          <label className={styles.headerDesc}>Name:</label>
          <label className={styles.headerValue}></label>
        </div>

        <div className={styles.headerDiv}>
          <label className={styles.headerDesc}>Team:</label>
          <label className={styles.headerValue}></label>
        </div>

        <div className={styles.headerDiv}>
          <label className={styles.headerDesc}>Budget:</label>
          <label className={styles.headerValue}></label>
        </div>

        <div className={styles.headerDiv}>
          <label className={styles.headerDesc}>Progress:</label>
          <label className={styles.headerValue}></label>
        </div>

        <div className={styles.headerDiv}>
          <button className={styles.delete}>Delete Note</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;
