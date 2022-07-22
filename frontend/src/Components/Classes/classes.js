import styles from "./classes.module.scss";

import { RiAddFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";

import {
  getClasses,
  classReset,
  selectClass,
} from "../../StateManagement/Reducers/classReducer";
import { debounce } from "lodash";
import Modal from "../Modal/modal";

import {
  showModal,
  resetModal,
} from "../../StateManagement/Reducers/modalReducer";
import AddClass from "./AddClass/addClass";
import Class from "./Class/class";

function Classes() {
  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const { currentProject } = useSelector((state) => state.projects);
  const getClassState = useSelector((state) => state.classes.getClasses);
  const { currentClass } = useSelector((state) => state.classes);

  const [classData, setClassData] = useState({
    project: currentProject.projectId,
    name: null,
    classId: null,
    page: 1,
    size: 10,
    order: "NAME_ASC",
  });

  useEffect(() => {
    dispatch(getClasses(classData));
  }, [classData]);

  useEffect(() => {
    const { classes } = getClassState;

    if (classes.length > 0) {
      if (Object.keys(currentClass).length == 0) {
        dispatch(selectClass(classes[0]));
      } else {
        const index = classes.findIndex(
          (myClass) => myClass.classId == currentClass.classId
        );
        if (index == -1) {
          dispatch(selectClass(classes[0]));
        }
      }
    }
  }, [getClassState]);

  useEffect(() => {
    return () => {
      dispatch(resetModal());
      dispatch(classReset("getClasses"));
    };
  }, []);

  function handleChange(e) {
    setClassData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  return (
    <div className={styles.panelView}>
      {modalState.showModal && modalState.action == "addClass" && (
        <Modal heading={"Add Class"}>
          <AddClass
            project={currentProject}
            classData={classData}
            classes={getClassState.classes}
          />
        </Modal>
      )}
      <h2 className={styles.h2}>Classes</h2>

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
                dispatch(showModal({ showModal: true, action: "addClass" }));
              }}
            />
          </div>

          <div className={styles.rows}>
            {getClassState.classes.map((myClass, id) => {
              return (
                <div
                  key={id}
                  className={
                    currentClass.classId == myClass.classId
                      ? styles.tableDivActive
                      : styles.tableDiv
                  }
                  onClick={() => {
                    dispatch(selectClass(myClass));
                  }}
                >
                  {myClass.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.content}>
          <Class
            project={currentProject}
            classData={classData}
            classes={getClassState.classes}
          />
        </div>
      </div>
    </div>
  );
}

export default Classes;
