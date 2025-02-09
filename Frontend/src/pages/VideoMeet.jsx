import React, { useRef, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material"; // Import required components
import "../styles/VideoComponent.css";

const server_url = "http://localhost:8000"; // Server URL for socket connection
var connections = {}; // Object to store peer connections

const peerConfigConnections = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }], // STUN server configuration for WebRTC
};

function VideoMeet() {
  var socketRef = useRef(); // Ref to store the socket connection
  const socketIdRef = useRef(); // Ref to store the socket ID
  const localVideoRef = useRef(null); // Ref to store local video stream
  const videoRef = useRef([]); // Ref to store multiple video streams

  // State variables
  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState(false); // Default value set
  let [audio, setAudio] = useState(false);
  let [screenShare, setScreenShare] = useState(false);
  let [showModal, setModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState(false);
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState(""); // Default value set
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState(""); // Default value set
  let [videos, setVideos] = useState([]);

  // Function to get permissions for audio and video
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }
      // To check browser support screen sharing or not.
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {};

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.foreach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    // connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div>
      {askForUsername ? (
        <div>
          <h2>Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          {/*  Video Element to Display Camera Feed */}
          <div>
            <video ref={localVideoRef } style={{height:"30rem" , width:"90rem"}} autoPlay muted></video>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default VideoMeet;
