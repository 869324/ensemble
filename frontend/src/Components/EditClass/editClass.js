import { useEffect, useState } from "react";
import styles from "./editClass.module.scss";

import {
  updateClass,
  classReset,
  getClasses,
  selectClass,
} from "../../StateManagement/Reducers/classReducer";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../StateManagement/Reducers/modalReducer";

function EditClass(props) {
  const dispatch = useDispatch();

  const updateState = useSelector((state) => state.classes.updateClass);

  const [classData, setClassData] = useState({
    classId: props.classId,
    name: props.name,
    description: props.description,
    parent: props.parent ? props.parent : null,
  });

  useEffect(() => {
    const { loading, error, status, tried } = updateState;

    if (tried) {
      if (status) {
        dispatch(
          selectClass({
            name: classData.name,
            description: classData.description,
            parent: classData.parent,
          })
        );
        swal({
          title: "Class has been updated",
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
      dispatch(getClasses(props.classData));
      dispatch(classReset("updateClass"));
    };
  }, []);

  function handleClassChange(e) {
    setClassData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    dispatch(updateClass(classData));
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.tableData}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Class Name</label>
            <input
              className={styles.input}
              name="name"
              value={classData.name}
              onChange={handleClassChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Parent</label>
            <select
              className={styles.select}
              name="parent"
              value={classData.parent}
              onChange={handleClassChange}
            >
              <option value="">None</option>
              {props.classes.map((myClass) => {
                return <option value={myClass.classId}>{myClass.name}</option>;
              })}
            </select>
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.input}
              name="description"
              value={classData.description}
              onChange={handleClassChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>
    </div>
  );
}

export default EditClass;
