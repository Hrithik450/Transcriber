import { Button } from "./ui/button";

interface SquareProps {
  value: string;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <Button
      className="h-20 border border-gray-500 cursor-pointer"
      onClick={onSquareClick}
    >
      {value}
    </Button>
  );
}

export default Square;
