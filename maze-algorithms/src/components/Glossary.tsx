import { algorithmsData } from "../data/algorithms";

export function Glossary() {
  return (
    <nav className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        Algoritmos de Geração de Labirinto
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Clique em um algoritmo para ver detalhes, implementação e gerar
        labirintos:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {algorithmsData.map((algo) => (
          <li key={algo.id}>
            <a
              href={`#${algo.id}`}
              className="block p-3 bg-white dark:bg-slate-700 rounded-md hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
            >
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {algo.name}
              </span>
              <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1">
                {algo.complexity.time} • {algo.complexity.space}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
