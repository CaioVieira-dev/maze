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
  {
    id: "aldous-broder",
    name: "Aldous-Broder",
    description:
      "Um dos algoritmos mais simples - faz uma caminhada aleatória (drunkard's walk) pelo grid. Extremamente ineficiente porque revisita células já conectadas, mas gera labirintos sem viés.",
    complexity: {
      time: "O(n²) esperado",
      space: "O(1)",
    },
    characteristics: [
      "Algoritmo mais simples de implementar",
      "Completamente sem viés - distribuição uniforme",
      "Extremamente ineficiente - revisita células",
      "Tempo esperado quadrático",
      "Mais lento que Wilson's",
    ],
  },
  {
    id: "growing-tree",
    name: "Growing Tree",
    description:
      "Algoritmo extremamente flexível que pode simular outros algoritmos dependendo de como escolhe células. Esta implementação usa mix 50/50 entre newest (DFS) e random (Prim).",
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
    characteristics: [
      "Flexível - pode simular outros algoritmos",
      "Comportamento controlável por estratégia",
      "Mix de características de DFS e Prim",
      "Balanceado entre corredores longos e ramificações",
      "Muito versátil",
    ],
  },
  {
    id: "hunt-and-kill",
    name: "Hunt-and-Kill",
    description:
      "Combina random walk (kill) com busca sistemática (hunt). Faz caminhada aleatória até encontrar dead-end, então escaneia o grid procurando células não visitadas adjacentes.",
    complexity: {
      time: "O(n²)",
      space: "O(1)",
    },
    characteristics: [
      "Duas fases distintas: walk e hunt",
      "Gera longos corredores sinuosos",
      "Menor custo de memória que DFS",
      "Mais lento devido à fase hunt",
      "Similar ao Recursive Backtracker visualmente",
    ],
  },
];
