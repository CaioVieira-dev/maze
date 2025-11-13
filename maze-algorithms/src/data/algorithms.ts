import { type AlgorithmInfo } from "../types/maze";

export const algorithmsData: AlgorithmInfo[] = [
  {
    id: "binary-tree",
    name: "Binary Tree",
    description:
      "O algoritmo mais simples - para cada célula, carve uma passagem para norte ou leste (ou outro par diagonal). Extremamente rápido mas com viés visual óbvio.",
    complexity: {
      time: "O(n)",
      space: "O(1)",
    },
    characteristics: [
      "Mais simples de todos os algoritmos",
      "Não requer estado ou memória",
      "Viés visual diagonal forte",
      "Sempre gera labirintos perfeitos",
      "Pode gerar labirintos infinitos",
    ],
  },
  {
    id: "recursive-backtracker",
    name: "Recursive Backtracker (DFS)",
    description:
      "Algoritmo mais popular baseado em busca em profundidade. Ramifica em direção aleatória até encontrar beco sem saída, então retrocede até encontrar um caminho não explorado.",
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
    characteristics: [
      "Gera labirintos com longos corredores",
      "Baixo fator de ramificação",
      "Algoritmo mais usado na prática",
      "Requer stack para backtracking",
      'Produz labirintos mais "river-like"',
    ],
  },
  {
    id: "prim",
    name: "Algoritmo de Prim",
    description:
      "Baseado em árvore geradora mínima. Expande a partir de uma fronteira de células, sempre escolhendo aleatoriamente da borda.",
    complexity: {
      time: "O(n log n)",
      space: "O(n)",
    },
    characteristics: [
      'Crescimento "orgânico" do centro',
      "Muitas ramificações curtas",
      "Baseado em teoria dos grafos",
      "Usa fila de prioridade",
      "Labirintos mais ramificados",
    ],
  },
];
