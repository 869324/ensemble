import styles from "./addNotes.module.scss";

import { useEffect, useState } from "react";

import {
  createNote,
  getNotes,
  noteReset,
  updateNote,
  selectNote,
} from "../../../StateManagement/Reducers/notesReducer";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function AddNotes(props) {
  const dispatch = useDispatch();

  const createState = useSelector((state) => state.notes.createNote);
  const updateState = useSelector((state) => state.notes.updateNote);
  const { action } = useSelector((state) => state.modal);

  const [noteData, setNoteData] = useState({
    ...props.note,
    project: props.project,
  });

  useEffect(() => {
    const { loading, error, status, tried } = createState;

    if (tried) {
      if (status) {
        swal({
          title: "Note has been created",
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
    const { loading, error, status, tried } = updateState;

    if (tried) {
      if (status) {
        dispatch(selectNote(noteData));
        swal({
          title: "Note has been updated",
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
      dispatch(getNotes(props.noteData));
      dispatch(noteReset("createNote"));
      dispatch(noteReset("updateNote"));
    };
  }, []);

  function handleNoteChange(e) {
    setNoteData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    if (action == "addNote") {
      dispatch(createNote(noteData));
    } else if (action == "editNote") {
      dispatch(updateNote(noteData));
    }
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.classData1}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Topic</label>
            <input
              className={styles.input}
              name="name"
              value={noteData.name}
              onChange={handleNoteChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Parent Topic</label>
            <select
              className={styles.select}
              name="parent"
              value={noteData.parent}
              onChange={handleNoteChange}
            >
              <option value="">None</option>
              {props.notes
                .filter((note) => !note.parent)
                .map((note) => {
                  return <option value={note.noteId}>{note.name}</option>;
                })}
            </select>
          </div>
        </div>

        <div className={styles.classData2}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Text</label>
            <textarea
              className={styles.input}
              name="text"
              placeholder="Type here ..."
              value={noteData.tetxt}
              onChange={handleNoteChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          {action == "addNote" ? "Submit" : "Save"}
        </button>
      </form>
    </div>
  );
}

AddNotes.defaultProps = {
  note: {
    noteId: "",
    name: "",
    text: "",
    parent: "",
    parentName: "",
    project: "",
  },
  notes: [],
  project: "",
  noteData: {},
};

export default AddNotes;
