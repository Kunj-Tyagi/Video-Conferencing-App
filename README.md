# Video Conferencing App

A full-stack video conferencing application built with **React**, **Socket.IO**, **WebRTC**, and **Node.js**. This app allows users to join video meetings, chat in real-time, share screens, and manage audio/video streams.

---

## Features

- **Lobby System:** Users enter a username to join a meeting.
- **Real-Time Video & Audio:** Peer-to-peer video/audio using WebRTC.
- **Screen Sharing:** Share your screen with other participants.
- **Chat:** Real-time chat with all meeting participants.
- **User Presence:** See when users join or leave.
- **Mute/Unmute & Video On/Off:** Toggle your audio/video streams.
- **End Call:** Leave the meeting and stop all media streams.

---

## Tech Stack

- **Frontend:** React, Material-UI, Socket.IO-client, WebRTC
- **Backend:** Node.js, Express, Socket.IO
- **Signaling:** Socket.IO for signaling between peers
- **Media:** WebRTC for direct peer-to-peer media

---

## Folder Structure

```
/Backend
  /src
    controllers/
      socketmanager.js
    server.js

/Frontend
  /src
    pages/
      videomeet.jsx
      landing.jsx
      authentication.jsx
    styles/
      VideoComponent.module.css
      VideoComponent.css
    App.css
    App.js
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/your-repository.git
cd Video-Conferencing-App
```

### 2. Install Dependencies

#### Backend

```sh
cd Backend
npm install
```

#### Frontend

```sh
cd ../Frontend
npm install
```

### 3. Start the Servers

#### Backend

```sh
cd Backend
npm start
```
By default, the backend runs on `http://localhost:8000`.

#### Frontend

```sh
cd ../Frontend
npm start
```
By default, the frontend runs on `http://localhost:3000`.

---

## Usage

1. **Open the app** in your browser at `http://localhost:3000`.
2. **Enter a username** in the lobby and click **Connect**.
3. **Allow camera and microphone access** when prompted.
4. **Interact** with other users:  
   - Toggle video/audio  
   - Share your screen  
   - Chat in real-time  
   - End the call to leave the meeting

---

## Code Overview

### Frontend (`videomeet.jsx`)

- **Media Permissions:** Uses `navigator.mediaDevices.getUserMedia` for camera/mic and `getDisplayMedia` for screen sharing.
- **Socket Connection:** Connects to the backend using Socket.IO, handles signaling for WebRTC peer connections.
- **Peer Management:** Manages multiple peer connections for group calls.
- **UI Controls:** Material-UI buttons for toggling video/audio, screen sharing, chat, and ending the call.
- **Chat:** Real-time chat using Socket.IO events.

### Backend (`socketmanager.js`)

- **Socket.IO Server:** Handles user connections, signaling, chat messages, and user presence.
- **Room Management:** Tracks users in each meeting room and relays messages/signals.
- **Chat History:** Sends chat history to new users joining a room.

---

## Environment Variables

- **Frontend:**  
  Update `server` in `environment.js` to match your backend URL if needed.

- **Backend:**  
  You can configure the port and CORS settings in `server.js` and `socketmanager.js`.

---

## Troubleshooting

- **Video/Audio Not Working:**  
  Ensure you allow browser permissions for camera and microphone.
- **Socket Connection Issues:**  
  Make sure both frontend and backend servers are running and CORS is configured.
- **Screen Sharing Not Available:**  
  Some browsers or devices may not support `getDisplayMedia`.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [WebRTC](https://webrtc.org/)
- [Material-UI](https://mui.com/)
