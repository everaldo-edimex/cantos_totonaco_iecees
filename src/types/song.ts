export interface Verso {
  orden?: number;
  tipo?: "coro" | "ultimo_coro";
  contenido: string;
}

export interface Canto {
  numero: number;
  titulo: string;
  versos: Verso[];
}
