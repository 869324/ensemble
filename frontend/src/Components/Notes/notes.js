import styles from "./notes.module.scss";

import { RiAddFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";

import {
  getNotes,
  noteReset,
  selectNote,
} from "../../StateManagement/Reducers/notesReducer";
import { debounce } from "lodash";
import Modal from "../../Components/Modal/modal";
import Note from "./Note/note";

import {
  showModal,
  resetModal,
} from "../../StateManagement/Reducers/modalReducer";
import AddNotes from "./AddNotes/addNotes";

function Notes() {
  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const { currentProject } = useSelector((state) => state.projects);
  const { currentNote } = useSelector((state) => state.notes);
  const getNoteState = useSelector((state) => state.notes.getNotes);

  const [parentNotes, setParentNotes] = useState([]);
  const [childNotes, setChildNotes] = useState({});

  const [noteData, setNoteData] = useState({
    project: currentProject.projectId,
    name: null,
    noteId: null,
    page: 1,
    size: 10,
    order: "NAME_ASC",
  });

  useEffect(() => {
    const { notes } = getNoteState;
    const parentNotes = [];
    const childNotes = {};

    notes.forEach((note) => {
      if (!note.parent) {
        parentNotes.push(note);

        childNotes[note.noteId] = notes.filter(
          (note1) => note1.parent == note.noteId
        );
      }
    });

    setParentNotes(parentNotes);
    setChildNotes(childNotes);

    if (parentNotes.length > 0) {
      if (Object.keys(currentNote).length == 0) {
        dispatch(selectNote(parentNotes[0]));
      } else {
        const index = notes.findIndex(
          (note) => note.noteId == currentNote.noteId
        );
        if (index == -1) {
          dispatch(selectNote(parentNotes[0]));
        }
      }
    }
  }, [getNoteState.notes]);

  useEffect(() => {
    dispatch(getNotes(noteData));
  }, [noteData]);

  useEffect(() => {
    return () => {
      dispatch(resetModal());
      dispatch(noteReset("getNotes"));
    };
  }, []);

  function handleChange(e) {
    setNoteData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  return (
    <div className={styles.panelView}>
      {modalState.showModal && modalState.action == "addNote" && (
        <Modal heading="Add Note">
          <AddNotes
            project={currentProject}
            noteData={noteData}
            notes={getNoteState.notes}
          />
        </Modal>
      )}
      <h2 className={styles.h2}>Notes</h2>

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
                dispatch(showModal({ action: "addNote", showModal: true }));
              }}
            />
          </div>

          <div className={styles.rows}>
            {parentNotes.map((parentNote, parentId) => {
              return (
                <div>
                  <div
                    key={parentId}
                    className={
                      currentNote.noteId == parentNote.noteId
                        ? styles.tableDivActive
                        : styles.tableDiv
                    }
                    onClick={() => {
                      dispatch(selectNote(parentNote));
                    }}
                  >
                    {parentNote.name}
                  </div>

                  {childNotes[parentNote.noteId].map((childNote, childId) => {
                    return (
                      <div
                        key={childId}
                        className={
                          currentNote.noteId == childNote.noteId
                            ? styles.subTableDivActive
                            : styles.subTableDiv
                        }
                        onClick={() => {
                          dispatch(selectNote(childNote));
                        }}
                      >
                        {childNote.name}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.content}>
          <Note
            currentProject={currentProject}
            noteData={noteData}
            notes={getNoteState.notes}
          />
        </div>
      </div>
    </div>
  );
}

export default Notes;
