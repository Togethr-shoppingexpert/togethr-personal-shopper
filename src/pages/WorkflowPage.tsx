import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  Connection,
  MarkerType,
} from "react-flow-renderer";
import NodeValuesForm from "../components/NodeValuesForm";

interface FormData {
  node_name?: string;
  input_name?: string;
  input_description?: string;
  next_node_ids?: string;
  next_node_socket_ids?: string;
  system_prompt?: string;
  llm_organization_name?: string;
  llm_model_name?: string;
  input_value?: string;
  output_name?: string;
  output_description?: string;
  file?: File;
}

interface NodePayload {
    node_name: string;
    node_type: string;
    next_node_ids: string[];
    system_prompt?: string;  
    llm_organization_name?: string;
    llm_model_name?:string;
    formatting_llm_organization?: string;
    formatting_llm_model?: string;
    input_data?: 
    Array<{
        is_structured: boolean,
        input_name: string;
        input_description:
          string;
        is_static: boolean;
        next_node_socket_ids: string[];
        input_value: string;
      }>;
    input_socket_list?: Array<{
      is_structured: boolean;
      input_name: string;
      input_description: string;
      is_static: boolean;
      next_node_socket_ids: string[];
      input_value: any;
    }>;
    output_socket_list?: Array<{
      is_structured: boolean;
      input_name: string;
      input_description: string;
      is_static: boolean;
      next_node_socket_ids: string[];
      input_value: any;
    }>;
  }

const initialNodes: Node[] = [];

const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({});
  const [inputType, setInputType] = useState("string");
  const [sasUrl, setSasUrl] = useState<string>(""); // State to store SAS URL
  const [blobName, setBlobName] = useState<string>("");

  const onConnect = useCallback(
    (params: Edge<any> | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: "arrowclosed" as MarkerType },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log("Node clicked:", node);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNodeType("");
    setFormData({});
  };

  const handleNodeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNodeType(event.target.value);
    setFormData({});
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;

    // Check if the input type is file
    if (type === 'file') {
        const input = event.target as HTMLInputElement; // Cast to HTMLInputElement

        // Ensure input.files is not null before accessing it
        if (input.files && input.files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: null }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: null })); // Handle the case of no file selected
        }
    } else {
        // Handle text inputs (textarea or other inputs)
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleInputTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(e.target.value);
  };

  const createSasUrl = async (file: File) => {
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

  const uploadFileToSasUrl = async (file: File, sas_url: string) => {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    };

    try {
      const response = await fetch(sas_url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const createInputNode = async (file: File) => {
    const sasResult = await createSasUrl(file);
    if (!sasResult) return;
    const { blob_name } = sasResult;
    const { sas_url } = sasResult;

    await uploadFileToSasUrl(file, sas_url);

    const workflowId = localStorage.getItem("selectedWorkflowId") || "";
    const newNode: Node = {
      id: `${nodeIdCounter}`,
      data: { label: `Input node_${nodeIdCounter}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    const nodePayload: NodePayload = {
      node_name: `Input node_${nodeIdCounter}`,
      node_type: "INPUT",
      next_node_ids: formData.next_node_ids ? formData.next_node_ids.split(",") : [],
      input_socket_list: [
        {
          is_structured: true,
          input_name: "context",
          input_description: "context for answering user query",
          is_static: false,
          next_node_socket_ids: formData.next_node_socket_ids ? formData.next_node_socket_ids.split(",") : [],
          input_value: {
            file_name: file.name,
            blob_name: blob_name,
          },
        },
      ],
    };

    try {
      const response = await fetch(
        `https://qa.govoyr.com/api/input_node/${workflowId}`,
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

  const createNode = async () => {
    if (!selectedNodeType) {
      alert("Please select a node type.");
      return;
    }

    if (inputType === "file" && formData.file instanceof File) {
      await createInputNode(formData.file);
    } else {
      const workflowId = localStorage.getItem("selectedWorkflowId") || "";
      const newNode: Node = {
        id: `${nodeIdCounter}`,
        data: { label: selectedNodeType },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };

      const nodePayload: { [key: string]: NodePayload } = {
        INPUT: {          node_name: formData.node_name || "Input Node",
            node_type: "INPUT",
            next_node_ids: formData.next_node_ids
              ? formData.next_node_ids.split(",")
              : [],
            input_data: [
              {
                is_structured: true,
                input_name: formData.input_name || "user_query",
                input_description:
                  formData.input_description || "user query to respond to",
                is_static: false,
                next_node_socket_ids: formData.next_node_socket_ids
                  ? formData.next_node_socket_ids.split(",")
                  : [],
                input_value: formData.input_value || "",
              },
            ], },
        RAG: { 
            node_name: formData.node_name || "RAG Node",
            node_type: "RAG",
            next_node_ids: formData.next_node_ids
              ? formData.next_node_ids.split(",")
              : [],
            system_prompt:
              formData.system_prompt ||
              "answer the user query based on the given context",
            llm_organization_name: formData.llm_organization_name || "Claude",
            llm_model_name: formData.llm_model_name || "claude-3-haiku-20240307",
            formatting_llm_organization: "",
            formatting_llm_model: "",
            input_socket_list: [
              {
                is_structured: true,
                input_name: formData.input_name || "context",
                input_description:
                  formData.input_description ||
                  "context for answering user query",
                is_static: false,
                next_node_socket_ids: formData.next_node_socket_ids
                  ? formData.next_node_socket_ids.split(",")
                  : [],
                input_value: formData.input_value || "",
              },
            ],
            output_socket_list: [],},
        LLM: {
            node_name: formData.node_name || "LLM Node",
            node_type: "LLM",
            next_node_ids: formData.next_node_ids
              ? formData.next_node_ids.split(",")
              : [],
            system_prompt: formData.system_prompt || "hi",
            llm_organization_name: formData.llm_organization_name || "hi",
            llm_model_name: formData.llm_model_name || "hi",
            formatting_llm_organization: "",
            formatting_llm_model: "",
            input_socket_list: [
              {
                is_structured: false,
                input_name: formData.input_name || "user_input",
                input_description: formData.input_description || "user input",
                is_static: false,
                next_node_socket_ids: formData.next_node_socket_ids
                  ? formData.next_node_socket_ids.split(",")
                  : [],
                input_value: formData.input_value || "",
              },
            ],
            output_socket_list: [
              {
                is_structured: false,
                input_name: formData.output_name || "output_data",
                input_description: formData.output_description || "output data",
                is_static: false,
                next_node_socket_ids: [],
                input_value: "None",
              },
            ],},
      };

      try {
        const response = await fetch(
          `https://qa.govoyr.com/api/${selectedNodeType.toLowerCase()}_node/${workflowId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nodePayload[selectedNodeType]),
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
        console.error("Error creating node:", error);
      }
    }
  };

  const renderFormFields = () => {
    switch (selectedNodeType) {
      case "INPUT":
        return (
          <>
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Node Name
            </label>
            <input
              name="node_name"
              onChange={handleInputChange}
              className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Input Name
            </label>
            <input
              name="input_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Input Description
            </label>
            <input
              name="input_description"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            {/* Select Input Type */}
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Input Type
            </label>
            <select
              value={inputType}
              onChange={handleInputTypeChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="string">String Input</option>
              <option value="file">File Input</option>
            </select>
            {/* Conditionally Render Textarea or File Input */}
            {inputType === "string" ? (
              <>
                <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Input Value
                </label>
                <textarea
                  name="input_value"
                  onChange={handleInputChange}
                  rows= {4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter input value"
                />
              </>
            ) : (
              <>
                <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Upload File
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    const files = e.target.files; // Get the files
                    if (files && files.length > 0) { // Check if files is not null and has at least one file
                      setFormData({ ...formData, file: files[0] }); // Set the first file
                    } else {
                      // Handle the case when no files are selected (optional)
                      setFormData({ ...formData, file: undefined }); // Or any other default value you prefer
                    }
                  }}
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                />
              </>
            )}
          </>
        );
      case "RAG":
        return (
          <>
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Node Name
            </label>
            <input
              name="node_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              System Prompt
            </label>
            <input
              name="system_prompt"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Organization Name
            </label>
            <input
              name="llm_organization_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Model Name
            </label>
            <input
              name="llm_model_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </>
        );
      case "LLM":
        return (
          <>
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Node Name
            </label>
            <input
              name="node_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              System Prompt
            </label>
            <input
              name="system_prompt"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Organization Name
            </label>
            <input
              name="llm_organization_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Model Name
            </label>
            <input
              name="llm_model_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div style={{ height: "100vh" }}>
            <button
        onClick={openModal}
        className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Create New Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <button onClick={openModal }>Add Node</button>
      {isModalOpen && (
        <NodeValuesForm
          onSubmit={createNode}
          selectedNodeType={selectedNodeType}
          onNodeTypeChange={handleNodeTypeChange}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default WorkflowEditor;
