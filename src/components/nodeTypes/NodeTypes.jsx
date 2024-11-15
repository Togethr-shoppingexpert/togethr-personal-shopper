import InputNode from "./InputNode";
import LLMNode from "./LLMNode";
import RAGNode from "./RAGNode"

const NodeTypes = {
  inputNode: InputNode,
  ragNode: RAGNode,
  llmNode: LLMNode,
};

export default NodeTypes;