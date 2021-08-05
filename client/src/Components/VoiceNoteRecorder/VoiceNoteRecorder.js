import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import socketClient from "../../socket-client";
import "./VoiceNoteRecorder.css";

function VoiceNoteRecorder({ user, friend, controls, setControls, handleSentMessage }) {
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
      handleSentMessage({
        content: recordingState.content,
        type: "voice-note",
        minutes: recordingState.minutes,
        seconds: recordingState.seconds,
      });
      handleCloseRecorder();
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

  function handleCloseRecorder() {
    if (recordingState.minutes === 0 && recordingState.seconds === 59)
      alert("Has reached max recording time");

    setControls((prevState) => {
      return {
        ...prevState,
        toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
      };
    });
  }

  function handleAudioBlob() {
    if (recordingState.recordingMedia.state !== "inactive") recordingState.recordingMedia.stop();
  }

  return (
    <div className="recorder-container">
      <div className="recorder-btn-container">
        <button className="cancel-recorder-btn" onClick={() => handleCloseRecorder()}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      </div>
      <div className="recording-time">
        <div className="recording-animation"></div>
        <div className="recording-time-label">
          <p>
            <span className="recording-minutes">
              {recordingState.minutes < 10
                ? `0${recordingState.minutes}`
                : `${recordingState.minutes}`}
            </span>
            :
            <span className="recording-seconds">
              {recordingState.seconds < 10
                ? `0${recordingState.seconds}`
                : `${recordingState.seconds}`}
            </span>
          </p>
        </div>
      </div>
      <div className="recorder-btn-container">
        <button className="send-voice-note-btn" onClick={handleAudioBlob} ref={sendButtonRef}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
      </div>
    </div>
  );
}

export default VoiceNoteRecorder;
