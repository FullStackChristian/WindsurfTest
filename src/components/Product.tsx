import Controls from "./Controls";
import SnakeGame from "./SnakeGame";

const Product = () => {
  return (
    <div className="lg:flex gap-1">
      <Controls />
      <SnakeGame />
    </div>
  );
};

export default Product;
