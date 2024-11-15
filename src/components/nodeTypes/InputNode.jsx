import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const InputNode = ({ data }) => {
  const { id, node_type, input_data } = data;

  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: "#2c2f36", color: "white", width: "200px", textAlign: "center" }}>
      <h4>{node_type}</h4>
      {/* <div style={{ fontSize: "12px", color: "#aaa" }}>Inputs</div> */}
      {input_data.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`${id}-source-${index}`} 
          style={{ top: `${20 * index + 30}px`, background: "#555" }} 
        />
      ))}
    </div>
  );
};

export default InputNode;