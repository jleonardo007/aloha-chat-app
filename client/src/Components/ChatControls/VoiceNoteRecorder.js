import { useState, useEffect } from "react";

import { GiCancel, GiConfirmed } from "react-icons/gi";

function VoiceNoteRecorder({
	user,
	friend,
	controls,
	setControls,
	chatConfigObject,
	handleSentMessage,
}) {
	const [recordingState, setRecordingState] = useState({
		minutes: 0,
		seconds: 0,
		startRecording: false,
		recordingMedia: null,
	});

	useEffect(() => {
		let recordingInterval = null;

		recordingInterval = setInterval(() => {
			setRecordingState((prevState) => {
				if (prevState.minutes === 15)
					return {
						...prevState,
						minutes: 0,
						seconds: 0,
					};
				else if (prevState.seconds >= 0 && prevState.seconds < 59) {
					return {
						...prevState,
						seconds: prevState.seconds + 1,
						startRecording: true,
					};
				} else
					return {
						...prevState,
						minutes: prevState.minutes + 1,
						seconds: 0,
					};
			});
		}, 1000);

		return () => {
			clearInterval(recordingInterval);
		};
	});

	// eslint-disable-next-line
	useEffect(() => {
		let chunks = [];

		if (!recordingState.startRecording)
			setRecordingState((prevState) => {
				return {
					...prevState,
					recordingMedia: new MediaRecorder(controls.mediaStream),
				};
			});
		else recordingState.recordingMedia.start();

		if (recordingState.recordingMedia) {
			recordingState.recordingMedia.ondataavailable = (e) => {
				chunks.push(e.data);
			};

			recordingState.recordingMedia.onstop = (e) => {
				const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
				const voiceNoteURL = window.URL.createObjectURL(blob);
				chunks = [];

				handleSentMessage({ content: voiceNoteURL, type: "voice-note" });
			};
		}

		/* return () => {
			if (recordingState.startRecording)
				recordingState.recordingMedia.stream.getAudioTracks().forEach((track) => track.stop());
		}; */
	}, [recordingState.startRecording]);

	function handleCancelRecording() {
		setControls((prevState) => {
			return {
				...prevState,
				toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
			};
		});
	}

	function handleSendVoiceNote() {
		recordingState.recordingMedia.stop();
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
				<button className="send-voice-note-btn" onClick={() => handleSendVoiceNote()}>
					<GiConfirmed />
				</button>
			</div>
		</div>
	);
}

export default VoiceNoteRecorder;
