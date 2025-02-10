import React, { useRef, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material"; // Import required components
import "../styles/VideoComponent.css";
import { io } from "socket.io-client"; // Import Socket.IO client

const server_url = "http://localhost:8000"; // Server URL for socket connection
var connections = {}; // Object to store peer connections

// STUN server configuration for WebRTC (used to establish peer connections)
const peerConfigConnections = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
};

function VideoMeet() {
  var socketRef = useRef(); // Store socket connection reference
  const socketIdRef = useRef(); // Store socket ID
  const localVideoRef = useRef(null); // Reference for the local video element
  const videoRef = useRef([]); // Store multiple video streams for remote participants

  // State variables
  let [videoAvailable, setVideoAvailable] = useState(true); // Track video permission
  let [audioAvailable, setAudioAvailable] = useState(true); // Track audio permission
  let [video, setVideo] = useState([]); // Store video streams
  let [audio, setAudio] = useState(); // Store audio state
  let [screenShare, setScreenShare] = useState(false); // Track screen sharing
  let [showModal, setModal] = useState(false); // Track modal visibility
  let [screenAvailable, setScreenAvailable] = useState(false); // Check if screen sharing is available
  let [messages, setMessages] = useState([]); // Store chat messages
  let [message, setMessage] = useState(""); // Current chat message
  let [newMessages, setNewMessages] = useState(0); // Track new message count
  let [askForUsername, setAskForUsername] = useState(true); // Ask user for a username before connecting
  let [username, setUsername] = useState(""); // Store entered username
  let [videos, setVideos] = useState([]); // Store video streams for rendering

  // Function to get permissions for camera and microphone
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

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

  // Run getPermissions on component mount
  useEffect(() => {
    getPermissions();
  }, []);

  // Function to handle user media stream success
  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch {
      console.log("Error stopping media:", e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log("Error stopping media:", e);
          }
          //   TODO: BlackSilence

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();

    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  // Function to start or stop media stream
  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log("Error getting user media:", e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop()); // Stop all tracks if no media is available
      } catch (e) {
        console.log("Error stopping media:", e);
      }
    }
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  }; // Handle incoming messages from server

  let addMessage = (data) => {}; // Function to handle chat messages

  // Function to establish a socket connection with the server
  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    // Listen for incoming signals
    socketRef.current.on("signal", gotMessageFromServer);

    // When connected, send join request
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      // Handle chat messages
      socketRef.current.on("chat-message", addMessage);

      // Handle user disconnection
      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      // Handle new user joining
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          // Create a new WebRTC connection for each participant
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          // Send ICE candidates to the peer
          connections[socketListId].onicecandidate = (e) => {
            if (e.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: e.candidate })
              );
            }
          };

          // Add the remote stream when received
          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Add local stream to peer connection
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log("Error adding stream:", e);
            }

            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ " sdp": connections[id2].localDescription })
                );
              });
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
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

          {/* Video Element to Display Local Camera Feed */}
          <div>
            <video
              ref={localVideoRef}
              style={{ height: "30rem", width: "90rem" }}
              autoPlay
              muted
            ></video>
          </div>
        </div>
      ) : (
        <>
          <video ref={localVideoRef} autoPlay>
            {" "}
          </video>
          {videos.map((video) => (
            <div key={video.socketId}>
              <h2>{video.socketId}</h2>
              <video

                data-socket={video.socketId}
                ref={ref=>{
                     if(ref && video.stream){
                        ref.srcObject = video.stream;
                    }
                }}
                autoPlay>
              </video>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default VideoMeet;
