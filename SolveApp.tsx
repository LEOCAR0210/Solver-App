"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SolveApp() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/problems") // Endpoint de FastAPI
      .then((response) => response.json())
      .then((data) => setProblems(data))
      .catch((error) => console.error("Error al obtener problemas:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary">Solve-App</h1>
      <h2 className="text-xl mt-4">Lista de Problemas</h2>
      <ul className="mt-2">
        {problems.map((problem) => (
          <li key={problem.id} className="p-2 border rounded-lg">
            {problem.title} - {problem.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
