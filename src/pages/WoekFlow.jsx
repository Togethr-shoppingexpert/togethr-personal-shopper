// WorkflowContainer.js
import React, { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";
import Note from "../components/Node";

const WorkflowContainer = ({ selectedWorkflowId }) => {
  const [nodes, setNodes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteData, setNoteData] = useState({});

  useEffect(() => {
    // Optionally, you can fetch existing nodes related to the workflow here
    // fetchNodes(selectedWorkflowId);
  }, [selectedWorkflowId]);

  const addNote = (parentNodeId = null) => {
    const parentNode = nodes.find((node) => node.id === parentNodeId);
    let newPosition = { x: 100, y: 100 };

    if (parentNode) {
      newPosition = {
        x: parentNode.position.x + 300,
        y: parentNode.position.y,
      };
    }

    const newNode = {
      id: nodes.length + 1,
      position: newPosition,
      text: '',
      parent: parentNodeId,
    };
    setSelectedNoteId(newNode.id);

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNoteData((prevData) => ({
      ...prevData,
      [newNode.id]: {
        what: '',
        how: '',
        using: '',
        name: '',
        to: '',
      },
    }));
  };

  const deleteNote = (id) => {
    setNodes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleHeaderClick = (id) => {
    setSelectedNoteId(id);
  };

  const handleNoteFormChange = (updatedData) => {
    setNoteData((prevData) => ({
      ...prevData,
      [selectedNoteId]: updatedData,
    }));
  };

  const handleNodeDrag = (id, newPosition) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, position: newPosition } : node
      )
    );
  };

  const handleCreateNode = async (id) => {
    const nodeToSave = nodes.find(node => node.id === id);
    if (!nodeToSave) return;

    await fetch('https://qa.govoyr.com/api/node', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node_name: `Node ${id}`,
        system_prompt: "",
        organization: 'Claude',
        model_name: 'claude-3-haiku-20240307',
        workflow_id: `${selectedWorkflowId}`,
        position: `${id}`,
        status: 'ready',
      }),
    });

    console.log('Node saved to API:', id);
    setSelectedNoteId(null);
  };

  return (
    <div className="workflow-container">
      <button className="create-node-btn" onClick={() => addNote(null)}>
        Create New Node
      </button>

      <div>
        {selectedNoteId !== null && (
          <NoteForm
            id={selectedNoteId}
            initialData={noteData[selectedNoteId]}
            onSave={handleNoteFormChange}
          />
        )}

        {nodes.map((node) => {
          const parentNode = nodes.find((n) => n.id === node.parent);

          return (
            <React.Fragment key={node.id}>
              <Note
                id={node.id}
                title={`Node ${node.id}`}
                content={noteData[node.id]}
                position={node.position}
                onDelete={deleteNote}
                onHeaderClick={handleHeaderClick}
                onAddNote={addNote}
                onCreateNote={handleCreateNode}
                onDrag={handleNodeDrag} // Pass the drag handler
              />

              {parentNode && (
                <div
                  className="thread"
                  style={{
                    position: "absolute",
                    width: `${
                      node.position.x - parentNode.position.x - 240
                    }px`,
                    height: "2px",
                    backgroundColor: "white",
                    left: `${parentNode.position.x + 250}px`,
                    top: `${parentNode.position.y + 135}px`,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowContainer;
