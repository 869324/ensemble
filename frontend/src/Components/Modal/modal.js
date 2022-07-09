import styles from "./modal.module.scss";

import { VscChromeClose } from "react-icons/vsc";
import { resetModal } from "../../StateManagement/Reducers/modalReducer";
import { useDispatch } from "react-redux";

function Modal(props) {
  const dispatch = useDispatch();

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <div className={styles.header}>
          <label></label>
          <h3 className={styles.h3}>{props.heading ? props.heading : ""}</h3>
          <VscChromeClose
            className={styles.close}
            size={28}
            onClick={() => {
              dispatch(resetModal());
            }}
          />
        </div>

        <div className={styles.content}>{props.children}</div>
      </div>
    </div>
  );
}

export default Modal;
