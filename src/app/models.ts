export interface Bebida {
  id: string;
  nombre: string;
  precioUnidad: number;
}

export interface Consumo {
  bebidaId: string;
  cantidad: number;
}

export interface DiaFiesta {
  id: string;
  fecha: string; // YYYY-MM-DD
  nombre: string; // ej. "Día de San Roque"
  asistentes: string[]; // nombres de personas presentes ese día
  consumos: Consumo[]; // cuánto se bebió ese día de cada bebida del menú
}

/** Gasto compartido por todo el grupo (vasos, hielo, bolsas...), no ligado
 * a ningún día concreto: su coste se reparte a partes iguales entre TODAS
 * las personas del grupo, hayan ido un día o todos. */
export interface GastoComun {
  id: string;
  nombre: string;
  precioUnidad: number;
  cantidad: number;
}

export interface FiestaData {
  pueblo: string;
  personas: string[];
  bebidas: Bebida[]; // catálogo único de bebidas, mismo precio todos los días
  gastosComunes: GastoComun[]; // gastos repartidos a partes iguales entre todo el grupo
  dias: DiaFiesta[];
}

export interface ResumenPersona {
  nombre: string;
  diasAsistidos: number;
  costeBebidas: number;
  costeComun: number;
  totalAPagar: number;
}
