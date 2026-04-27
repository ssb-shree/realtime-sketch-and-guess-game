"use client";

import { RoomType } from "@/app/game/[roomID]/page";
import { Socket } from "socket.io-client";

import { useRef, useState } from "react";

import KonvaCanvas, { LineType } from "@/components/KonvaCanvas";

export const COLOR_NAMES = ["black", "white", "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown"];
export const BRUSH_SIZES = [
  { name: "thin", value: 2 },
  { name: "small", value: 4 },
  { name: "medium", value: 6 },
  { name: "thick", value: 10 },
  { name: "huge", value: 16 },
];

const Canvas = ({ socket, roomData }: { socket: Socket; roomData: RoomType }) => {
  const [globalCanvasState, setGlobalCanvasState] = useState<LineType[]>([]);

  const [brushOptions, setBrushOptions] = useState<{ color: string; size: number }>({
    color: COLOR_NAMES[0],
    size: BRUSH_SIZES[1].value,
  });

  const handleCanvasChange = (canvasState: LineType[]) => {
    // todo n algo below
    // here write the logic according to the game
    // if taking turn thenn only emit dont set
    // if not taking turn and only listen and set and dont emit
    setGlobalCanvasState(canvasState);
  };

  return (
    <div className="h-full w-full md:w-[50%] p-1 flex flex-col justify-center items-center">
      <span>Word to be guessed here</span>
      <div className="h-[60vh] md:h-[80%] w-full overflow-hidden rounded-3xl">
        <KonvaCanvas
          onChange={(c) => handleCanvasChange(c)}
          externalState={globalCanvasState}
          brushColor={brushOptions.color}
          brushSize={brushOptions.size}
          backgroundColor="#ffffff"
        />
      </div>
      <div className="w-full flex flex-col space-y-2 justify-center items-start">
        <span>Canvas Controls</span>

        {/* COLORS CONTROL */}

        <div className="w-full flex flex-wrap justify-start items-start space-x-5">
          {COLOR_NAMES.map((c) => (
            <span
              key={c}
              className="size-4 p-1 cursor-pointer"
              style={{ backgroundColor: c }}
              onClick={() => setBrushOptions((p) => ({ ...p, color: c }))}
            ></span>
          ))}
        </div>
        {/* BRUSH RADIUS CONTROL */}

        <div className="w-full flex flex-wrap justify-start items-start space-x-5">
          {BRUSH_SIZES.map((s) => (
            <button className="btn cursor-pointer" key={s.value} onClick={() => setBrushOptions((p) => ({ ...p, size: s.value }))}>
              {s.name}
            </button>
          ))}
        </div>
        {/* CLEAR CANVAS BUTTON  */}
      </div>
    </div>
  );
};

export default Canvas;
