import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import NodeValuesForm from "../components/NodeValuesForm";
import nodeTypes from "../components/nodeTypes/NodeTypes";

const initialNodes = [];

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [inputType, setInputType] = useState("string");
  const [sasUrl, setSasUrl] = useState(""); 
  const [blobName, setBlobName] = useState("");

  // const onConnect = useCallback(
  //   (params) => {
  //     const sourceNode = nodes.find((node) => node.id === params.source);
  //     const targetNode = nodes.find((node) => node.id === params.target);
  
  //     if (sourceNode && targetNode && sourceNode === "inputNode") {
  //       const handleIndex = parseInt(params.sourceHandle.split("-")[2], 10); 
  //       const input_data = sourceNode.data.input_data[handleIndex]; // Get the specific input data
  //       if (!input_data) {
  //         console.error("No input data found for the connected handle.");
  //         return;
  //       }
  
  //       // Assuming the target node has a specific input socket ID format
  //       const targetSocketId = `${targetNode.id}-input-${targetNode.data.input_socket_list.length}`; // Generate socket ID
  
  //       if (targetNode.type === "llmNode" || targetNode.type === "ragNode") {
  //         const updatedTargetNode = {
  //           ...targetNode,
  //           data: {
  //             ...targetNode.data,
  //             input_socket_list: [
  //               ...(targetNode.data.input_socket_list || []),
  //               { input_value: input_data },
  //             ],
  //           },
  //         };
  
  //         // Update the inputData of the source node to include the new socket ID in the next_node_socket_ids array
  //         const updatedInputData = [...sourceNode.data.input_data];
  //         updatedInputData[handleIndex] = {
  //           ...input_data,
  //           next_node_socket_ids: [
  //             ...(input_data.next_node_socket_ids || []), 
  //             targetSocketId, 
  //           ],
  //         };

  //         const updatedNextNodeIds = [
  //           ...(sourceNode.data.next_node_ids || []),
  //           targetNode.data.nodeID,
  //         ];
  
  //         const updatedSourceNode = {
  //           ...sourceNode,
  //           data: {
  //             ...sourceNode.data,
  //             input_data: updatedInputData,
  //             next_node_ids: updatedNextNodeIds,
  //           },
  //         };
  
  //         // Update both the source and target nodes in the state
  //         setNodes((nds) =>
  //           nds.map((node) =>
  //             node.id === targetNode.id ? updatedTargetNode : node.id === sourceNode.id ? updatedSourceNode : node
  //           )
  //         );
  //         console.log("Updated target node:", updatedTargetNode);
  //         console.log("updated source node", updatedSourceNode);
  //       }
  //     }
  //     else{

  //     }
  //     setEdges((eds) => addEdge({ ...params, arrowHeadType: "arrow" }, eds));
  //   },
  //   [nodes, setEdges]
  // );

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
  
      if (sourceNode && targetNode) {
        const targetSocketId = `${targetNode.id}-input-${targetNode.data.input_socket_list.length}`; // Generate socket ID
        const updatedNextNodeIds = [
          ...(sourceNode.data.next_node_ids || []),
          targetNode.data.nodeID, // Use nodeId instead of nodeID for consistency
        ];

        const uniqueNextNodeIds = Array.from(new Set(updatedNextNodeIds));
  
        if (sourceNode.type === "inputNode") {
          const handleIndex = parseInt(params.sourceHandle.split("-")[2], 10); 
          const input_data = sourceNode.data.input_data[handleIndex]; // Get the specific input data
  
          if (!input_data) {
            console.error("No input data found for the connected handle.");
            return;
          }
  
          // Only update target node if it's llmNode or ragNode
          if (targetNode.type === "llmNode" || targetNode.type === "ragNode") {
            const updatedTargetNode = {
              ...targetNode,
              data: {
                ...targetNode.data,
                input_socket_list: [
                  ...(targetNode.data.input_socket_list || []),
                  { input_value: input_data },
                ],
              },
            };
  
            // Update the inputData of the source node to include the new socket ID in the next_node_socket_ids array
            const updatedInputData = [...sourceNode.data.input_data];
            updatedInputData[handleIndex] = {
              ...input_data,
              next_node_socket_ids: [
                ...(input_data.next_node_socket_ids || []), 
                targetSocketId, 
              ],
            };
  
            const updatedSourceNode = {
              ...sourceNode,
              data: {
                ...sourceNode.data,
                input_data: updatedInputData,
                next_node_ids: uniqueNextNodeIds,
              },
            };
  
            // Update both the source and target nodes in the state
            setNodes((nds) =>
              nds.map((node) =>
                node.id === targetNode.id ? updatedTargetNode : node.id === sourceNode.id ? updatedSourceNode : node
              )
            );
            console.log("Updated target node:", updatedTargetNode);
            console.log("Updated source node:", updatedSourceNode);
          }
        } else if (sourceNode.type === "llmNode" || sourceNode.type === "ragNode") {
          // If the source node is llmNode or ragNode, just update next_node_ids
          const updatedSourceNode = {
            ...sourceNode,
            data: {
              ...sourceNode.data,
              next_node_ids: uniqueNextNodeIds,
            },
          };
  
          // Update the source node in the state
          setNodes((nds) =>
            nds.map((node) =>
              node.id === sourceNode.id ? updatedSourceNode : node
            )
          );
          console.log("Updated source node (llmNode/ragNode):", updatedSourceNode);
        }
      }
  
      setEdges((eds) => addEdge({ ...params, arrowHeadType: "arrow" }, eds));
    },
    [nodes, setEdges]
  );


  const onNodeClick = (event, node) => {
    console.log("Node clicked:", node);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNodeType("");
  };

  const handleNodeTypeChange = (event) => {
    setSelectedNodeType(event.target.value);
    // setFormData({});
  };

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const createSasUrl = async (file) => {
    const postData = {
      file_name: file.name,
    };

    try {
      const response = await fetch("https://qa.govoyr.com/api/sasUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate SAS URL");
      }

      const result = await response.json();
      setSasUrl(result.sas_url); // Store SAS URL
      setBlobName(result.blob_name); // Store Blob Name
      console.log("SAS URL:", result.sas_url);
      console.log("Blob Name:", result.blob_name);
      return result; // Return result for further processing
    } catch (error) {
      console.error("Error fetching SAS URL:", error);
    }
  };

  const uploadFileToSasUrl = async (file, sas_url) => {
    console.log("url in put ", sas_url);

    const options = {
      method: "PUT",
      headers: {
        mode: "no-cors",
        "Content-Type": file.type, // Set MIME type dynamically
      },
      body: file, // The actual file to upload
      // Remove mode: "no-cors" if possible for proper response handling
    };

    try {
      const response = await fetch(sas_url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }

      alert("File uploaded successfully!"); // Alert user on successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const createInputNode = async (file) => {
    // Call createSasUrl to get SAS URL and blob name
    const sasResult = await createSasUrl(file);
    if (!sasResult) return;
    const { blob_name } = sasResult;
    const { sas_url } = sasResult;

    await uploadFileToSasUrl(file, sas_url);

    const workflowid = localStorage.getItem("selectedWorkflowId"); // Replace with the actual workflow ID
    console.log("workflow if in input file create fucntion", workflowid);
    const newNode = {
      id: `${nodeIdCounter}`,
      type: "inputNode",
      data: { label: `Input node_${nodeIdCounter}` }, // Node label
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    const nodePayload = {
      node_name: `Input node_${nodeIdCounter}`,
      node_type: "INPUT",
      next_node_ids: formData.next_node_ids
        ? formData.next_node_ids.split(",")
        : [],
      input_socket_list: [
        {
          is_structured: true,
          input_name: "context",
          input_description: "context for answering user query",
          is_static: false,
          next_node_socket_ids: formData.next_node_socket_ids
            ? formData.next_node_socket_ids.split(",")
            : [],
          input_value: {
            file_name: file.name, // File name from the input
            blob_name: blob_name, // Blob name from the SAS URL response
          },
        },
      ],
    };

    try {
      const workflowid = localStorage.getItem("selectedWorkflowId");
      console.log("nodePayload", nodePayload);
      const response = await fetch(
        `https://qa.govoyr.com/api/input_node/${workflowid}`, // Adjusted to the correct endpoint for INPUT nodes
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nodePayload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Node created successfully:", data);
        setNodes((nds) => nds.concat(newNode));
        setNodeIdCounter((id) => id + 1);
        closeModal();
      } else {
        console.error("Failed to create node:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating input node:", error);
    }
  };

  const createNode = async (formData) => {
    console.log("form data", formData);
    console.log("input data", formData.input_data);
    console.log("is struc", formData.input_data.is_structured);
    if (!selectedNodeType) {
      alert("Please select a node type.");
      return;
    }

    var typesOfNode;

    if (selectedNodeType === "INPUT") {
      typesOfNode = "inputNode";
    } else if (selectedNodeType === "LLM") {
      typesOfNode = "llmNode";
    } else if (selectedNodeType === "RAG") {
      typesOfNode = "ragNode";
    } else {
      alert("Please select correct node type.");
      return;
    }

    if (inputType === "file" && formData.file) {
      await createInputNode(formData.file);
    } else {
      const workflowid = localStorage.getItem("selectedWorkflowId"); 
      const newNode = {
        id: `${nodeIdCounter}`,
        type: typesOfNode,
        isConnectable: true,
        data: {},
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };

      const nodePayload = {
        INPUT: {
          node_name: formData.node_name || "Input Node",
          node_type: "INPUT",
          next_node_ids: formData.next_node_ids
            ? formData.next_node_ids.split(",")
            : [],
          input_data: formData.input_data || [],
        },
        RAG: {
          node_name: formData.node_name || "",
          node_type: "RAG",
          next_node_ids: formData.next_node_ids
            ? formData.next_node_ids.split(",")
            : [],
          system_prompt: formData.system_prompt || "",
          llm_organization_name: formData.llm_organization_name || "",
          llm_model_name: formData.llm_model_name || "",
          formatting_llm_organization: null,
          formatting_llm_model: null,
          input_socket_list: formData.input_socket_list || [],
          output_socket_list: formData.output_socket_list || [],
        },
        LLM: {
          node_name: formData.node_name || "",
          node_type: "LLM",
          next_node_ids: formData.next_node_ids
            ? formData.next_node_ids.split(",")
            : [],
          system_prompt: formData.system_prompt || "",
          llm_organization_name: formData.llm_organization_name || "",
          llm_model_name: formData.llm_model_name || "",
          formatting_llm_organization: null,
          formatting_llm_model: null,
          input_socket_list: formData.input_socket_list || [],
          output_socket_list: formData.output_socket_list || [],
        },
      };

      try {
        const response = await fetch(
          `https://qa.govoyr.com/api/${selectedNodeType.toLowerCase()}_node/${workflowid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nodePayload[selectedNodeType]),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Node created successfully:", data);
          const nodeInfo = JSON.parse(data.node_information); 
          console.log(`node info of ${nodeInfo.node_type}`, nodeInfo);
          const nodeID = data.id;
          console.log("node id ", nodeID)

          const updatedNewNode = {
            ...newNode,
            data:{
              ...newNode.data,
              ...nodeInfo,
              nodeID: nodeID,
            }
          }


          setNodes((nds) => nds.concat(updatedNewNode));
          setNodeIdCounter((id) => id + 1);
          closeModal();
        } else {
          console.error("Failed to create node:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating node:", error);
      }
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }} className="h-screen">
      <button
        onClick={openModal}
        className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Create New Node
      </button>

      {isModalOpen && (
        <NodeValuesForm
          onSubmit={createNode}
          selectedNodeType={selectedNodeType}
          onNodeTypeChange={handleNodeTypeChange}
          closeModal={closeModal}
          inputType={inputType}
          handleInputTypeChange={handleInputTypeChange}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default WorkflowEditor;
