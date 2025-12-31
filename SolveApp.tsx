"use client";

import React, { useState } from "react";

export default function SolveApp() {
  const [form, setForm] = useState({
    problema: "",
    ubicacion: "",
    como: "",
    cuando: "",
    quien: "",
    quePaso: "",
  });
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError(null);

    try {
      // Usa el endpoint mock. Si quieres usar OpenAI real, cambia la URL a /analizar-problema
      const res = await fetch("http://127.0.0.1:8000/analizar-problema-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la petición");
      }

      const data = await res.json();
      setResultado(data.analisis);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analizar Problema (Demo)</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="problema" placeholder="Problema" value={form.problema} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="como" placeholder="Cómo ocurrió" value={form.como} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="cuando" placeholder="Cuándo" value={form.cuando} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="quien" placeholder="Quién" value={form.quien} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="quePaso" placeholder="Qué pasó" value={form.quePaso} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Analizando..." : "Analizar"}
          </button>
          <button type="button" onClick={() => { setForm({ problema: "", ubicacion: "", como: "", cuando: "", quien: "", quePaso: "" }); setResultado(null); setError(null); }} className="px-4 py-2 border rounded">
            Limpiar
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      {resultado && (
        <div className="mt-6 p-4 bg-gray-50 border rounded">
          <h2 className="font-semibold mb-2">Resultado</h2>
          <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
        </div>
      )}
    </main>
  );
}
