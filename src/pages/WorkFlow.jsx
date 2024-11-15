
import React, { useEffect } from "react";
import { useContentContext } from "../../ContentContest"; // Use ContentContext
import NoteForm from "../components/NoteForm";
import Note from "../components/Node";
import NodeInput from "../components/NodeInput";

const WorkflowContainer = ({ selectedWorkflowId }) => {
  // Get states and functions from ContentContext
  const {
    nodes,
    setNodes,
    selectedNoteId,
    setSelectedNoteId,
    noteData,
    setNoteData,
    workflowId,
    setWorkflowId,
    nodeId,
    setNodeId,
    activeNodeId,
    setActiveNodeId
  } = useContentContext(); 

  console.log("Selected Workflow ID:", selectedWorkflowId); 

  useEffect(() => {
    if (!selectedWorkflowId) {
      const storedWorkflowId = localStorage.getItem("selectedWorkflowId");
      console.log("Stored ID:", storedWorkflowId);
      if (storedWorkflowId) {
        setWorkflowId(storedWorkflowId);
      } else {
        console.error("No workflow ID found in localStorage or props.");
      }
    } else {
      setWorkflowId(selectedWorkflowId);
    }
  }, [selectedWorkflowId, setWorkflowId]);

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
        organization: '',
        model: '',
        using: '',
        name: '',
        to: '',
        where: '',
        input_format_dict: {},
        output_format_dict: {}
      },
    }));
  };

  const deleteNote = (id) => {
    setNodes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleHeaderClick = (id) => {
    setActiveNodeId(id);
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

  const handleNodeClick = (id) => {
    setSelectedNoteId(id);
  }

  const handleOnClose = () => {
    setActiveNodeId(null);
  };

  const handleCreateNode = async (id, content) => {
    if (!content) {
      console.error("Content is undefined or null");
      return;
    }
  
    const nodeToSave = nodes.find(node => node.id === id);
    if (!nodeToSave) return;
  
    // Function to dynamically create input/output format dictionaries
    const createFormatDict = (formatDict) => {
      const result = {};
      for (const key in formatDict) {
        if (formatDict.hasOwnProperty(key)) {
          result[key] = {
            type: formatDict[key]?.type || "",
            description: formatDict[key]?.description || "",
            value: formatDict[key]?.value || "",
          };
        }
      }
      return result;
    };
  
    try {
      const response = await fetch('https://qa.govoyr.com/api/node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          node_name: content?.what,
          system_prompt: content?.how,
          organization: content?.organization, 
          model_name: content?.model , 
          workflow_id: `${workflowId}`,
          position: "1",
          status: 'ready',
          format_organization: 'Claude',
          format_model: 'claude-3-haiku-20240307',
          input_format_dict: createFormatDict(content?.input_format_dict || {}),
          output_format_dict: createFormatDict(content?.output_format_dict || {}),
          next_node_object_id: "",
          node_processor_type: content?.what
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to create node');
      }
  
      const data = await response.json();
      localStorage.setItem('node_id', data.created_node.id);
      console.log("Node data", data.created_node);
      console.log("Node ID:", data.created_node.id);
      setNodeId(data.created_node.id);
  
    } catch (error) {
      console.error("Error creating node:", error.message);
    }
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
                onDrag={handleNodeDrag} 
                onNodeClick={handleNodeClick}
              />
              {activeNodeId === node.id && <NodeInput id={nodeId} onClose={handleOnClose} what={noteData[node.id]?.what} />} 

              {parentNode && (
                <div
                  className="thread"
                  style={{
                    position: "absolute",
                    width: `${node.position.x - parentNode.position.x - 240}px`,
                    height: "2px",
                    backgroundColor: "#1A202C",
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

