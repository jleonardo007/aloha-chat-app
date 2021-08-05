import { useState, useEffect, useRef } from "react";
import socketClient from "../../socket-client";
import { createAudioBlob } from "./handlers";

export default function useRecorder(user, friend, controls, sendMessage, closeRecorder) {
  const [recordingState, setRecordingState] = useState({
    minutes: 0,
    seconds: 0,
    recordingMedia: null,
    content: "",
  });
  const sendButtonRef = useRef(null);

  useEffect(() => {
    let recordingInterval = null;
    const SECONDS_TO_EMIT_ACTION = 3;

    recordingInterval = setInterval(() => {
      setRecordingState((prevState) => {
        if (prevState.minutes === 0 && prevState.seconds === 59) {
          return {
            ...prevState,
            minutes: 0,
            seconds: 0,
          };
        } else if (prevState.seconds >= 0 && prevState.seconds < 59) {
          return {
            ...prevState,
            seconds: prevState.seconds + 1,
          };
        } else
          return {
            ...prevState,
            minutes: prevState.minutes + 1,
            seconds: 0,
          };
      });
    }, 1000);

    if (recordingState.seconds % SECONDS_TO_EMIT_ACTION === 0)
      socketClient.emit("friend-actions", { user, friend, action: "Recording an audio..." });

    return () => {
      clearInterval(recordingInterval);
    };
  });

  useEffect(() => {
    if (recordingState.content) {
      sendMessage({
        content: recordingState.content,
        type: "voice-note",
        minutes: recordingState.minutes,
        seconds: recordingState.seconds,
      });
      closeRecorder(recordingState);
    }
  });

  useEffect(() => {
    if (recordingState.minutes === 0 && recordingState.seconds === 59)
      sendButtonRef.current.click();
  });

  useEffect(() => {
    let chunks = [];

    if (!recordingState.recordingMedia)
      setRecordingState((prevState) => {
        return {
          ...prevState,
          recordingMedia: new MediaRecorder(controls.mediaStream),
        };
      });
    else if (recordingState.recordingMedia.state === "inactive") {
      recordingState.recordingMedia.start();

      recordingState.recordingMedia.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recordingState.recordingMedia.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];

        setRecordingState((prevState) => {
          return {
            ...prevState,
            content: window.URL.createObjectURL(blob),
          };
        });
      };
    }

    return () => {
      if (recordingState.recordingMedia)
        recordingState.recordingMedia.stream.getAudioTracks().forEach((track) => track.stop());
    };
  }, [recordingState.recordingMedia, controls.mediaStream]);

  return {
    recordingState,
    sendButtonRef,
    createAudioBlob: () => createAudioBlob(recordingState),
  };
}
