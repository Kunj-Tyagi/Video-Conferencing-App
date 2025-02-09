import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function LandingPages() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Apna Video Call</h2>
        </div>
        <div className="navlist">
          <p>Join Guest</p>
          <p>Register</p>
          <div role="button">
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
