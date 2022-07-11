import { useEffect, useState } from "react";
import styles from "./addEndPoint.module.scss";

import {
  createEndpoint,
  getEndpoints,
  updateEndpoint,
  endpointReset,
} from "../../StateManagement/Reducers/endpointReducer";

import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../StateManagement/Reducers/modalReducer";

function AddEndpoint(props) {
  const dispatch = useDispatch();

  const createState = useSelector((state) => state.endpoints.createEndpoint);
  const editEndpointState = useSelector(
    (state) => state.endpoints.updateEndpoint
  );

  const [endpointData, setEndpointData] = useState({
    endpointId: props.endpoint.endpointId,
    name: props.endpoint.name,
    description: props.endpoint.name,
    url: props.endpoint.url,
    project: props.project,
  });

  useEffect(() => {
    const { loading, error, status, tried } = createState;

    if (tried) {
      if (status) {
        dispatch(getEndpoints(props.endpointData));
        swal({
          title: "Endpoint has been created",
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
    const { loading, error, status, tried } = editEndpointState;

    if (tried) {
      if (status) {
        dispatch(getEndpoints(props.endpointData));
        swal({
          title: "Endpoint has been updated",
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
  }, [editEndpointState]);

  useEffect(() => {
    return () => {
      dispatch(endpointReset("createEndpoint"));
      dispatch(endpointReset("updateEndpoint"));
    };
  }, []);

  function handleEndpointChange(e) {
    setEndpointData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    if (props.action == "addEndpoint") {
      dispatch(createEndpoint(endpointData));
    } else if (props.action == "editEndpoint") {
      dispatch(updateEndpoint(endpointData));
    }
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.classData}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              name="name"
              value={endpointData.name}
              onChange={handleEndpointChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>URL</label>
            <input
              className={styles.input}
              name="url"
              value={endpointData.url}
              onChange={handleEndpointChange}
              required
            />
          </div>
        </div>

        <div className={styles.description}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.input}
            name="description"
            value={endpointData.description}
            onChange={handleEndpointChange}
          />
        </div>

        <button type="submit" className={styles.submit}>
          {props.action == "addEndpoint" ? "Submit" : "Save"}
        </button>
      </form>
    </div>
  );
}

AddEndpoint.defaultProps = {
  endpointId: "",
  name: "",
  description: "",
  url: "",
  project: "",
};

export default AddEndpoint;
