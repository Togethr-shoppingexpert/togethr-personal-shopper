// import React, { useState, useEffect } from 'react';
// import { useContentContext } from '../../ContentContest';

// const NoteForm = ({ id, initialData, onSave }) => {
//   const [formData, setFormData] = useState(initialData || {
//     what: 'LLM',
//     organization: '',
//     model: '',
//     how: '',
//     using: '',
//     name: '',
//     to: '',
//     where: '',
//     input_format_dict: { customKey: { type: '', description: '', value: '' } },
//     output_format_dict: { customKey: { type: '', description: '', value: '' } }
//   });

//   const { organizations, setOrganizations, models, setModels } = useContentContext();
//   const [selectedModels, setSelectedModels] = useState([]);
//   const [inputKey, setInputKey] = useState(''); // For input format custom key
//   const [outputKey, setOutputKey] = useState(''); // For output format custom key

//   async function fetchOrganizationsAndModels() {
//     try {
//       const orgResponse = await fetch("https://qa.govoyr.com/api/organizations");
//       const orgData = await orgResponse.json();
//       const organizations = orgData.organization;
//       setOrganizations(organizations);

//       const modelResponse = await fetch("https://qa.govoyr.com/api/models");
//       const modelData = await modelResponse.json();
//       setModels(modelData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }

//   useEffect(() => {
//     fetchOrganizationsAndModels();
//   }, []);

//   useEffect(() => {
//     setFormData(initialData || {
//       what: 'LLM',
//       organization: '',
//       model: '',
//       how: '',
//       using: '',
//       name: '',
//       to: '',
//       where:'',
//       input_format_dict: { customKey: { type: '', description: '', value: '' } },
//       output_format_dict: { customKey: { type: '', description: '', value: '' } }
//     });
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (name === 'organization') {
//       setSelectedModels(models[value] || []);
//     }
//   };

//   const handleNestedChange = (e, field, subField, dictName) => {
//     const { value } = e.target;
//     setFormData({
//       ...formData,
//       [dictName]: {
//         ...formData[dictName],
//         [field]: {
//           ...formData[dictName][field],
//           [subField]: value,
//         },
//       },
//     });
//   };

//   const handleAddInputKey = () => {
//     if (inputKey) {
//       setFormData({
//         ...formData,
//         input_format_dict: {
//           ...formData.input_format_dict,
//           [inputKey]: { type: '', description: '', value: '' }
//         }
//       });
//       setInputKey(''); // Clear input key field after adding
//     }
//   };

//   const handleAddOutputKey = () => {
//     if (outputKey) {
//       setFormData({
//         ...formData,
//         output_format_dict: {
//           ...formData.output_format_dict,
//           [outputKey]: { type: '', description: '', value: '' }
//         }
//       });
//       setOutputKey(''); // Clear output key field after adding
//     }
//   };

//   const handleSave = () => {
//     onSave(formData);
//   };

//   return (
//     <div className="note-form-panel fixed top-0 right-0 w-72 h-full bg-black text-white p-4 overflow-auto">
//       <h2 className="text-xl font-bold mb-4">Q&A bot - Editing Node {id}</h2>

//       <label className="block mb-2">What</label>
//       <input
//         type="text"
//         name="what"
//         value={formData.what}
//         onChange={handleChange}
//         placeholder="LLM"
//         className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300"
//       />
//       <label className="block mb-2">Organization</label>
//       <select
//         name="organization"
//         value={formData.organization}
//         onChange={handleChange}
//         className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300"
//       >
//         <option value="">Select Organization</option>
//         {organizations.map((org) => (
//           <option key={org} value={org}>{org}</option>
//         ))}
//       </select>

//       <label className="block mb-2">Model</label>
//       <select
//         name="model"
//         value={formData.model}
//         onChange={handleChange}
//         className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300"
//         disabled={!selectedModels.length}
//       >
//         <option value="">Select Model</option>
//         {selectedModels.map((model) => (
//           <option key={model} value={model}>{model}</option>
//         ))}
//       </select>

//       <label className="block mb-2">How</label>
//       <textarea
//         id="chat"
//         rows="3"
//         name="how"
//         value={formData.how}
//         onChange={handleChange}
//         className="mb-4 block p-2 w-full bg-gray-800 rounded-lg border border-gray-300"
//         placeholder="Prompt"
//       ></textarea> 

//       {/* Input for adding custom keys to input_format_dict */}
//       <h3 className="text-lg font-bold mb-2">Input Format Dict</h3>
//       <label className="block mb-2">Add Key to Input Format</label>
//       <div className="relative w-full mb-4">
//   <input
//     type="text"
//     value={inputKey}
//     onChange={(e) => setInputKey(e.target.value)}
//     className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300 pr-10" // Add padding-right to make space for the icon
//     placeholder="Enter Key (e.g., 'search_queries')"
//   />
//   <button
//     type="button"
//     onClick={handleAddInputKey}
//     className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-700"
//   >
//     {/* Tick Icon (SVG) */}
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       className="w-5 h-5"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//     </svg>
//   </button>
// </div>

//       {Object.keys(formData.input_format_dict).map((key) => (
//         <div key={key} className="mb-4">
//           <label className="block mb-2">Key: {key}</label>
//           <label className="block mb-2">Type</label>
//           <input
//             type="text"
//             value={formData.input_format_dict[key]?.type || ''}
//             onChange={(e) => handleNestedChange(e, key, 'type', 'input_format_dict')}
//             className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
//             placeholder="Enter Type"
//           />
//           <label className="block mb-2">Description</label>
//           <input
//             type="text"
//             value={formData.input_format_dict[key]?.description || ''}
//             onChange={(e) => handleNestedChange(e, key, 'description', 'input_format_dict')}
//             className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
//             placeholder="Enter Description"
//           />
//           <label className="block mb-2">Value</label>
//           <input
//             type="text"
//             value={formData.input_format_dict[key]?.value || ''}
//             onChange={(e) => handleNestedChange(e, key, 'value', 'input_format_dict')}
//             className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300"
//             placeholder="Enter Value"
//           />
//         </div>
//       ))}

//       {/* Output Format Dict */}
//       <h3 className="text-lg font-bold mb-2">Output Format Dict</h3>
//       <label className="block mb-2">Add Key to Output Format</label>
//       <div className="relative w-full mb-4">
//   <input
//     type="text"
//     value={outputKey}
//     onChange={(e) => setOutputKey(e.target.value)}
//     className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300 pr-10" // Add padding-right to make space for the icon
//     placeholder="Enter Key (e.g., 'product_type')"
//   />
//   <button
//     type="button"
//     onClick={handleAddOutputKey}
//     className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-700"
//   >
//     {/* Tick Icon (SVG) */}
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       className="w-5 h-5"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//     </svg>
//   </button>
// </div>

//       {Object.keys(formData.output_format_dict).map((key) => (
//         <div key={key} className="mb-4">
//           <label className="block mb-2">Key: {key}</label>
//           <label className="block mb-2">Type</label>
//           <input
//             type="text"
//             value={formData.output_format_dict[key]?.type || ''}
//             onChange={(e) => handleNestedChange(e, key, 'type', 'output_format_dict')}
//             className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
//             placeholder="Enter Type"
//           />
//           <label className="block mb-2">Description</label>
//           <input
//             type="text"
//             value={formData.output_format_dict[key]?.description || ''}
//             onChange={(e) => handleNestedChange(e, key, 'description', 'output_format_dict')}
//             className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
//             placeholder="Enter Description"
//           />
//           <label className="block mb-2">Value</label>
//           <input
//             type="text"
//             value={formData.output_format_dict[key]?.value || ''}
//             onChange={(e) => handleNestedChange(e, key, 'value', 'output_format_dict')}
//             className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300"
//             placeholder="Enter Value"
//           />
//         </div>
//       ))}


//       <div className="flex justify-end">
//         <button
//           type="button"
//           onClick={handleSave}
//           className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5"
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NoteForm;

import React, { useState, useEffect } from 'react';
import { useContentContext } from '../../ContentContest';

const NoteForm = ({ id, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    what: '',
    organization: '',
    model: '',
    how: '',
    using: '',
    name: '',
    to: '',
    where: '',
    input_format_dict: { customKey: { type: '', description: '', value: '' } },
    output_format_dict: { customKey: { type: '', description: '', value: '' } }
  });

  const { organizations, setOrganizations, models, setModels } = useContentContext();
  const [selectedModels, setSelectedModels] = useState([]);
  const [inputKey, setInputKey] = useState(''); // For input format custom key
  const [outputKey, setOutputKey] = useState(''); // For output format custom key

  async function fetchOrganizationsAndModels() {
    try {
      const orgResponse = await fetch("https://qa.govoyr.com/api/organizations");
      const orgData = await orgResponse.json();
      const organizations = orgData.organization;
      setOrganizations(organizations);

      const modelResponse = await fetch("https://qa.govoyr.com/api/models");
      const modelData = await modelResponse.json();
      setModels(modelData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchOrganizationsAndModels();
  }, []);

  useEffect(() => {
    setFormData(initialData || {
      what: '',
      organization: '',
      model: '',
      how: '',
      using: '',
      name: '',
      to: '',
      where: '',
      input_format_dict: { customKey: { type: '', description: '', value: '' } },
      output_format_dict: { customKey: { type: '', description: '', value: '' } }
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'organization') {
      setSelectedModels(models[value] || []);
    }
  };

  const handleNestedChange = (e, field, subField, dictName) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [dictName]: {
        ...formData[dictName],
        [field]: {
          ...formData[dictName][field],
          [subField]: value,
        },
      },
    });
  };

  const handleAddInputKey = () => {
    if (inputKey) {
      setFormData({
        ...formData,
        input_format_dict: {
          ...formData.input_format_dict,
          [inputKey]: { type: '', description: '', value: '' }
        }
      });
      setInputKey(''); // Clear input key field after adding
    }
  };

  const handleAddOutputKey = () => {
    if (outputKey) {
      setFormData({
        ...formData,
        output_format_dict: {
          ...formData.output_format_dict,
          [outputKey]: { type: '', description: '', value: '' }
        }
      });
      setOutputKey(''); // Clear output key field after adding
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="note-form-panel fixed top-0 right-0 w-72 h-full bg-black text-white p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Q&A bot - Editing Node {id}</h2>

      <label className="block mb-2">What</label>
      <select
        name="what"
        value={formData.what}
        onChange={handleChange}
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300"
      >
        <option value="LLM">LLM</option>
        <option value="file_to_text_convertor">file_to_text_convertor</option>
      </select>

      {formData.what === 'LLM' ? (
        <>
          {/* Render LLM specific form fields */}
          <label className="block mb-2">Organization</label>
          <select
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>

          <label className="block mb-2">Model</label>
          <select
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300"
            disabled={!selectedModels.length}
          >
            <option value="">Select Model</option>
            {selectedModels.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>

          <label className="block mb-2">How</label>
          <textarea
            id="chat"
            rows="3"
            name="how"
            value={formData.how}
            onChange={handleChange}
            className="mb-4 block p-2 w-full bg-gray-800 rounded-lg border border-gray-300"
            placeholder="Prompt"
          ></textarea>

          {/* Input for adding custom keys to input_format_dict */}
          <h3 className="text-lg font-bold mb-2">Input Format Dict</h3>
          <label className="block mb-2">Add Key to Input Format</label>
          <div className="relative w-full mb-4">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300 pr-10"
              placeholder="Enter Key (e.g., 'search_queries')"
            />
            <button
              type="button"
              onClick={handleAddInputKey}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          {Object.keys(formData.input_format_dict).map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2">Key: {key}</label>
              <label className="block mb-2">Type</label>
              <input
                type="text"
                value={formData.input_format_dict[key]?.type || ''}
                onChange={(e) => handleNestedChange(e, key, 'type', 'input_format_dict')}
                className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
                placeholder="Enter Type"
              />
              <label className="block mb-2">Description</label>
              <input
                type="text"
                value={formData.input_format_dict[key]?.description || ''}
                onChange={(e) => handleNestedChange(e, key, 'description', 'input_format_dict')}
                className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
                placeholder="Enter Description"
              />
              <label className="block mb-2">Value</label>
              <input
                type="text"
                value={formData.input_format_dict[key]?.value || ''}
                onChange={(e) => handleNestedChange(e, key, 'value', 'input_format_dict')}
                className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300"
                placeholder="Enter Value"
              />
            </div>
          ))}

          {/* Output Format Dict */}
          <h3 className="text-lg font-bold mb-2">Output Format Dict</h3>
          <label className="block mb-2">Add Key to Output Format</label>
          <div className="relative w-full mb-4">
            <input
              type="text"
              value={outputKey}
              onChange={(e) => setOutputKey(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300 pr-10"
              placeholder="Enter Key (e.g., 'result_fields')"
            />
            <button
              type="button"
              onClick={handleAddOutputKey}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 hover:text-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          {Object.keys(formData.output_format_dict).map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2">Key: {key}</label>
              <label className="block mb-2">Type</label>
              <input
                type="text"
                value={formData.output_format_dict[key]?.type || ''}
                onChange={(e) => handleNestedChange(e, key, 'type', 'output_format_dict')}
                className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
                placeholder="Enter Type"
              />
              <label className="block mb-2">Description</label>
              <input
                type="text"
                value={formData.output_format_dict[key]?.description || ''}
                onChange={(e) => handleNestedChange(e, key, 'description', 'output_format_dict')}
                className="w-full mb-2 p-2 bg-gray-800 rounded-lg border border-gray-300"
                placeholder="Enter Description"
              />
              <label className="block mb-2">Value</label>
              <input
                type="text"
                value={formData.output_format_dict[key]?.value || ''}
                onChange={(e) => handleNestedChange(e, key, 'value', 'output_format_dict')}
                className="w-full p-2 bg-gray-800 rounded-lg border border-gray-300"
                placeholder="Enter Value"
              />
            </div>
          ))}
        </>
      ) : (
        // Render Input to Text specific form fields
        <>

        </>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="w-full mt-4 p-2 bg-blue-500 text-white rounded-lg"
      >
        Save
      </button>
    </div>
  );
};

export default NoteForm;
