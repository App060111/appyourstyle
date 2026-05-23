"use client";

import { useState } from "react";

export default function AISearchPage() {

  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const runAI = async () => {

    setLoading(true);

    try {

      const response = await fetch("/api/appyourstyle_ai_endpoint", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          user: {
            gender: "male",
            height_cm: 184,
            weight_kg: 82,
            body_shape: "athletic",
            fit_preference: "slim relaxed",
            style: [
              "luxury streetwear",
              "minimal",
              "monochrome"
            ]
          },

          items: [

            {
              type: "hoodie",
              brand: "Nike",
              store: "Nike",
              size_selected: "M"
            },

            {
              type: "pants",
              brand: "Zara",
              store: "Zara",
              size_selected: "32"
            },

            {
              type: "sneakers",
              brand: "New Balance",
              store: "New Balance",
              size_selected: "44"
            }

          ]

        }),

      });

      const data = await response.json();

      setAiResult(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        minHeight: "100vh",
        background: "#f5f5f5"
      }}
    >

      <h1
        style={{
          fontSize: "48px",
          fontWeight: "900"
        }}
      >
        AppYourStyle AI
      </h1>

      <p
        style={{
          marginBottom: "30px"
        }}
      >
        KI-basierte Größen- und Outfitanalyse
      </p>

      <button
        onClick={runAI}
        style={{
          padding: "16px 28px",
          border: "none",
          borderRadius: "14px",
          background: "black",
          color: "white",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >

        {loading
          ? "KI analysiert..."
          : "KI starten"}

      </button>

      {aiResult && (

        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "24px",
            borderRadius: "20px"
          }}
        >

          <h2>KI Ergebnis</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap"
            }}
          >
            {JSON.stringify(aiResult, null, 2)}
          </pre>

        </div>

      )}

    </div>

  );

}
