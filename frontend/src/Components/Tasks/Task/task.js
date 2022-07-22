import styles from "./task.module.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  taskReset,
  deleteTask,
  getTasks,
} from "../../../StateManagement/Reducers/tasksReducer";

import swal from "sweetalert";
import Modal from "../../Modal/modal";
import { showModal } from "../../../StateManagement/Reducers/modalReducer";
import { MdDelete } from "react-icons/md";
import AddTask from "../AddTask/addTask";
import moment from "moment";

function Task(props) {
  const dispatch = useDispatch();

  const { currentTask } = useSelector((state) => state.tasks);
  const deleteTaskState = useSelector((state) => state.tasks.deleteTask);

  const modalState = useSelector((state) => state.modal);

  useEffect(() => {
    const { loading, error, status, tried } = deleteTaskState;

    if (tried) {
      if (status) {
        dispatch(getTasks(props.taskData));
        swal({
          title: "Task has been deleted",
          icon: "success",
        });
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
  }, [deleteTaskState]);

  useEffect(() => {
    return () => {
      dispatch(taskReset("getTasks"));
      dispatch(taskReset("deleteTask"));
    };
  }, []);

  function handleTask() {
    swal({
      icon: "warning",
      title: "Confirm",
      text: `Are you sure you want to delete this Task?`,
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        dispatch(deleteTask(currentTask.taskId));
      }
    });
  }

  if (currentTask) {
    return (
      <div className={styles.main}>
        {modalState.showModal && modalState.action == "editTask" && (
          <Modal heading={"Edit Task"}>
            <AddTask
              project={props.currentProject}
              taskData={props.taskData}
              task={currentTask}
            />
          </Modal>
        )}

        <div className={styles.header}>
          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Name:</label>
            <label className={styles.headerValue}>{currentTask.name}</label>
          </div>

          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Deadline:</label>
            <label className={styles.headerValue}>
              {moment(currentTask.deadline).format("DD-MM-YYYY")}
            </label>
          </div>

          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Assignee:</label>
            <label className={styles.headerValue}>
              {currentTask.asigneeName}
            </label>
          </div>

          <div className={styles.headerDiv}>
            <button className={styles.delete} onClick={handleTask}>
              Delete Task
            </button>
          </div>
        </div>

        <div className={styles.dataDiv}>
          <textarea disabled value={currentTask.description}></textarea>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => {
              dispatch(showModal({ showModal: true, action: "editTask" }));
            }}
          >
            Edit Task
          </button>

          <button
            onClick={() => {
              //dispatch(showModal({ showModal: true, action: "editTask" }));
            }}
          >
            Request Extension
          </button>
        </div>
      </div>
    );
  }
}

export default Task;
