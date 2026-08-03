export interface Verso {
  orden?: number;
  tipo?: "coro";
  contenido: string;
}

export interface Canto {
  numero: number;
  titulo: string;
  versos: Verso[];
}
