import styles from "./task.module.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  taskReset,
  deleteTask,
  getTasks,
  getExtensions,
  selectTask,
  deleteExtension,
  approveExtension,
  denyExtension,
} from "../../../StateManagement/Reducers/tasksReducer";

import swal from "sweetalert";
import Modal from "../../Modal/modal";
import { MdDelete } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import { showModal } from "../../../StateManagement/Reducers/modalReducer";
import AddTask from "../AddTask/addTask";
import moment from "moment";
import Extension from "../Extension/extension";

function Task(props) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { currentTask } = useSelector((state) => state.tasks);
  const deleteTaskState = useSelector((state) => state.tasks.deleteTask);
  const { extensions } = useSelector((state) => state.tasks.getExtensions);
  const deleteExtState = useSelector((state) => state.tasks.deleteExtension);
  const approveState = useSelector((state) => state.tasks.approveExtension);
  const denyState = useSelector((state) => state.tasks.denyExtension);

  const modalState = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(selectTask({ extensions }));
  }, [extensions]);

  useEffect(() => {
    dispatch(getExtensions(currentTask.taskId));
  }, [currentTask.taskId]);

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
    const { loading, error, status, tried } = deleteExtState;

    if (tried) {
      if (status) {
        dispatch(getExtensions(currentTask.taskId));
        swal({
          title: "Request has been deleted",
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
  }, [deleteExtState]);

  useEffect(() => {
    const { loading, error, status, tried } = denyState;

    if (tried) {
      if (status) {
        dispatch(getExtensions(currentTask.taskId));
      }
    }
  }, [denyState]);

  useEffect(() => {
    const { loading, error, status, tried } = approveState;

    if (tried) {
      if (status && currentTask.extensions.length) {
        dispatch(selectTask({ deadline: currentTask.extensions[0].time }));
        dispatch(getTasks(props.taskData));
        dispatch(getExtensions(currentTask.taskId));
      }
    }
  }, [approveState]);

  useEffect(() => {
    return () => {
      dispatch(taskReset("getTasks"));
      dispatch(taskReset("deleteTask"));
      dispatch(taskReset("getExtensions"));
      dispatch(taskReset("askExtension"));
      dispatch(taskReset("approveExtension"));
      dispatch(taskReset("denyExtension"));
      dispatch(taskReset("deleteExtension"));
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

  function handleRequest(e, action) {
    switch (action) {
      case "delete":
        swal({
          icon: "warning",
          title: "Confirm",
          text: `Are you sure you want to delete this request?`,
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((isConfirm) => {
          if (isConfirm) {
            dispatch(deleteExtension(currentTask.extensions[0].extensionId));
          }
        });
        break;

      case "approve":
        dispatch(
          approveExtension({
            ...currentTask.extensions[0],
            time: moment(currentTask.extensions[0].time).format("YYYY-MM-DD"),
          })
        );
        break;

      case "deny":
        dispatch(denyExtension(currentTask.extensions[0]));
        break;

      default:
        break;
    }
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

        {modalState.showModal && modalState.action == "askExtension" && (
          <Modal heading={"Request Deadline Extension"}>
            <Extension task={currentTask} />
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

          {currentTask.extensions.length == 0 && (
            <button
              onClick={() => {
                dispatch(
                  showModal({ showModal: true, action: "askExtension" })
                );
              }}
            >
              Request Extension
            </button>
          )}

          {currentTask.extensions.length > 0 && user.userType == 3 && (
            <div className={styles.extension}>
              <label>{`You your request for deadline extension to ${moment(
                currentTask.extensions[0].time
              ).format("DD-MM-YYYY")} is pending`}</label>
              <MdDelete
                className={styles.deleteIcon}
                size={21}
                onClick={(e) => handleRequest(e, "delete")}
              />
            </div>
          )}

          {currentTask.extensions.length > 0 && user.userType < 3 && (
            <div className={styles.extension}>
              <label>{`${
                currentTask.asigneeName
              } has requested deadline extension to ${moment(
                currentTask.extensions[0].time
              ).format("DD-MM-YYYY")}`}</label>
              <BsCheckCircleFill
                className={styles.approveIcon}
                size={21}
                onClick={(e) => handleRequest(e, "approve")}
              />

              <VscChromeClose
                className={styles.deleteIcon}
                size={21}
                onClick={(e) => handleRequest(e, "deny")}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Task;
