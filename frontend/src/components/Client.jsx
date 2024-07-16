import React from "react";
import Avatar from "react-avatar";
function Client({ username }) {
  return (
    <div className="flex items-center">
      <Avatar name={username.toString()} size={60} round="14px" />
      <span className="pl-4 text-base text-gray-900 dark:text-white">
        {username.toString()}
      </span>
    </div>
  );
}

export default Client;
