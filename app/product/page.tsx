"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react"; // hooks
import { Button } from "@/components/ui/button";

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
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setLoading(!isLoading);
          }}
        >
          <h1>{isLoading ? "Loading ..." : "Done"}</h1>
        </Button>
      </center>
    </div>
  );
}

export default Products;
