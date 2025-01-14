// src/Pages/Maintenance.js
import React from "react";

function Maintenance() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>We’ll be right back!</h1>
      <p>
        Our application is currently undergoing maintenance. We appreciate your
        patience.
      </p>
      <img
        src="https://via.placeholder.com/400x200"
        alt="maintenance illustration"
        style={{ marginTop: "1rem" }}
      />
    </div>
  );
}

export default Maintenance;
