"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const quickDemo = () => {
    // Redirige a la página Solve y puedes pasar query params para prellenar
    router.push("/solve?demo=integral");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-start justify-center p-6">
      <div className="max-w-5xl w-full">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold">S</div>
            <div>
              <h1 className="text-2xl font-bold">Solver</h1>
              <p className="text-sm text-muted-foreground">Transforma preguntas en soluciones claras, guiadas por IA.</p>
            </div>
          </div>
          <nav className="flex gap-4 items-center">
            <button className="px-4 py-2">Login</button>
            <a href="#try" className="px-4 py-2 bg-accent text-accent-foreground rounded">Probar gratis</a>
          </nav>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-10">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">Resuelve problemas y mejora procesos con IA</h2>
            <p className="text-lg text-muted-foreground mb-6">Describe tu caso, recibe una solución paso a paso, visualizaciones y acciones recomendadas. Ideal para ingenieros, product managers y operaciones.</p>

            <div className="flex gap-3">
              <button onClick={quickDemo} className="px-5 py-3 bg-primary text-primary-foreground rounded-lg">Probar demo</button>
              <a href="/solve" className="px-5 py-3 border rounded-lg">Ir a Solve</a>
            </div>

            <div className="mt-8 bg-card p-4 rounded">
              <h4 className="text-sm font-medium">Demo rápido</h4>
              <p className="text-sm text-muted-foreground">Pruébalo: "Calcula la integral definida de x^2 entre 0 y 2"</p>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-primary/20 to-accent/20 rounded-lg p-6">
            {/* Aquí puedes insertar una ilustración SVG o Lottie */}
            <div className="h-48 flex items-center justify-center text-muted-foreground">[Ilustración interactiva]</div>
          </div>
        </section>

        <section id="try" className="py-8">
          <h3 className="text-xl font-semibold mb-4">Características</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="p-4 bg-card rounded">Guía paso a paso</li>
            <li className="p-4 bg-card rounded">Exportar soluciones</li>
            <li className="p-4 bg-card rounded">Integración IA conversacional</li>
          </ul>
        </section>

        <footer className="py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Solver — Hecho con IA.
        </footer>
      </div>
    </main>
  );
}
