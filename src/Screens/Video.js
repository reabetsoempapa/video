import React, { useState, useRef, useCallback } from "react";
import { Button } from "reactstrap";
import RandomInterviewQuestionDisplay from "../Components/PopUp";
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
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }, []);

  const handleRetry = useCallback(() => {
    setRecordedVideo(null);
    startRecording();
  }, [startRecording]);

  return (
    <div>
      {!recordedVideo ? (
        <>
          <div className="VideoContainer">
            <div className="VideoFrame">
              <RandomInterviewQuestionDisplay />
              <video ref={videoRef} autoPlay muted />
              <div>
                {!isRecording && (
                  <Button onClick={startRecording}>Start Recording</Button>
                )}
                {isRecording && (
                  <Button onClick={stopRecording}>Stop Recording</Button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h3>Recorded Video:</h3>
          <video src={recordedVideo} controls />
          <div>
            <Button onClick={handleRetry}>Restart</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoScreen;
