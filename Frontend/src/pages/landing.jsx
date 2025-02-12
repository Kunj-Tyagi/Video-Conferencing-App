import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LandingPages() {
  const router = useNavigate();
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Apna Video Call</h2>
        </div>
        <div className="navlist">
          <p onClick={()=>{router("jnsndi7")}}>Join as Guest</p>
          <p onClick={()=>{router("/auth")}}>Register</p>
          <div onClick={()=>{router("/auth")}} role="button">
            <p>Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your loved
            once
          </h1>

          <p style={{ fontSize: "1.4rem" }}>
            Cover a distance by Apna Video Call
          </p>
          <div role="button">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt=""></img>
        </div>
      </div>
    </div>
  );
}
