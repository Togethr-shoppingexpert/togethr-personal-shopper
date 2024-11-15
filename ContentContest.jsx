"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';

const ContentContext = createContext(undefined);

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
};

export const ContentProvider = ({ children }) => {
 
  const [organizations, setOrganizations] = useState([]);  
  const [models, setModels] = useState({});              

  const [nodes, setNodes] = useState([]);                 
  const [selectedNoteId, setSelectedNoteId] = useState(null); 
  const [noteData, setNoteData] = useState({});           
  const [workflowId, setWorkflowId] = useState(null);      
  const [nodeId, setNodeId] = useState(null);              
  const [activeNodeId, setActiveNodeId] = useState(null);  
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);

  const contextValue = useMemo(() => ({
    organizations,       // Expose organizations state
    setOrganizations,    // Expose setOrganizations function
    models,              // Expose models state
    setModels,           // Expose setModels function
    nodes,               // Expose nodes state
    setNodes,            // Expose setNodes function
    selectedNoteId,      // Expose selectedNoteId state
    setSelectedNoteId,   // Expose setSelectedNoteId function
    noteData,            // Expose noteData state
    setNoteData,         // Expose setNoteData function
    workflowId,          // Expose workflowId state
    setWorkflowId,       // Expose setWorkflowId function
    nodeId,              // Expose nodeId state
    setNodeId,           // Expose setNodeId function
    activeNodeId,        // Expose activeNodeId state
    setActiveNodeId,
    workflows,
    setWorkflows,
    selectedWorkflowId,
    setSelectedWorkflowId 
  }), [
    organizations, 
    models, 
    nodes, 
    selectedNoteId, 
    noteData, 
    workflowId, 
    nodeId, 
    activeNodeId,
    workflows,
    selectedWorkflowId
  ]);

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};
