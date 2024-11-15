import React, { useState } from "react";

const NodeValuesForm = ({
  onSubmit,
  selectedNodeType,
  onNodeTypeChange,
  closeModal,
}) => {
  const [formData, setFormData] = useState({
    node_name: "",
    input_data: [
      {
        is_structured: "true",
        input_name: "",
        input_description: "",
        is_static: false,
        next_node_socket_ids: [],
        input_value: "",
      },
    ],
    system_prompt: "",
    llm_organization_name: "",
    llm_model_name: "",
    formatting_llm_organization: "",
    formatting_llm_model: "",
    input_socket_list: [
      {
        is_structured: "true",
        input_name: "",
        input_description: "",
        is_static: false,
        next_node_socket_ids: [],
        input_value: "",
      },
    ],
    output_socket_list: [
      {
        is_structured: "true",
        input_name: "",
        input_description: "",
        is_static: false,
        next_node_socket_ids: [],
        input_value: "",
      },
    ],
  });

  const handleInputChange = (index, event, listType) => {
    const { name, value, type, checked } = event.target;
    if (name === "is_static") {
      setFormData((prevData) => {
        const newList = [...prevData[listType]];
        newList[index][name] = checked;
        return { ...prevData, [listType]: newList };
      });
    } else {
      setFormData((prevData) => {
        const newList = [...prevData[listType]];
        newList[index][name] = value;
        return { ...prevData, [listType]: newList };
      });
    }
  };

  const handleFileChange = (index, event, listType) => {
    const file = event.target.files[0];
    setFormData((prevData) => {
      const newList = [...prevData[listType]];
      newList[index].input_value.file_name = file.name; 
      newList[index].input_value.blob_name = file; 
      return { ...prevData, [listType]: newList };
    });
  };

  const handleAddInputData = () => {
    setFormData((prevData) => ({
      ...prevData,
      input_data: [
        ...prevData.input_data,
        {
          is_structured: "select",
          input_name: "",
          input_description: "",
          is_static: false,
          input_value_type: "string",
          input_value: "",
        },
      ],
    }));
  };

  const handleRemoveInputData = (index) => {
    setFormData((prevData) => {
      const newInputData = prevData.input_data.filter((_, i) => i !== index);
      return { ...prevData, input_data: newInputData };
    });
  };

  const handleAddSocket = (listType) => {
    const newSocket = {
      is_structured: "true",
      input_name: "",
      input_description: "",
      is_static: false,
      next_node_socket_ids: [],
      input_value: { blob_name: null, file_name: null },
    };
    setFormData((prevData) => ({
      ...prevData,
      [listType]: [...prevData[listType], newSocket],
    }));
  };

  const handleRemoveSocket = (index, listType) => {
    setFormData((prevData) => {
      const newList = prevData[listType].filter((_, i) => i !== index);
      return { ...prevData, [listType]: newList };
    });
  };

  const renderFormFields = () => {
    switch (selectedNodeType) {
      case "INPUT":
        return (
          <>
            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Node Name
              </label>
              <input
                name="node_name"
                onChange={(e) =>
                  setFormData({ ...formData, node_name: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary- 500 dark:focus:border-primary-500"
              />
            </div>
            <div className="max-h-96 overflow-y-auto min-w-[100%] mt-5">
              <h3 className="mt-4 text-lg font-semibold dark:text-white">
                Input Data
              </h3>
              {formData.input_data.map((input, index) => (
                <div
                  key={index}
                  className="border p-4 mb-4 rounded-lg flex flex-wrap justify-between items-center"
                >
                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Structured
                    </label>
                    <select
                      name="is_structured"
                      value={input.is_structured}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_data")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>

                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Input Name
                    </label>
                    <input
                      name="input_name"
                      value={input.input_name}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_data")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Description
                  </label>
                  <input
                    name="input_description"
                    value={input.input_description}
                    onChange={(e) => handleInputChange(index, e, "input_data")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />

                  <div className="w-[100%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Static
                    </label>
                    <input
                      type="checkbox"
                      name="is_static"
                      checked={input.is_static}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_data")
                      }
                      className="mr-2"
                    />
                  </div>
                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Value Type
                  </label>
                  <select
                    name="input_value_type"
                    value={input.input_value_type}
                    onChange={(e) => handleInputChange(index, e, "input_data")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="string">String</option>
                    <option value="file">File</option>
                  </select>

                  {input.input_value_type === "string" ? (
                    <>
                      <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Input Value
                      </label>
                      <textarea
                        name="input_value"
                        value={input.input_value}
                        onChange={(e) =>
                          handleInputChange(index, e, "input_data")
                        }
                        rows="4"
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
                        name="input_value_file"
                        onChange={(e) =>
                          handleFileChange(index, e, "input_data")
                        }
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveInputData(index)}
                    className="mt-2 text-red-600"
                  >
                    Remove Input Data
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddInputData}
              className="mt-4 text-blue-600"
            >
              + Add Input Data
            </button>
          </>
        );
      case "RAG":
        return (
          <>
            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Node Name
              </label>
              <input
                name="node_name"
                onChange={(e) =>
                  setFormData({ ...formData, node_name: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>

            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              System Prompt
            </label>
            <input
              name="system_prompt"
              onChange={(e) =>
                setFormData({ ...formData, system_prompt: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                LLM Organization Name
              </label>
              <input
                name="llm_organization_name"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    llm_organization_name: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>

            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                LLM Model Name
              </label>
              <input
                name="llm_model_name"
                onChange={(e) =>
                  setFormData({ ...formData, llm_model_name: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto min-w-[100%] mt-5">
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Input Socket List
              </h3>
              {formData.input_socket_list.map((socket, index) => (
                <div
                  key={index}
                  className="border p-4 mb-4 rounded-lg flex flex-wrap justify-between items-center"
                >
                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Structured
                    </label>
                    <select
                      name="is_structured"
                      value={socket.is_structured}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>

                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Input Name
                    </label>
                    <input
                      name="input_name"
                      value={socket.input_name}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Description
                  </label>
                  <input
                    name="input_description"
                    value={socket.input_description}
                    onChange={(e) =>
                      handleInputChange(index, e, "input_socket_list")
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />

                  <div className="w-[100%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Static
                    </label>
                    <input
                      type="checkbox"
                      name="is_static"
                      checked={socket.is_static}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_socket_list")
                      }
                      className="mr-2"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Value Type
                  </label>
                  <select
                    name="input_value_type"
                    value={socket.input_value_type}
                    onChange={(e) => handleInputChange(index, e, "input_data")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="string">String</option>
                    <option value="file">File</option>
                  </select>

                  {socket.input_value_type === "string" ? (
                    <>
                      <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Input Value
                      </label>
                      <textarea
                        name="input_value"
                        value={socket.input_value}
                        onChange={(e) =>
                          handleInputChange(index, e, "input_data")
                        }
                        rows="4"
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
                        name="input_value_file"
                        onChange={(e) =>
                          handleFileChange(index, e, "input_data")
                        }
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSocket(index, "input_socket_list")
                    }
                    className="mt-2 text-red-600"
                  >
                    Remove Input Socket
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddSocket("input_socket_list")}
              className="mt-4 text-blue-600"
            >
              + Add Input Socket
            </button>

            <div className="max-h-60 overflow-y-auto min-w-[100%] mt-5">
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Output Socket List
              </h3>
              {formData.output_socket_list.map((socket, index) => (
                <div
                  key={index}
                  className="border p-4 mb-4 rounded-lg flex flex-wrap justify-between items-center"
                >
                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Structured
                    </label>
                    <select
                      name="is_structured"
                      value={socket.is_structured}
                      onChange={(e) =>
                        handleInputChange(index, e, "output_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>

                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Input Name
                    </label>
                    <input
                      name="input_name"
                      value={socket.input_name}
                      onChange={(e) =>
                        handleInputChange(index, e, "output_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Description
                  </label>
                  <input
                    name="input_description"
                    value={socket.input_description}
                    onChange={(e) =>
                      handleInputChange(index, e, "output_socket_list")
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />

                  <div className="w-[100%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Static
                    </label>
                    <input
                      type="checkbox"
                      name="is_static"
                      checked={socket.is_static}
                      onChange={(e) =>
                        handleInputChange(index, e, "output_socket_list")
                      }
                      className="mr-2"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Value Type
                  </label>
                  <select
                    name="input_value_type"
                    value={socket.input_value_type}
                    onChange={(e) => handleInputChange(index, e, "input_data")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="string">String</option>
                    <option value="file">File</option>
                  </select>

                  {socket.input_value_type === "string" ? (
                    <>
                      <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Input Value
                      </label>
                      <textarea
                        name="input_value"
                        value={input.input_value}
                        onChange={(e) =>
                          handleInputChange(index, e, "input_data")
                        }
                        rows="4"
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
                        name="input_value_file"
                        onChange={(e) =>
                          handleFileChange(index, e, "input_data")
                        }
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSocket(index, "output_socket_list")
                    }
                    className="mt-2 text-red-600"
                  >
                    Remove Output Socket
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddSocket("output_socket_list")}
              className="mt-4 text-blue-600"
            >
              + Add Output Socket
            </button>
          </>
        );
      case "LLM":
        return (
          <>
            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Node Name
              </label>
              <input
                name="node_name"
                onChange={(e) =>
                  setFormData({ ...formData, node_name: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>

            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              System Prompt
            </label>
            <input
              name="system_prompt"
              onChange={(e) =>
                setFormData({ ...formData, system_prompt: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                LLM Organization Name
              </label>
              <input
                name="llm_organization_name"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    llm_organization_name: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>

            <div className="w-[48%]">
              <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                LLM Model Name
              </label>
              <input
                name="llm_model_name"
                onChange={(e) =>
                  setFormData({ ...formData, llm_model_name: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto min-w-[100%] mt-5">
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Input Socket List
              </h3>
              {formData.input_socket_list.map((socket, index) => (
                <div
                  key={index}
                  className="border p-4 mb-4 rounded-lg flex flex-wrap justify-between items-center"
                >
                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Structured
                    </label>
                    <select
                      name="is_structured"
                      value={socket.is_structured}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>

                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Input Name
                    </label>
                    <input
                      name="input_name"
                      value={socket.input_name}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Description
                  </label>
                  <input
                    name="input_description"
                    value={socket.input_description}
                    onChange={(e) =>
                      handleInputChange(index, e, "input_socket_list")
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />

                  <div className="w-[100%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Static
                    </label>
                    <input
                      type="checkbox"
                      name="is_static"
                      checked={socket.is_static}
                      onChange={(e) =>
                        handleInputChange(index, e, "input_socket_list")
                      }
                      className="mr-2"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Value Type
                  </label>
                  <select
                    name="input_value_type"
                    value={socket.input_value_type}
                    onChange={(e) => handleInputChange(index, e, "input_data")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="string">String</option>
                    <option value="file">File</option>
                  </select>

                  {socket.input_value_type === "string" ? (
                    <>
                      <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Input Value
                      </label>
                      <textarea
                        name="input_value"
                        value={socket.input_value}
                        onChange={(e) =>
                          handleInputChange(index, e, "input_data")
                        }
                        rows="4"
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
                        name="input_value_file"
                        onChange={(e) =>
                          handleFileChange(index, e, "input_data")
                        }
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSocket(index, "input_socket_list")
                    }
                    className="mt-2 text-red-600"
                  >
                    Remove Input Socket
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddSocket("input_socket_list")}
              className="mt-4 text-blue-600"
            >
              + Add Input Socket
            </button>

            <div className="max-h-60 overflow-y-auto min-w-[100%] mt-5">
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Output Socket List
              </h3>
              {formData.output_socket_list.map((socket, index) => (
                <div
                  key={index}
                  className="border p-4 mb-4 rounded-lg flex flex-wrap justify-between items-center"
                >
                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Structured
                    </label>
                    <select
                      name="is_structured"
                      value={socket.is_structured}
                      onChange={(e) =>
                        handleInputChange(index, e, "output_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>

                  <div className="w-[45%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Input Name
                    </label>
                    <input
                      name="input_name"
                      value={socket.input_name}
                      onChange={(e) =>
                        handleInputChange(index, e, "output_socket_list")
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Description
                  </label>
                  <input
                    name="input_description"
                    value={socket.input_description}
                    onChange={(e) =>
                      handleInputChange(index, e, "output_socket_list")
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />

                  <div className="w-[100%]">
                    <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Is Static
                    </label>
                    <input
                      type="checkbox"
                      name="is_static"
                      checked={socket.is_static}
                      onChange={(e) =>
                        handleInputChange(index, e, "output_socket_list")
                      }
                      className="mr-2"
                    />
                  </div>

                  <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Input Value Type
                  </label>
                  <select
                    name="input_value_type"
                    value={socket.input_value_type}
                    onChange={(e) => handleInputChange(index, e, "input_data")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="string">String</option>
                    <option value="file">File</option>
                  </select>

                  {socket.input_value_type === "string" ? (
                    <>
                      <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Input Value
                      </label>
                      <textarea
                        name="input_value"
                        value={input.input_value}
                        onChange={(e) =>
                          handleInputChange(index, e, "input_data")
                        }
                        rows="4"
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
                        name="input_value_file"
                        onChange={(e) =>
                          handleFileChange(index, e, "input_data")
                        }
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSocket(index, "output_socket_list")
                    }
                    className="mt-2 text-red-600"
                  >
                    Remove Output Socket
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddSocket("output_socket_list")}
              className="mt-4 text-blue-600"
            >
              + Add Output Socket
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative w-full max-w-2xl p-4 z-50">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 z-50">
          <div className="p text-start">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Node
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 max-h-[600px] overflow-y-auto flex justify-between items-center flex-wrap">
              <div className="w-[48%]">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                  Select Node Type
                </label>
                <select
                  value={selectedNodeType}
                  onChange={onNodeTypeChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 z-50"
                >
                  <option value="">Select</option>
                  <option value="INPUT">INPUT</option>
                  <option value="LLM">LLM</option>
                  <option value="RAG">RAG</option>
                </select>
              </div>

              {renderFormFields()}

              <button
                type="button"
                onClick={handleSubmit}
                className="ml-auto mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeValuesForm;
