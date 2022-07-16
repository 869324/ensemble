import styles from "./class.module.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAttributes,
  classReset,
  deleteAttribute,
  deleteClass,
  populateClass,
  getClasses,
  removeChild,
  getChildren,
} from "../../../StateManagement/Reducers/classReducer";

import swal from "sweetalert";
import Modal from "../../Modal/modal";
import { showModal } from "../../../StateManagement/Reducers/modalReducer";
import { MdDelete } from "react-icons/md";
import AddAttribute from "../AddAttribute/addAttribute";
import EditClass from "../EditClass/editClass";

function Class(props) {
  const dispatch = useDispatch();

  const { currentClass } = useSelector((state) => state.classes);
  const attributeState = useSelector((state) => state.classes.getAttributes);
  const childrenState = useSelector((state) => state.classes.getChildren);
  const deleteClassState = useSelector((state) => state.classes.deleteClass);
  const removeChildState = useSelector((state) => state.classes.removeChild);
  const deleteAttributeState = useSelector(
    (state) => state.classes.deleteAttribute
  );

  const modalState = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(getAttributes(currentClass.classId));
    dispatch(getChildren(currentClass.classId));
  }, [currentClass.classId]);

  useEffect(() => {
    const { tried, status, loading, attributes } = attributeState;
    if (tried && status) {
      dispatch(
        populateClass({
          attributes: attributes,
        })
      );
    } else if (tried && !status && !loading) {
      swal({
        icon: "error",
        title: "Problem loading class attributes",
        text: "Try again later",
      });
    }
  }, [attributeState]);

  useEffect(() => {
    const { tried, status, loading, children } = childrenState;
    if (tried && status) {
      dispatch(
        populateClass({
          children: children,
        })
      );
    } else if (tried && !status && !loading) {
      swal({
        icon: "error",
        title: "Problem loading class children",
        text: "Try again later",
      });
    }
  }, [childrenState]);

  useEffect(() => {
    const { loading, error, status, tried } = deleteClassState;

    if (tried) {
      if (status) {
        dispatch(getClasses(props.classData));
        swal({
          title: "Class has been deleted",
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
  }, [deleteClassState]);

  useEffect(() => {
    const { loading, error, status, tried } = deleteAttributeState;

    if (tried) {
      if (status) {
        dispatch(getAttributes(currentClass.classId));
        swal({
          title: "Attribute has been deleted",
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
  }, [deleteAttributeState]);

  useEffect(() => {
    const { loading, error, status, tried } = removeChildState;

    if (tried) {
      if (status) {
        dispatch(getChildren(currentClass.classId));
        swal({
          title: "Child has been removed",
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
  }, [removeChildState]);

  useEffect(() => {
    return () => {
      dispatch(classReset("getAttributes"));
      dispatch(classReset("deleteAttribute"));
      dispatch(classReset("deleteClass"));
    };
  }, []);

  function handleAttribute(action, data) {
    switch (action) {
      case "delete":
        swal({
          icon: "warning",
          title: "Confirm",
          text: `Are you sure you want to delete this attribute?`,
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((isConfirm) => {
          if (isConfirm) {
            dispatch(deleteAttribute(data));
          }
        });

        break;
      default:
        break;
    }
  }

  function handleChild(action, data) {
    switch (action) {
      case "delete":
        swal({
          icon: "warning",
          title: "Confirm",
          text: `Are you sure you want to remove this class from children?`,
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((isConfirm) => {
          if (isConfirm) {
            dispatch(removeChild(data));
          }
        });

        break;
      default:
        break;
    }
  }

  function handleClass() {
    swal({
      icon: "warning",
      title: "Confirm",
      text: `Are you sure you want to delete this class?`,
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        dispatch(deleteClass(currentClass.classId));
      }
    });
  }

  function getParentName(id) {
    const myClass = props.classes.find((parent) => parent.classId == id);
    return myClass ? myClass.name : null;
  }

  if (currentClass) {
    return (
      <div className={styles.main}>
        {modalState.showModal && modalState.action == "editClass" && (
          <Modal heading={"Edit Class"}>
            <EditClass
              name={currentClass.name}
              project={props.currentProject}
              description={currentClass.description}
              classId={currentClass.classId}
              classes={props.classes}
              parent={currentClass.parent}
            />
          </Modal>
        )}
        {modalState.showModal && modalState.action == "addAttribute" && (
          <Modal heading={"Add Attribute"}>
            <AddAttribute classId={currentClass.classId} />
          </Modal>
        )}

        <div className={styles.header}>
          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Name:</label>
            <label className={styles.headerValue}>{currentClass.name}</label>
          </div>

          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Description:</label>
            <label className={styles.headerValue}>
              {currentClass.description}
            </label>
          </div>
          {currentClass.parent &&
            currentClass.parent != "" &&
            getParentName(currentClass.parent) && (
              <div className={styles.headerDiv}>
                <label className={styles.headerDesc}>Parent:</label>
                <label className={styles.headerValue}>
                  {getParentName(currentClass.parent)}
                </label>
              </div>
            )}
          <div className={styles.headerDiv}>
            <button className={styles.delete} onClick={handleClass}>
              Delete Class
            </button>
          </div>
        </div>

        <div className={styles.tablesDiv}>
          <div className={styles.columns}>
            <h4>Attributes</h4>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Data type</th>
                  <th className={styles.hDelete}>Delete</th>
                </tr>
              </thead>

              <tbody>
                {currentClass.attributes.map((attribute, id) => {
                  return (
                    <tr key={id} className={styles.rowData}>
                      <td>{id + 1}</td>
                      <td>{attribute.name}</td>
                      <td>{attribute.datatype}</td>
                      <td className={styles.deleteCol}>
                        <MdDelete
                          className={styles.deleteIcon}
                          size={21}
                          onClick={() => {
                            handleAttribute("delete", attribute.attributeId);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.relationships}>
            <h4>Children</h4>

            <table className={styles.table}>
              <thead>
                <th>No.</th>
                <th>Class</th>
                <th className={styles.hDelete}>Delete</th>
              </thead>

              <tbody>
                {currentClass.children.map((child, id) => {
                  return (
                    <tr key={id} className={styles.rowData}>
                      <td>{id + 1}</td>
                      <td>{child.name}</td>
                      <td className={styles.deleteCol}>
                        <MdDelete
                          className={styles.deleteIcon}
                          size={21}
                          onClick={() => {
                            handleChild("delete", child.classId);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => {
              dispatch(showModal({ showModal: true, action: "editClass" }));
            }}
          >
            Edit Class
          </button>
          <button
            onClick={() => {
              dispatch(showModal({ showModal: true, action: "addAttribute" }));
            }}
          >
            Add Attribute
          </button>
        </div>
      </div>
    );
  }
}

export default Class;
