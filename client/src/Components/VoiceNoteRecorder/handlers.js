export function createAudioBlob(recordingState) {
  if (recordingState.recordingMedia.state !== "inactive") recordingState.recordingMedia.stop();
}
