import { useState, useEffect } from "react";
import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";
import { getFriend } from "./handlers";

export function useActiveUsers(currentFriend, dispatch) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      testSocket.on("test:active-users", (users) => {
        setActiveUsers(users);
      });
    } else {
      socketClient.emit("get:active-users");
      socketClient.on("get:active-users", (users) => {
        setActiveUsers(users.filter((user) => user.id !== socketClient.id));
      });
    }
    return () => {
      if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:active-users");
      else socketClient.off("get:active-users");
    };
  }, [currentFriend]);

  return {
    activeUsers,
    getFriend: (user) => getFriend(user, dispatch),
  };
}

export function useNewMessagesCounter(user, activeUser, currentFriend) {
  const [counter, setCounter] = useState(() =>
    localStorage.getItem(`${user.id}_${activeUser.id}` || 0)
  );

  useEffect(() => {
    if (currentFriend)
      socketClient.on("new-messages-counter", (friend) => {
        if (activeUser.id === friend.id && currentFriend.id !== friend.id)
          setCounter((prevState) => prevState + 1);
      });
    else
      socketClient.on("new-messages-counter", (friend) => {
        if (activeUser.id === friend.id) setCounter((prevState) => prevState + 1);
      });

    return () => {
      socketClient.off("new-messages-counter");
    };
  }, [activeUser, currentFriend]);

  return {
    counter,
    resetCounter: () => setCounter(0),
  };
}
