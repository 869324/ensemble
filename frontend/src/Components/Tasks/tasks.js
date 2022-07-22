import styles from "./tasks.module.scss";

import { RiAddFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";

import {
  getTasks,
  taskReset,
  selectTask,
} from "../../StateManagement/Reducers/tasksReducer";
import { debounce } from "lodash";
import Modal from "../../Components/Modal/modal";
import Task from "./Task/task";

import {
  showModal,
  resetModal,
} from "../../StateManagement/Reducers/modalReducer";
import AddTask from "./AddTask/addTask";
import { getMembers } from "../../StateManagement/Reducers/teamsReducer";

function Tasks() {
  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const { currentProject } = useSelector((state) => state.projects);
  const { currentTask } = useSelector((state) => state.tasks);
  const getTasksState = useSelector((state) => state.tasks.getTasks);
  const { members } = useSelector((state) => state.teams.getMembers);

  const [taskData, setTaskData] = useState({
    project: currentProject.projectId,
    name: null,
    taskId: null,
    page: 1,
    size: 10,
    order: "NAME_ASC",
  });

  useEffect(() => {
    dispatch(getMembers(currentProject.team));
  }, []);

  useEffect(() => {
    const { tasks } = getTasksState;

    if (tasks.length > 0) {
      if (Object.keys(currentTask).length == 0) {
        dispatch(selectTask(tasks[0]));
      } else {
        const index = tasks.findIndex(
          (task) => task.taskId == currentTask.taskId
        );
        if (index == -1) {
          dispatch(selectTask(tasks[0]));
        }
      }
    }
  }, [getTasksState.tasks]);

  useEffect(() => {
    dispatch(getTasks(taskData));
  }, [taskData]);

  useEffect(() => {
    return () => {
      dispatch(resetModal());
      dispatch(taskReset("getTasks"));
    };
  }, []);

  function handleChange(e) {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  return (
    <div className={styles.panelView}>
      {modalState.showModal && modalState.action == "addTask" && (
        <Modal heading="Add Task">
          <AddTask
            project={currentProject}
            taskData={taskData}
            members={members}
            task={{}}
          />
        </Modal>
      )}
      <h2 className={styles.h2}>Tasks</h2>

      <div className={styles.body}>
        <div className={styles.data}>
          <div className={styles.actions}>
            <input
              className={styles.search}
              name="name"
              placeholder="Search..."
              onChange={debouncedSearch}
            />

            <RiAddFill
              className={styles.addIcon}
              size={28}
              onClick={() => {
                dispatch(showModal({ action: "addTask", showModal: true }));
              }}
            />
          </div>

          <div className={styles.rows}>
            {getTasksState.tasks.map((task, id) => {
              return (
                <div>
                  <div
                    key={id}
                    className={
                      currentTask.taskId == task.taskId
                        ? styles.tableDivActive
                        : styles.tableDiv
                    }
                    onClick={() => {
                      dispatch(selectTask(task));
                    }}
                  >
                    {task.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.content}>
          <Task currentProject={currentProject} taskData={taskData} />
        </div>
      </div>
    </div>
  );
}

export default Tasks;
