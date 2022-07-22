import styles from "./addTask.module.scss";

import moment from "moment";
import { useEffect, useState } from "react";

import {
  createTask,
  getTasks,
  taskReset,
  updateTask,
  selectTask,
} from "../../../StateManagement/Reducers/tasksReducer";

import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function AddTask(props) {
  const dispatch = useDispatch();

  const createState = useSelector((state) => state.tasks.createTask);
  const updateState = useSelector((state) => state.tasks.updateTask);
  const { action } = useSelector((state) => state.modal);
  const { members } = useSelector((state) => state.teams.getMembers);

  const [taskData, setTaskData] = useState({
    ...props.task,
    deadline: moment(props.deadline).format("YYYY-MM-DD"),
    asignee: members[0].userId,
    project: props.project.projectId,
  });

  useEffect(() => {
    const { loading, error, status, tried } = createState;

    if (tried) {
      if (status) {
        swal({
          title: "Task has been created",
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
  }, [createState]);

  useEffect(() => {
    const { loading, error, status, tried } = updateState;

    if (tried) {
      if (status) {
        dispatch(selectTask(taskData));
        swal({
          title: "Task has been updated",
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
  }, [updateState]);

  useEffect(() => {
    return () => {
      dispatch(getTasks(props.taskData));
      dispatch(taskReset("createTask"));
      dispatch(taskReset("updateTask"));
    };
  }, []);

  function handleTaskChange(e) {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    console.log(taskData);
    if (action == "addTask") {
      dispatch(createTask(taskData));
    } else if (action == "editTask") {
      dispatch(updateTask(taskData));
    }
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.classData1}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              name="name"
              value={taskData.name}
              onChange={handleTaskChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Deadline</label>
            <input
              type="date"
              className={styles.input}
              name="deadline"
              value={taskData.deadline}
              onChange={handleTaskChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Assignee</label>
            <select
              className={styles.select}
              name="asignee"
              value={taskData.asignee}
              onChange={handleTaskChange}
            >
              {members.map((member) => {
                return (
                  <option
                    value={member.userId}
                  >{`${member.firstname} ${member.lastname}`}</option>
                );
              })}
            </select>
          </div>
        </div>

        <div className={styles.classData2}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.input}
              name="description"
              placeholder="Type here ..."
              value={taskData.description}
              onChange={handleTaskChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          {action == "addTask" ? "Submit" : "Save"}
        </button>
      </form>
    </div>
  );
}

AddTask.defaultProps = {
  task: {
    taskId: "",
    name: "",
    description: "",
    asignee: "",
    deadline: "",
    project: "",
  },
  project: "",
  taskData: {},
};

export default AddTask;
