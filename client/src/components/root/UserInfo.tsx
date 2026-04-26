import React from "react";

const UserInfo = () => {
  return (
    <div className="md:w-[30%] border-2 rounded-3xl p-6 flex flex-col space-y-8 mt-10 md:mt-0">
      {/* Hero Text */}
      <div className="text-center space-y-2 bg-base-200 rounded-xl p-3">
        <h1 className="text-2xl font-semibold">Draw like a genius.</h1>
        <p className="text-zinc-500">Or don't. Just make them guess.</p>
      </div>

      {/* Form */}
      <form className="w-full flex flex-col space-y-3">
        {/* Username */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-sm">
            Name Yourself
          </label>
          <input type="text" name="username" id="username" placeholder="Here Bredrin" className="input w-full" />
        </div>

        {/* Room ID */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="roomId">Create a Room ID</label>
          <input type="text" name="roomId" id="roomId" className="input w-full" placeholder="6769"/>
        </div>

        {/* Submit */}
        <button type="submit" className="btn bg-base-100">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default UserInfo;
