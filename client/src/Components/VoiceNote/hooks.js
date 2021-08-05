import { useState, useEffect, useRef } from "react";
import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";
import { playVoiceNoteButton } from "./handlers";

export default function useVoiceNote(message) {
  const initialState = {
    toggleButton: false,
    seenByFriend: false,
    minutes: message.duration.minutes,
    seconds: message.duration.seconds,
  };
  const voiceNoteRef = useRef(null);
  const progressBarRef = useRef(null);
  const [voiceNoteState, setVoiceNoteState] = useState(initialState);

  useEffect(() => {
    let interval = null;
    const audio = voiceNoteRef.current;
    const audioEventHandler = () => {
      progressBarRef.current.style.marginLeft = 0;
      setVoiceNoteState(initialState);
    };

    if (voiceNoteState.toggleButton)
      interval = setInterval(() => {
        setVoiceNoteState((prevState) => {
          if (prevState.seconds > 0 && prevState.seconds <= 59)
            return {
              ...prevState,
              seconds: prevState.seconds - 1,
            };
          else if (prevState.seconds === 0)
            return {
              ...prevState,
              minutes: prevState.minutes - 1,
              seconds: 59,
            };
          else if (prevState.minutes < 0) {
            clearInterval(interval);
            return prevState;
          }
        });
      }, 1000);
    else clearInterval(interval);

    audio.addEventListener("ended", audioEventHandler);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", audioEventHandler);
    };
  });

  useEffect(() => {
    const DURATION_IN_SECONDS = 60 * message.duration.minutes + message.duration.seconds;
    let currentTimeInSeconds = 0;
    let progressBarMargin = 0;

    if (voiceNoteState.toggleButton) {
      currentTimeInSeconds = 60 * voiceNoteState.minutes + voiceNoteState.seconds;
      progressBarMargin = (1 - currentTimeInSeconds / DURATION_IN_SECONDS) * 100;
      progressBarRef.current.style.marginLeft = `${progressBarMargin}%`;
    }
  });

  useEffect(() => {
    if (voiceNoteState.toggleButton) voiceNoteRef.current.play();
    else voiceNoteRef.current.pause();
  }, [voiceNoteState.toggleButton]);

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

      message.time.hours = currentHours;
      message.time.minutes = currentMinutes;
    }
  }, [message]);

  useEffect(() => {
    if (process.env.NODE_ENV === "test")
      testSocket.on("test:seen-messages", () => {
        setVoiceNoteState((prevState) => {
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
            setVoiceNoteState((prevState) => {
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
      socketClient.off("seen-messages");
    };
  }, [message]);

  return {
    voiceNoteState,
    voiceNoteRef,
    progressBarRef,
    playVoiceNoteButton: () => playVoiceNoteButton(setVoiceNoteState),
  };
}
