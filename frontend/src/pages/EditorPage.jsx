import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

import Client from "../components/Client";
import Editor from "../components/Editor";

import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { initSocket } from "../Socket.js";

const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const codeRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit("join", {
        roomId,
        username: Location.state?.username,
      });

      // Listen for new clients joining the chatroom
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        // this insure that new user connected message do not display to that user itself
        if (username !== Location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        // also send the code to sync
        socketRef.current.emit("sync-code", {
          code: codeRef.current,
          socketId,
        });
      });

      // listening for disconnected
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    // cleanup
    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`roomIs is copied`);
    } catch (error) {
      console.log(error);
      toast.error("unable to copy the room Id");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };
  return (
    <div className="flex h-screen">
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto bg-[#171717]"
        aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#171717]">
          <div className="logo flex justify-center mb-4">
            <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl dark:text-white">
              CodeCollab
            </h1>
          </div>
          <h3 className="text-gray-900 dark:text-white mb-4">Connected</h3>
          <div className="clientsList space-y-2 ">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <div className="mt-4">
            <button
              className="font-bold absolute bottom-4 left-0 btn copyBtn w-full p-2 text-sm text-gray-900 bg-[#da0037] rounded-lg dark:bg-[#da0037]  dark:text-white hover:bg-[#a20026] dark:hover:bg-[#a20026]"
              onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button
              className="font-bold absolute bottom-20 left-0 btn copyBtn w-full p-2 text-sm text-gray-900 bg-[#da0037] rounded-lg dark:bg-[#da0037]  dark:text-white hover:bg-[#a20026] dark:hover:bg-[#a20026]"
              onClick={leaveRoom}>
              Leave
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-64 text-white flex flex-col h-full">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
