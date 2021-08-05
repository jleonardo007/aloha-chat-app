import { useState, useEffect } from "react";
import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

export default function useTextMessage(message) {
  const [textMessageState, setTextMessageState] = useState({
    seenByFriend: false,
    hours: null,
    minutes: null,
  });

  useEffect(() => {
    const currentDate = Date.now();
    let currentHours = null;
    let currentMinutes = null;

    if (!message.time.hours && !message.time.minutes) {
      currentHours = `${
        new Date(currentDate).getHours() >= 10
          ? new Date(currentDate).getHours()
          : `0${new Date(currentDate).getHours()}`
      }`;
      currentMinutes = `${
        new Date(currentDate).getMinutes() >= 10
          ? new Date(currentDate).getMinutes()
          : `0${new Date(currentDate).getMinutes()}`
      }`;

      setTextMessageState((prevState) => {
        message.time.hours = currentHours;
        message.time.minutes = currentMinutes;

        return {
          ...prevState,
          hours: currentHours,
          minutes: currentMinutes,
        };
      });
    }
  }, [message]);

  useEffect(() => {
    if (process.env.NODE_ENV === "test")
      testSocket.on("test:seen-messages", () => {
        setTextMessageState((prevState) => {
          message.seenByFriend = true;
          return {
            ...prevState,
            seenByFriend: true,
          };
        });
      });

    switch (message.status) {
      case "send":
        if (!message.seenByFriend)
          socketClient.on("seen-message", () => {
            setTextMessageState((prevState) => {
              message.seenByFriend = true;
              return {
                ...prevState,
                seenByFriend: true,
              };
            });
          });
        break;

      case "received":
        socketClient.emit("seen-message", message.from);
        break;

      default:
    }

    return () => {
      if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:seen-messages");
      socketClient.off("seen-message");
    };
  }, [message]);

  return textMessageState;
}
