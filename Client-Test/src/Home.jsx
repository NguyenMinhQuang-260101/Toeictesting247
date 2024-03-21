import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";

import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

const getGoogleAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env;
  const url = `https://accounts.google.com/o/oauth2/v2/auth`;
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    prompt: "consent",
    access_type: "offline",
  };
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
};

const googleOAuthUrl = getGoogleAuthUrl();

export default function Home() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.reload();
  };

  return (
    <>
      <div>
        <span>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </span>
        <span>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </span>
      </div>

      <h2>Audio</h2>
      <audio controls>
        <source
          src="http://localhost:4000/static/audio-stream/68f7843e9250686884474ea00.m4a"
          type="audio/mpeg"
        />
      </audio>

      <h2>Video Streaming</h2>
      <video controls width={500}>
        <source
          src="http://localhost:4000/static/video-stream/c2d935d61f13619df86291e00.mp4"
          type="video/mp4"
        />
      </video>

      <h2>HLS Streaming</h2>
      <MediaPlayer
        title="Sprite Fight"
        // src="http://localhost:4000/static/video-hls/a0qP4aqlpHEpr1_9ZRzcr/master.m3u8"
        src="http://localhost:4000/static/video-hls/RulOLcSBrLR0X6ZJm_lfo/master.m3u8"
        aspectRatio={16 / 9}
      >
        <MediaProvider />
        <PlyrLayout
          // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
          icons={plyrLayoutIcons}
        />
      </MediaPlayer>

      <h1>Google OAuth 2.0</h1>
      <p className="read-the-docs">
        {isAuthenticated ? (
          <>
            {" "}
            <span>
              Hello my <strong>{profile.email}</strong>, you are logged in.
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to={googleOAuthUrl}>Login with Google</Link>
        )}
      </p>
    </>
  );
}
