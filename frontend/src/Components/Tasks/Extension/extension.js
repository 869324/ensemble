import styles from "./extension.module.scss";

import moment from "moment";
import { useEffect, useState } from "react";

import {
  askExtension,
  getExtensions,
  taskReset,
} from "../../../StateManagement/Reducers/tasksReducer";

import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function Extension(props) {
  const dispatch = useDispatch();

  const askState = useSelector((state) => state.tasks.askExtension);
  const { action } = useSelector((state) => state.modal);

  const [extData, setExtData] = useState({
    task: props.task.taskId,
    deadline: moment(props.task.deadline).format("YYYY-MM-DD"),
  });

  useEffect(() => {
    const { loading, error, status, tried } = askState;

    if (tried) {
      if (status) {
        swal({
          title: "Request has been sen",
          icon: "success",
        });
        dispatch(resetModal());
      } else if (loading) {
        swal({
          text: "Loading ...",
        });
      } else if (error !== "") {
        swal({
          title: "Operation failed",
          icon: "error",
          text: error ? error : "Try again later",
        });
      }
    }
  }, [askState]);

  useEffect(() => {
    return () => {
      dispatch(getExtensions(props.task.taskId));
      dispatch(taskReset("askExtension"));
    };
  }, []);

  function handleTaskChange(e) {
    setExtData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();

    dispatch(askExtension(extData));
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.classData}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Deadline</label>
            <input
              type="date"
              className={styles.input}
              name="deadline"
              value={extData.deadline}
              onChange={handleTaskChange}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Send Request
        </button>
      </form>
    </div>
  );
}

export default Extension;
