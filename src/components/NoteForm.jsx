import React, { useState, useEffect } from 'react';

const NoteForm = ({ id, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    what: '',
    how: '',
    using: '',
    name: '',
    to: '',
  });

  useEffect(() => {
    setFormData(initialData || {
      what: '',
      how: '',
      using: '',
      name: '',
      to: '',
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(formData); // Pass updated data to the parent
  };

  return (
    <div className="note-form-panel fixed top-0 right-0 w-72 h-full bg-black text-white p-4">
      <h2 className="text-xl font-bold mb-4">Q&A bot - Editing Node {id}</h2>

      <label className="block mb-2">What</label>
      <input
        type="text"
        name="what"
        value={formData.what}
        onChange={handleChange}
        placeholder="LLM"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded"
      />

      <label className="block mb-2">How</label>
      <input
        type="text"
        name="how"
        value={formData.how}
        onChange={handleChange}
        placeholder="Prompt"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded"
      />

      <label className="block mb-2">Using</label>
      <input
        type="text"
        name="using"
        value={formData.using}
        onChange={handleChange}
        placeholder="Product"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded"
      />

      <label className="block mb-2">Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="string"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded"
      />

      <label className="block mb-2">To</label>
      <input
        type="text"
        name="to"
        value={formData.to}
        onChange={handleChange}
        placeholder="Curation"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded"
      />

      <button onClick={handleSave} className="bg-blue-500 p-2 rounded">Save</button>
    </div>
  );
};

export default NoteForm;


