import styles from "./note.module.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  noteReset,
  deleteNote,
  getNotes,
} from "../../../StateManagement/Reducers/notesReducer";

import swal from "sweetalert";
import Modal from "../../Modal/modal";
import { showModal } from "../../../StateManagement/Reducers/modalReducer";
import { MdDelete } from "react-icons/md";
import AddNotes from "../AddNotes/addNotes";

function Note(props) {
  const dispatch = useDispatch();

  const { currentNote } = useSelector((state) => state.notes);
  const deleteNoteState = useSelector((state) => state.notes.deleteNote);

  const modalState = useSelector((state) => state.modal);

  useEffect(() => {
    const { loading, error, status, tried } = deleteNoteState;

    if (tried) {
      if (status) {
        dispatch(getNotes(props.noteData));
        swal({
          title: "Note has been deleted",
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
  }, [deleteNoteState]);

  useEffect(() => {
    return () => {
      dispatch(noteReset("getNotes"));
      dispatch(noteReset("deleteNote"));
    };
  }, []);

  function handleNote() {
    swal({
      icon: "warning",
      title: "Confirm",
      text: `Are you sure you want to delete this Note?`,
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        dispatch(deleteNote(currentNote.noteId));
      }
    });
  }

  if (currentNote) {
    return (
      <div className={styles.main}>
        {modalState.showModal && modalState.action == "editNote" && (
          <Modal heading={"Edit Note"}>
            <AddNotes
              project={props.currentProject}
              noteData={props.noteData}
              notes={props.notes}
              note={currentNote}
            />
          </Modal>
        )}

        <div className={styles.header}>
          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Topic:</label>
            <label className={styles.headerValue}>{currentNote.name}</label>
          </div>

          {currentNote.parentName && currentNote.parentName != "" && (
            <div className={styles.headerDiv}>
              <label className={styles.headerDesc}>Parent:</label>
              <label className={styles.headerValue}>
                {currentNote.parentName}
              </label>
            </div>
          )}

          <div className={styles.headerDiv}>
            <button className={styles.delete} onClick={handleNote}>
              Delete Note
            </button>
          </div>
        </div>

        <div className={styles.dataDiv}>
          <textarea disabled value={currentNote.text}></textarea>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => {
              dispatch(showModal({ showModal: true, action: "editNote" }));
            }}
          >
            Edit Note
          </button>
        </div>
      </div>
    );
  }
}

export default Note;
