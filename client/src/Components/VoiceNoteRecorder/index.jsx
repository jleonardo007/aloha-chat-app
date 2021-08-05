import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useRecorder from "./hooks";
import "./styles.css";

export default function VoiceNoteRecorder({ user, friend, controls, sendMessage, closeRecorder }) {
  const { recordingState, sendButtonRef, createAudioBlob } = useRecorder(
    user,
    friend,
    controls,
    sendMessage,
    closeRecorder
  );

  return (
    <div className="recorder-container">
      <div className="recorder-btn-container">
        <button className="cancel-recorder-btn" onClick={() => closeRecorder(recordingState)}>
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
        <button className="send-voice-note-btn" onClick={createAudioBlob} ref={sendButtonRef}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
      </div>
    </div>
  );
}
