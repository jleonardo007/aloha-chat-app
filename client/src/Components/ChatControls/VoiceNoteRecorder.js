import { GiCancel, GiConfirmed } from "react-icons/gi";

function VoiceNoteRecorder({
	user,
	friend,
	controls,
	setControls,
	chatConfigObject,
	handleSentMessage,
}) {
	function handleCancelRecording() {
		setControls((prevState) => {
			return {
				...prevState,
				toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
			};
		});
	}

	function handleSendVoiceNote() {
		handleSentMessage(controls.messageContent);
		handleCancelRecording();
	}

	return (
		<div className="recorder-container">
			<div className="recorder-btn-container">
				<button className="cancel-recorder-btn" onClick={() => handleCancelRecording()}>
					<GiCancel />
				</button>
			</div>
			<div className="recording-time">
				<div className="recording-animation"></div>
				<div className="recording-time-label">
					<p>
						<span className="recording-minutes">00</span>:
						<span className="recording-seconds">00</span>
					</p>
				</div>
			</div>
			<div className="recorder-btn-container">
				<button className="send-voice-note-btn" onClick={() => handleSendVoiceNote()}>
					<GiConfirmed />
				</button>
			</div>
		</div>
	);
}

export default VoiceNoteRecorder;
