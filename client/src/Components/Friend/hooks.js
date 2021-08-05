import { useState, useEffect } from "react";
import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

export default function useFriendActions(friend) {
  const [action, setAction] = useState("");

  useEffect(() => {
    document.title = friend.name;
    if (process.env.NODE_ENV === "test")
      testSocket.on("test:friend-actions", (action) => {
        setAction(action);
      });
    else
      socketClient.on("friend-actions", ({ friendId, action }) => {
        if (friend.id === friendId) setAction(action);
      });

    return () => {
      document.title = "";
      if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:friend-actions");
      else socketClient.off("friend-actions");
    };
  }, [friend]);

  useEffect(() => {
    let timeout = null;

    if (action)
      timeout = setTimeout(() => {
        setAction(() => "");
      }, 2000);

    return () => clearInterval(timeout);
  });

  return action;
}
