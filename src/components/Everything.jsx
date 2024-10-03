import React, { useState } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import "../styles/node.css"

function Everything() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  function headerClick(id) {
    return <NoteForm id={id} />
  }

  return (
    <div>
      {/* <Header /> */}
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onHeaderClick={headerClick}
          />
        );
      })}
      {/* <Footer /> */}
    </div>
  );
}

export default Everything;
