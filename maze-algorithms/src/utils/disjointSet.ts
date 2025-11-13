/**
 * Disjoint Set (Union-Find) data structure
 * Usado para rastrear conjuntos disjuntos de elementos
 */
export class DisjointSet {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor() {
    this.parent = new Map();
    this.rank = new Map();
  }

  /**
   * Cria um novo conjunto contendo apenas o elemento dado
   */
  makeSet(element: string): void {
    if (!this.parent.has(element)) {
      this.parent.set(element, element);
      this.rank.set(element, 0);
    }
  }

  /**
   * Encontra o representante (raiz) do conjunto que contém o elemento
   * Usa path compression para otimização
   */
  find(element: string): string {
    if (!this.parent.has(element)) {
      this.makeSet(element);
    }

    if (this.parent.get(element) !== element) {
      // Path compression: faz o elemento apontar diretamente para a raiz
      this.parent.set(element, this.find(this.parent.get(element)!));
    }

    return this.parent.get(element)!;
  }

  /**
   * Une dois conjuntos contendo os elementos dados
   * Usa union by rank para otimização
   */
  union(element1: string, element2: string): void {
    const root1 = this.find(element1);
    const root2 = this.find(element2);

    if (root1 === root2) {
      return; // Já estão no mesmo conjunto
    }

    // Union by rank: anexa a árvore menor na maior
    const rank1 = this.rank.get(root1) || 0;
    const rank2 = this.rank.get(root2) || 0;

    if (rank1 < rank2) {
      this.parent.set(root1, root2);
    } else if (rank1 > rank2) {
      this.parent.set(root2, root1);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, rank1 + 1);
    }
  }

  /**
   * Verifica se dois elementos estão no mesmo conjunto
   */
  connected(element1: string, element2: string): boolean {
    return this.find(element1) === this.find(element2);
  }
}
