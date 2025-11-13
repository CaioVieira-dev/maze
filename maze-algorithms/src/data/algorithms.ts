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
  {
    id: "kruskal",
    name: "Algoritmo de Kruskal",
    description:
      "Versão randomizada do algoritmo de Kruskal para árvore geradora mínima. Usa estrutura Union-Find para conectar células aleatoriamente sem criar loops.",
    complexity: {
      time: "O(n log n)",
      space: "O(n)",
    },
    characteristics: [
      "Usa estrutura Disjoint Set (Union-Find)",
      "Muitas ramificações curtas",
      "Processa todas as paredes aleatoriamente",
      "Muito eficiente com path compression",
      "Similar ao Prim visualmente",
    ],
  },
  {
    id: "eller",
    name: "Algoritmo de Eller",
    description:
      "Um dos mais eficientes e únicos - constrói o labirinto linha por linha usando conjuntos. Único capaz de gerar labirintos de tamanho infinito com memória constante.",
    complexity: {
      time: "O(n)",
      space: "O(largura)",
    },
    characteristics: [
      "Extremamente eficiente em memória",
      "Constrói linha por linha",
      "Pode gerar labirintos infinitos",
      "Tempo linear",
      "Viés horizontal visível",
    ],
  },
  {
    id: "wilson",
    name: "Algoritmo de Wilson",
    description:
      "Usa caminhadas aleatórias com apagamento de loops (loop-erased random walks). Gera labirintos completamente sem viés - amostra uniforme de todas as árvores geradoras possíveis.",
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
    characteristics: [
      "Completamente sem viés - distribuição uniforme",
      "Lento no início, acelera dramaticamente",
      "Apaga loops durante o random walk",
      "Mais lento que Aldous-Broder",
      "Produz labirintos imparciais",
    ],
  },
];
