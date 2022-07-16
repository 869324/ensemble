import { useEffect, useState } from "react";
import styles from "./addAttribute.module.scss";

import {
  addAttribute,
  getAttributes,
  classReset,
} from "../../../StateManagement/Reducers/classReducer";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function AddAttribute(props) {
  const dispatch = useDispatch();

  const addState = useSelector((state) => state.classes.addAttribute);

  const [attributeData, setAttributeData] = useState({
    name: "",
    dataType: "",
    owner: props.classId,
  });

  useEffect(() => {
    const { loading, error, status, tried } = addState;

    if (tried) {
      if (status) {
        //dispatch(getTables(props.tablesData));
        swal({
          title: "Attribute has been created",
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
  }, [addState]);

  useEffect(() => {
    return () => {
      dispatch(getAttributes(props.classId));
      dispatch(classReset("addAttribute"));
    };
  }, []);

  function changeAttribute(e) {
    setAttributeData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    dispatch(addAttribute(attributeData));
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.selectionData}>
          <div className={styles.colSelect}>
            <div className={styles.header}>
              <h5>Name</h5>
              <h5>Data type</h5>
            </div>

            <div className={styles.header}>
              <input
                className={styles.dataInput}
                name="name"
                placeholder="Name"
                onChange={changeAttribute}
              />

              <input
                className={styles.dataInput}
                name="dataType"
                placeholder="Data type"
                onChange={changeAttribute}
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Add
        </button>
      </form>
    </div>
  );
}

export default AddAttribute;
