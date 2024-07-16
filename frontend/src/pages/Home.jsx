import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New Room Is Created");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both the fields are required");
      return;
    }
    navigate(`editor/${roomId}`, {
      state: { username },
    });
    toast.success("Room is created successfully");
  };

  return (
    <section className="bg-[#171717] dark:bg-[#171717] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-[#1c1c1c] rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1c1c1c] dark:border-[#434343]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Enter The RoomID
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div className="inputGroup">
                <label
                  htmlFor="roomId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Room ID
                </label>
                <input
                  type="text"
                  name="roomId"
                  id="roomId"
                  className="bg-[#434343] border border-[#434343] text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#434343] dark:border-[#6d6d6d] dark:placeholder-[#9b9b9b] dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                  placeholder="Room ID"
                  required
                  onChange={(e) => setRoomId(e.target.value)}
                  value={roomId}
                />
              </div>
              <div className="inputGroup">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-[#434343] border border-[#434343] text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#434343] dark:border-[#6d6d6d] dark:placeholder-[#9b9b9b] dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div className="flex justify-center text-center items-center">
                <button
                  type="button"
                  className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={joinRoom}>
                  Join Room
                </button>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                If you don't have a RoomID then create&nbsp;
                <button
                  onClick={createNewRoom}
                  href=""
                  className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">
                  new room
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
