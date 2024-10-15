import React, { useState, useRef, useCallback } from "react";

const VideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(URL.createObjectURL(blob));
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "100%", maxWidth: "500px" }}
      />
      {recordedVideo && (
        <video
          src={recordedVideo}
          controls
          style={{ width: "100%", maxWidth: "500px" }}
        />
      )}
      <div>
        {!isRecording && (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {isRecording && <button onClick={stopRecording}>Stop Recording</button>}
      </div>
    </div>
  );
};

export default VideoScreen;
