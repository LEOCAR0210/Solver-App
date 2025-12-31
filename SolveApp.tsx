"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

type Problem = {
  id: string;
  title: string;
  status: string;
  created_at?: string;
};

type SolveResponse = {
  id: string;
  content: string[];
  summary?: string;
};

export default function SolveApp() {
  // Lista de problemas previos
  const [problems, setProblems] = useState<Problem[]>([]);
  // Estado para la sesión de solución actual
  const [solution, setSolution] = useState<SolveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamingRef = useRef<HTMLDivElement | null>(null);

  // Formulario para nuevo problema
  const { register, handleSubmit, reset } = useForm<{ title: string; description: string; type: string }>();

  useEffect(() => {
    // Carga problemas guardados (usa endpoint relativo /api/problems; configurar rewrites en next.config.mjs)
    fetch("/api/problems")
      .then((r) => r.json())
      .then((data) => setProblems(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error("No se pudieron cargar problemas:", e);
        // no bloquear la UX
      });
  }, []);

  // Envía el problema para generar una solución (backend debe ofrecer /api/solve o proxied)
  const onSubmit = async (formData: { title: string; description: string; type: string }) => {
    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la petición al servidor");
      }

      // Supongamos backend devuelve { id, content: [step1, step2, ...], summary }
      const data: SolveResponse = await res.json();
      setSolution(data);
      // agregar a lista local (optimista)
      setProblems((prev) => [{ id: data.id, title: formData.title, status: "Resuelto" }, ...prev]);
      reset();
      // scroll al panel de solución
      setTimeout(() => streamingRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!solution) return;
    const content = solution.content.join("\n\n");
    const blob = new Blob([`# Solución: ${solution.id}\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution-${solution.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Form */}
        <aside className="lg:col-span-3 bg-card p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Nuevo problema</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium">Tipo</span>
              <select {...register("type")} defaultValue="general" className="mt-1 w-full px-3 py-2 border rounded">
                <option value="general">General</option>
                <option value="matematico">Matemático</option>
                <option value="producto">Mejora de producto</option>
                <option value="operacional">Operacional</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Título corto</span>
              <input {...register("title")} required placeholder="Ej. Calcular pendiente de recta" className="mt-1 w-full px-3 py-2 border rounded" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Descripción</span>
              <textarea {...register("description")} required rows={5} placeholder="Describe el problema con detalles o pega LaTeX / código / imagen (link)" className="mt-1 w-full px-3 py-2 border rounded" />
            </label>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-95" disabled={loading}>
                {loading ? "Generando…" : "Generar solución"}
              </button>
              <button type="button" onClick={() => { reset(); setError(null); }} className="px-4 py-2 border rounded">
                Limpiar
              </button>
            </div>

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Ejemplos rápidos</h3>
            <ul className="text-sm space-y-1">
              <li>
                <button className="text-accent hover:underline" onClick={() => { /* prefill form via DOM approach */ }}>
                  Calcular integral definida
                </button>
              </li>
              <li>
                <button className="text-accent hover:underline">Diagnóstico de proceso</button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main column: Solution / chat */}
        <section className="lg:col-span-6 bg-white/5 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Soluciones</h2>
            <div className="text-sm text-muted-foreground">Interactúa con la respuesta y exporta</div>
          </div>

          {!solution && (
            <div className="p-6 border-dashed border rounded text-center text-muted-foreground">
              Empieza creando un problema a la izquierda o selecciona uno existente.
            </div>
          )}

          {solution && (
            <div ref={streamingRef} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Solución ID: {solution.id}</h3>
                  {solution.summary && <p className="text-sm text-muted-foreground">{solution.summary}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadPDF()} className="px-3 py-1 border rounded">Exportar</button>
                </div>
              </div>

              <div className="space-y-3">
                {solution.content.map((step, idx) => (
                  <article key={idx} className="p-3 bg-card rounded">
                    <div className="text-sm font-medium mb-1">Paso {idx + 1}</div>
                    <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: step }} />
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right column: History & tips */}
        <aside className="lg:col-span-3 bg-card p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Historial</h3>
          <ul className="space-y-2 max-h-[40vh] overflow-auto">
            {problems.length === 0 && <li className="text-sm text-muted-foreground">Sin problemas guardados.</li>}
            {problems.map((p) => (
              <li key={p.id} className="p-2 bg-white/3 rounded flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.status}</div>
                </div>
                <button
                  className="ml-2 px-2 py-1 border rounded text-xs"
                  onClick={async () => {
                    // cargar solución por id (si el backend lo soporta)
                    setLoading(true);
                    try {
                      const r = await fetch(`/api/solve/${p.id}`);
                      if (r.ok) {
                        const d = await r.json();
                        setSolution(d);
                        setTimeout(() => streamingRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Abrir
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h4 className="text-sm font-medium">Consejos</h4>
            <ol className="text-sm list-decimal ml-5 mt-2 text-muted-foreground">
              <li>Describe el problema con pasos y datos.</li>
              <li>Pega ecuaciones en LaTeX o sube imágenes con links.</li>
              <li>Usa las opciones para exportar y compartir.</li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
