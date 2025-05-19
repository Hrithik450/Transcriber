"use client";
import { useGameStore } from "@/store/store";
import Square from "./Square";

function Board() {
  const { squares, setSquares } = useGameStore();

  const handleSquareClick = () => {
    return;
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 max-w-2xl max-h-2xl mx-auto">
      {squares.map((square, squareIndex) => (
        <Square
          key={squareIndex}
          value={square}
          onSquareClick={handleSquareClick}
        />
      ))}
    </div>
  );
}

export default Board;
