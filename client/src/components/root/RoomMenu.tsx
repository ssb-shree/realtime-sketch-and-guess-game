import React from "react";

const RoomMenu = () => {
  return (
    <div className="h-full w-full md:w-[70%] flex flex-col justify-start items-start p-2 ">
      <div className="mt-4 h-full w-full">
        <span className="capitalize">Active Rooms</span>
        <div className="h-full w-full flex flex-col justify-start items-center gap-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-2 w-full p-2 flex flex-row justify-between items-center rounded-2xl">
              <span>RoomID</span>
              <span className="border-l-2 p-1">Status</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomMenu;
