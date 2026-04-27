"use client";

import { Stage, Layer, Line, Rect } from "react-konva";
import { useEffect, useRef, useState } from "react";

export type LineType = {
  points: number[];
  color: string;
  width: number;
};

type CanvasProps = {
  brushColor?: string;
  brushSize?: number;
  backgroundColor?: string;
  disabled?: boolean;
  onChange?: (lines: LineType[]) => void;
  externalState?: LineType[]; // for updateState
};

const KonvaCanvas = ({
  brushColor = "black",
  brushSize = 5,
  backgroundColor = "#ffffff",
  disabled = false,
  onChange,
  externalState,
}: CanvasProps) => {
  const [lines, setLines] = useState<LineType[]>([]);
  const isDrawing = useRef(false);

  const WIDTH = 800;
  const HEIGHT = 500;

  // 🔄 update from external state
  useEffect(() => {
    if (externalState) {
      setLines(externalState);
    }
  }, [externalState]);

  const handleMouseDown = (e: any) => {
    if (disabled) return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();

    setLines((prev) => [...prev, { points: [pos.x, pos.y], color: brushColor, width: brushSize }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || disabled) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };

      const newLines = [...prev.slice(0, -1), updatedLine];

      onChange?.(newLines); // 🔥 emit state

      return newLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={WIDTH}
      height={HEIGHT}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      style={{ touchAction: "none" }}
      className="border-2 rounded-xl"
    >
      <Layer>
        <Rect x={0} y={0} width={WIDTH} height={HEIGHT} fill={backgroundColor} />

        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke={line.color}
            strokeWidth={line.width}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default KonvaCanvas;
