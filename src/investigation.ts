export type Obstacle = { x: number; y: number; width: number; height: number };
export const objects = [
  { id: 'chair', name: 'Cadeira', x: 160, y: 465, width: 130, height: 150, cell: 0, obstacle: { x: 112, y: 443, width: 96, height: 30 }, clue: 'A pista 2 está numa estante, mas não é um livro.' },
  { id: 'shelf', name: 'Objeto na estante', x: 800, y: 312, width: 160, height: 155, cell: 1, obstacle: { x: 742, y: 289, width: 116, height: 31 }, clue: 'A pista 3 está naquela coisa que ilumina a sala.' },
  { id: 'lamp', name: 'Luminária', x: 760, y: 500, width: 100, height: 180, cell: 2, obstacle: { x: 738, y: 488, width: 44, height: 16 }, clue: 'A pista 4 está protegida por espadas.' },
  // Wall placement is separate from the reachable investigation point on the floor.
  { id: 'shield', name: 'Escudo entre espadas', x: 484, y: 282, displayY: 142, width: 76, height: 85, cell: 3, obstacle: null, clue: 'A resposta certa é: 42. Escreva a resposta no campo de conclusão.' },
] as const;
export type ObjectId = typeof objects[number]['id'];

