import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div>
      <Toaster position="top-center"></Toaster>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/editor/:roomId" element={<EditorPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
