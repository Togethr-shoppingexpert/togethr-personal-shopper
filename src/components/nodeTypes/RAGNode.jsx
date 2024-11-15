import React from "react";
import { Handle, Position } from "react-flow-renderer";

const RAGNode = ({ data }) => {
  const {node_type, output_socket_list, input_socket_list } = data; 

  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: "#2c2f36", color: "white", width: "200px", textAlign: "center" }}>
      <h4>{node_type}</h4> 
      <div style={{ fontSize: "7px", color: "#aaa" }}>Outputs</div>
      {output_socket_list?.map((output, index) => (
        <div key={index} style={{ margin: "5px 0", color: "#fff" }}>
          <div className="text-[7px]"> {output.output_name}</div>
          <Handle
            type="source"
            position={Position.Right}
            id={`${data.id}-output-${index}`}
            style={{ top: `${20 + index * 30}px`, background: "#555" }} 
          />
        </div>
      ))}
      <div style={{ fontSize: "7px", color: "#aaa", marginTop: "10px" }}>Inputs</div>
      {input_socket_list?.map((input, index) => (
        <div key={index} style={{ margin: "5px 0", color: "#fff" }}>
          <div className="text-[7px]"> {input.input_name}</div>
          <Handle
            type="target"
            position={Position.Left}
            id={`${data.id}-input-${index}`} 
            style={{ top: `${20 + index * 30}px`, background: "#555" }} 
          />
        </div>
      ))}
    </div>
  );
};

export default RAGNode;