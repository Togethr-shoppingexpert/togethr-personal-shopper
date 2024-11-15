import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContentContext } from "../../ContentContest";

const Home = () => {
  const navigate = useNavigate(); 
  const { workflows, setWorkflows, setSelectedWorkflowId } = useContentContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");

  useEffect(() => {
    const fetchWorkflows = async () => {
      const team_id = "fe627eb7-64c9-4691-9a04-02ddefb5bc8a";
      try {
        const response = await fetch(`https://qa.govoyr.com/api/workflows/${team_id}`);
        const data = await response.json();
        setWorkflows(data.workflows);
      } catch (error) {
        console.error('Error fetching workflows:', error);
      }
    };
    fetchWorkflows();
  }, []);

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    const newWorkflow = {
      workflow_name: workflowName,
      team_id: "fe627eb7-64c9-4691-9a04-02ddefb5bc8a",
      workflow_information: {},
      status: "ready",
    };

    try {
      const response = await fetch("https://qa.govoyr.com/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkflow),
      });

      const data = await response.json();
      setWorkflows((prevWorkflows) => [...prevWorkflows, data]);
      setSelectedWorkflowId(data.workflow_id.id);
      localStorage.setItem('selectedWorkflowId', data.workflow_id.id);
      
      setIsModalOpen(false); 
      navigate(`/${data.workflow_id.id}`);

    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  return (
   <div className="bg-gray-900 w-[100%] ">
      <div className="flex justify-end p-4">
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Workflow
        </button>
      </div>
       <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-7">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Workflow Name</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Created At</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {workflows?.map((workflow) => (
            <tr key={workflow.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {workflow.workflow_name}
              </th>
              <td className="px-6 py-4">{workflow.status}</td>
              <td className="px-6 py-4">{new Date(workflow.createdAt).toLocaleString()}</td>
              <td className="px-6 py-4">
                <button
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  onClick={() => navigate(`/${workflow.id}`)}
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="crud-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Workflow</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4" onSubmit={handleCreateWorkflow}>
              <label htmlFor="workflowName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Workflow Name
              </label>
              <input
                type="text"
                id="workflowName"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600"
                placeholder="Enter workflow name"
                required
              />
              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Workflow
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Home;
