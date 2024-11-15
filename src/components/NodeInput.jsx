

import React, { useState } from 'react';
import { useContentContext } from "../../ContentContest";

const NodeInput = ({ id, onClose, what }) => {
  const {
    workflowId,
  } = useContentContext(); 
  const [userInterest, setUserInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [isJsonFormat, setIsJsonFormat] = useState(true);
  const [file, setFile] = useState(null);
  const [blobName, setBlobName] = useState("");
  const [fileText, setFileText] = useState("");
  const [sasUrl, setSasUrl] = useState("");

  const handleInputChange = (e) => {
    setUserInterest(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInterest && what === 'LLM') {
      alert('Please enter your interest.');
      return;
    }

    if (!file && what === 'file_to_text_convertor') {
      alert('Please select a file.');
      return;
    }

    setIsSubmitting(true);

    try {
      let response, result;

      if (what === 'LLM') {
        const postData = {
          node_object_id: id,
          input_data: String(userInterest),
        };

        response = await fetch('https://qa.govoyr.com/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to process input');
        }

        result = await response.json();
        alert('Input processed successfully!');
        setApiResult(result.response);

      } else if (what === 'file_to_text_convertor') {
        const postData = {
          file_name: file.name,
        };

        response = await fetch('https://qa.govoyr.com/api/sasUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to generate SAS URL');
        }

        result = await response.json();
        setSasUrl(result.sas_url); // Store SAS URL
        setBlobName(result.blob_name);
       console.log("sas url", result.sas_url);
        // Upload file to the SAS URL
        await uploadFileToSas(result.sas_url, file);
      }
    } catch (error) {
      alert(`There was an error processing your input: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFileToSas = async (file, sasUrl) => {
    console.log("sas ", sasUrl)
    console.log("file", file);
    try {
      const response = await fetch(sasUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
        },
        body: file
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };
  
  

  const handleFileToText = async () => {
    try {
      setIsSubmitting(true);
      const postData = {
        file_name: file.name,
        blob_name: blobName,
        workflow_id: workflowId,
      };

      const response = await fetch('https://qa.govoyr.com/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert file to text');
      }

      const result = await response.json();
      alert(result.message);
      setFileText(result.file_text);
    } catch (error) {
      alert(`Error in converting file: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-[400px] z-50 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-[20px] relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        &times;
      </button>

      <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Process Input</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        {what === 'LLM' ? (
          <div>
            <textarea
              id="chat"
              rows="3"
              value={userInterest}
              onChange={handleInputChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your interest, e.g., 'best mobile phone under 30k INR'"
            ></textarea>
          </div>
        ) : (
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              id="file_input"
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2.5 px-4 bg-blue-500 text-white rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800"
        >
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {blobName && (
        <button
          onClick={handleFileToText}
          className="py-2.5 px-4 mt-4 bg-green-500 text-white rounded-lg focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:focus:ring-green-800"
        >
          Input File to Text
        </button>
      )}

      {fileText && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700 relative">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-300">File Text:</h4>
          <p className="text-sm text-gray-800 dark:text-gray-300">{fileText}</p>
        </div>
      )}

      {apiResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700 relative">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-300">API Response:</h4>

          {isJsonFormat ? (
            <pre className="text-sm mt-[15px] text-gray-800 dark:text-gray-300 max-w-[350px] overflow-x-auto overflow-y-hidden">
              {JSON.stringify(apiResult, null, 2)}
            </pre>
          ) : (
            <div className="text-sm mt-[15px] flex flex-col gap-[5px] text-gray-900 dark:text-gray-300 max-w-[350px] overflow-x-auto overflow-y-hidden">
              {apiResult.product_type && (
                <>
                  <p><strong>Product Type - </strong></p>
                  <p>{'   '}<strong>Type: </strong> {apiResult.product_type.type}</p>
                  <p>{'   '}<strong>Description: </strong> {apiResult.product_type.description}</p>
                  <p>{'   '}<strong>Value: </strong> {apiResult.product_type.value}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeInput;
