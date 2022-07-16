import { useEffect, useState } from "react";
import styles from "./addClass.module.scss";

import {
  createClass,
  getClasses,
  classReset,
} from "../../../StateManagement/Reducers/classReducer";
import { useDispatch, useSelector } from "react-redux";
import { RiAddFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function AddClass(props) {
  const dispatch = useDispatch();

  const createState = useSelector((state) => state.classes.createClass);
  const { currentClass } = useSelector((state) => state.classes);

  const [classData, setclassData] = useState({
    name: "",
    description: "",
    parent: "",
    project: props.project,
  });

  const [attributesData, setAttributesData] = useState([]);

  useEffect(() => {
    const { loading, error, status, tried } = createState;

    if (tried) {
      if (status) {
        dispatch(getClasses(props.classData));
        swal({
          title: "Class has been created",
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
    return () => {
      dispatch(getClasses(props.tablesData));
      dispatch(classReset("createClass"));
    };
  }, []);

  function addAttribute() {
    setAttributesData((prev) => [...prev, { name: "", dataType: "" }]);
  }

  function handleClassChange(e) {
    setclassData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const changeAttribute = (e, id) => {
    const newData = [...attributesData];
    let attribute = { ...newData[id], [e.target.name]: e.target.value };
    newData.splice(id, 1, attribute);
    setAttributesData(newData);
  };

  function deleteAttribute(id) {
    const newData = [...attributesData];
    newData.splice(id, 1);
    setAttributesData(newData);
  }

  function submit(e) {
    e.preventDefault();
    dispatch(
      createClass({
        classData: classData,
        attributes: attributesData,
      })
    );
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.classData}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Table Name</label>
            <input
              className={styles.input}
              name="name"
              onChange={handleClassChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Parent</label>
            <select
              className={styles.select}
              name="parent"
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
              onChange={handleClassChange}
            />
          </div>
        </div>

        <div className={styles.selectionData}>
          <div className={styles.colSelect}>
            <div className={styles.header}>
              <h4>Attributes</h4>
              <RiAddFill
                className={styles.addIcon}
                size={28}
                onClick={addAttribute}
              />
            </div>

            <div className={styles.header}>
              <h5>Name</h5>
              <h5>Data type</h5>
              <h5 className={styles.h5Delete}>Delete</h5>
            </div>

            {attributesData.map((attribute, id) => {
              return (
                <div key={id} className={styles.header}>
                  <input
                    className={styles.dataInput}
                    name="name"
                    value={attribute.name}
                    placeholder="Name"
                    onChange={(e) => changeAttribute(e, id)}
                  />

                  <input
                    className={styles.dataInput}
                    name="dataType"
                    value={attribute.datatype}
                    placeholder="Data type"
                    onChange={(e) => changeAttribute(e, id)}
                  />

                  <div className={styles.delete}>
                    <MdDelete
                      className={styles.deleteIcon}
                      size={21}
                      onClick={() => {
                        deleteAttribute(id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddClass;
