import styles from "./endpoints.module.scss";

import { RiAddFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  getEndpoints,
  endpointReset,
  deleteEndpoint,
  updateEndpoint,
} from "../../StateManagement/Reducers/endpointReducer";
import { debounce } from "lodash";
import Modal from "../../Components/Modal/modal";

import {
  showModal,
  resetModal,
} from "../../StateManagement/Reducers/modalReducer";
import AddEndpoint from "./AddEndpoint/addEndpoint";
import swal from "sweetalert";

function Endpoints() {
  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const { currentProject } = useSelector((state) => state.projects);
  const getEndpointState = useSelector((state) => state.endpoints.getEndpoints);
  const deleteEndpointState = useSelector(
    (state) => state.endpoints.deleteEndpoint
  );
  const [currentEndpoint, setCurrentEndpoint] = useState({});

  const [endpointData, setEndpointData] = useState({
    project: currentProject.projectId,
    name: null,
    endpointId: null,
    page: 1,
    size: 10,
    order: "NAME_ASC",
  });

  useEffect(() => {
    const { loading, error, status, tried } = deleteEndpointState;

    if (tried) {
      if (status) {
        dispatch(getEndpoints(endpointData));
        swal({
          title: "Endpoint has been deleted",
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
  }, [deleteEndpointState]);

  useEffect(() => {
    dispatch(getEndpoints(endpointData));
  }, [endpointData]);

  useEffect(() => {
    return () => {
      dispatch(resetModal());
      dispatch(endpointReset("getEndpoints"));
      dispatch(endpointReset("deleteEndpoint"));
    };
  }, []);

  function handleChange(e) {
    setEndpointData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleEndpoint(action, data) {
    switch (action) {
      case "delete":
        swal({
          icon: "warning",
          title: "Confirm",
          text: `Are you sure you want to delete this endpoint?`,
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((isConfirm) => {
          if (isConfirm) {
            dispatch(deleteEndpoint(data));
          }
        });
        break;
      case "update":
        setCurrentEndpoint(data);
        dispatch(showModal({ showModal: true, action: "editEndpoint" }));
        break;
      case "add":
        setCurrentEndpoint({});
        dispatch(showModal({ showModal: true, action: "addEndpoint" }));
        break;
      default:
        break;
    }
  }

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  return (
    <div className={styles.panelView}>
      {modalState.showModal &&
        (modalState.action == "addEndpoint" ||
          modalState.action == "editEndpoint") && (
          <Modal
            heading={
              modalState.action == "addEndpoint"
                ? "Add Endpoint"
                : "Edit Endpoint"
            }
          >
            <AddEndpoint
              project={currentProject}
              endpointData={endpointData}
              action={modalState.action}
              endpoint={currentEndpoint}
            />
          </Modal>
        )}
      <h2 className={styles.h2}>Endpoints</h2>

      <div className={styles.body}>
        <div className={styles.actions}>
          <input
            className={styles.search}
            name="name"
            placeholder="Search..."
            onChange={debouncedSearch}
          />

          <button
            className={styles.add}
            onClick={() => {
              handleEndpoint("add", "");
            }}
          >
            Add Endpoint
          </button>
        </div>

        <div className={styles.data}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Url</th>
                <th className={styles.hDelete}>Edit</th>
                <th className={styles.hDelete}>Delete</th>
              </tr>
            </thead>

            <tbody>
              {getEndpointState.endpoints.map((endpoint, id) => {
                return (
                  <tr key={id} className={styles.rowData}>
                    <td>{id + 1}</td>
                    <td>{endpoint.name}</td>
                    <td>{endpoint.description}</td>
                    <td>{endpoint.url}</td>
                    <td className={styles.updateCol}>
                      <FaRegEdit
                        className={styles.updateIcon}
                        size={21}
                        onClick={() => {
                          handleEndpoint("update", endpoint);
                        }}
                      />
                    </td>

                    <td className={styles.deleteCol}>
                      <MdDelete
                        className={styles.deleteIcon}
                        size={21}
                        onClick={() => {
                          handleEndpoint("delete", endpoint.endpointId);
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
    </div>
  );
}

export default Endpoints;
