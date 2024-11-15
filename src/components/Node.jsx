
import React, { useState, useRef, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContentContext } from "../../ContentContest"; 
import "../styles/node.css"

const Note = ({
  id,
  title,
  content,
  position,
  onDelete,
  onHeaderClick,
  onAddNote,
  onDrag,
  onCreateNote,
  onNodeClick,
}) => {
  const {
    nodeId,
    activeNodeId,
  } = useContentContext(); 
  const [isDragging, setIsDragging] = useState(false);
  const noteRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
console.log("content in node", content)
  const [localPosition, setLocalPosition] = useState(position);
  useEffect(() => {
    setLocalPosition(position);
  }, [position]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const rect = noteRef.current.getBoundingClientRect();
    offset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const newPosition = {
        x: event.clientX - offset.current.x,
        y: event.clientY - offset.current.y,
      };
      setLocalPosition(newPosition);
      if (onDrag) {
        onDrag(id, newPosition);
      }
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  return (
    <div
      className="note"
      ref={noteRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${localPosition.x}px`,
        top: `${localPosition.y}px`,
        border: "1px solid #ccc",
        margin: "10px",
        cursor: isDragging ? "grabbing" : "grab",
        backgroundColor: "#2D3748",
      }}
    >
      <header className="note-header" onClick={() => onHeaderClick(id)}>
        <h2>{title}</h2>
              <button onClick={() => onDelete(id)} className="text-gray-500 dark:text-gray-100">
            <DeleteIcon />
          </button>
      </header>
      <div className="p-[10px] relative flex flex-col gap-[0]"   onClick={() => {
    onNodeClick(id);
  }}>
      <div className="text-[12px] text-gray-300">
        <p>
          {/* <strong>What:</strong> {content?.what || ""} */}
          <strong>What:</strong> {"LLM"}
        </p>
        <p>
          <strong>Organization:</strong> {content?.organization || ""}
        </p>
        <p>
          <strong>Model:</strong> {content?.model || ""}
        </p>
        <p>
          <strong>How:</strong> {content?.how || ""}
        </p>
        {/* <p>
          <strong>Using:</strong> {content?.using || ""}
        </p>
        <p>
          <strong>Name:</strong> {content?.name || ""}
        </p> */}
        {/* <p>
          <strong>To:</strong> {nodeId}
        </p> */}
      </div>
      <div className="flex justify-end items-center">
        <button
          type="button"
          onClick={() => onCreateNote(id, content)}
          className="absolute right-0 bottom-[-40px] text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create Node
        </button>
      </div>
      </div>
      <button
        className="add-node-btn"
        onClick={() => onAddNote(id)}
        style={{
          position: "absolute",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "20px",
          background: "none",
          fontWeight: "bolder",
          border: "none",
          color: "#1A202C",
        }}
      >
        +
      </button>
    </div>
  );
};

export default Note;
