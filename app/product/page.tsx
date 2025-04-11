"use client";

import React, { useEffect } from "react";
import { useState } from "react"; // hooks

function Products() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {}, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <center>
        <button
          onClick={() => {
            setLoading(!isLoading);
          }}
        >
          <h1>{isLoading ? "Loading ..." : "Done"}</h1>
        </button>
      </center>
    </div>
  );
}

export default Products;
