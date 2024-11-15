import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorkflowPage from "./pages/WorkflowPage"; 
import Example from "./pages/example"
import Home from "./pages/Home";
import "./styles/App.css";
import { ContentProvider } from '../ContentContest'; 
import { useContentContext } from "../ContentContest";

const App = () => {
  const {
    workflows, 
    setWorkflows,
    selectedWorkflowId, 
    setSelectedWorkflowId
  } = useContentContext(); 

  return (
    <ReactFlowProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Home route */}
            <Route 
              path="/" 
              element={
                <Home 
                  workflows={workflows} 
                  setWorkflows={setWorkflows} 
                  setSelectedWorkflowId={setSelectedWorkflowId} 
                />
              } 
            />

            {/* Workflow page route */}
            {/* <Route 
              path="/:workflowId" 
              element={<WorkflowPage selectedWorkflowId={selectedWorkflowId} />} 
            /> */}
                        {/* Workflow page route */}
            <Route 
              path="/:workflowId" 
              element={<Example  />} 
            />
          </Routes>
        </div>
      </Router>
      </ReactFlowProvider>
  );
};

export default App;


