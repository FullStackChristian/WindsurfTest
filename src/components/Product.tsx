import Controls from "./Controls";
import SnakeGame from "./SnakeGame";

const Product = () => {
  return (
    <div className="flex gap-1">
      <Controls />
      <SnakeGame />
    </div>
  );
};

export default Product;
