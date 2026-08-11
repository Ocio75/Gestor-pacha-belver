import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bebida, DiaFiesta, FiestaData, GastoComun, ResumenPersona } from './models';

const STORAGE_KEY = 'fiesta-pueblo-pacha-data';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

@Injectable({ providedIn: 'root' })
export class FiestaService {
  data = signal<FiestaData>({
    pueblo: `${new Date().getFullYear()} · Pacha`,
    personas: [],
    bebidas: [],
    gastosComunes: [],
    dias: [],
  });

  diaSeleccionadoId = signal<string | null>(null);

  diaSeleccionado = computed(() => {
    const id = this.diaSeleccionadoId();
    return this.data().dias.find((d) => d.id === id) ?? null;
  });

  constructor(private http: HttpClient) {
    this.cargarInicial();
  }

  private cargarInicial() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado) as FiestaData;
        const migrado = this.migrar(parsed);
        this.data.set(migrado);
        this.diaSeleccionadoId.set(migrado.dias[0]?.id ?? null);
        return;
      } catch {
        // si el JSON guardado está corrupto, seguimos y cargamos el de ejemplo
      }
    }
    this.http.get<FiestaData>('assets/data.json').subscribe((d) => {
      const migrado = this.migrar(d);
      this.data.set(migrado);
      this.diaSeleccionadoId.set(migrado.dias[0]?.id ?? null);
      this.guardar();
    });
  }

  /** Compatibilidad con JSON antiguos: bebidas por día con precio propio,
   * y/o sin el campo gastosComunes. */
  private migrar(dOriginal: FiestaData): FiestaData {
    let d: any = dOriginal;
    if (!Array.isArray(d.bebidas)) {
      const bebidasMenu: Bebida[] = [];
      const dias = d.dias.map((dia: any) => {
        const consumos = (dia.bebidas ?? []).map((b: any) => {
          let existente = bebidasMenu.find((m) => m.nombre === b.nombre);
          if (!existente) {
            existente = { id: uid(), nombre: b.nombre, precioUnidad: b.precioUnidad };
            bebidasMenu.push(existente);
          }
          return { bebidaId: existente.id, cantidad: b.cantidad };
        });
        return { ...dia, consumos };
      });
      d = { ...d, bebidas: bebidasMenu, dias };
    }
    if (!Array.isArray(d.gastosComunes)) {
      d = { ...d, gastosComunes: [] };
    }
    // autor/version/notasAdicionales ya no son datos de usuario: si vienen
    // de un JSON exportado con una versión antigua de la app, se descartan.
    if ('autor' in d || 'version' in d || 'notasAdicionales' in d) {
      const { autor, version, notasAdicionales, ...resto } = d;
      d = resto;
    }
    return d as FiestaData;
  }

  private guardar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data()));
  }

  private actualizar(fn: (d: FiestaData) => FiestaData) {
    this.data.set(fn(this.data()));
    this.guardar();
  }

  // --- Pueblo ---
  renombrarPueblo(nombre: string) {
    this.actualizar((d) => ({ ...d, pueblo: nombre }));
  }

  // --- Personas ---
  añadirPersona(nombre: string) {
    const limpio = nombre.trim();
    if (!limpio) return;
    this.actualizar((d) =>
      d.personas.includes(limpio) ? d : { ...d, personas: [...d.personas, limpio] }
    );
  }

  renombrarPersona(actual: string, nuevo: string) {
    const limpio = nuevo.trim();
    if (!limpio || limpio === actual) return;
    this.actualizar((d) => ({
      ...d,
      personas: d.personas.map((p) => (p === actual ? limpio : p)),
      dias: d.dias.map((dia) => ({
        ...dia,
        asistentes: dia.asistentes.map((a) => (a === actual ? limpio : a)),
      })),
    }));
  }

  eliminarPersona(nombre: string) {
    this.actualizar((d) => ({
      ...d,
      personas: d.personas.filter((p) => p !== nombre),
      dias: d.dias.map((dia) => ({
        ...dia,
        asistentes: dia.asistentes.filter((a) => a !== nombre),
      })),
    }));
  }

  // --- Menú de bebidas (catálogo único, mismo precio todos los días) ---
  bebidaPorId(id: string): Bebida | undefined {
    return this.data().bebidas.find((b) => b.id === id);
  }

  añadirBebidaMenu(nombre: string, precioUnidad: number) {
    const limpio = nombre.trim();
    if (!limpio) return;
    const nueva: Bebida = { id: uid(), nombre: limpio, precioUnidad };
    this.actualizar((d) => ({ ...d, bebidas: [...d.bebidas, nueva] }));
  }

  actualizarPrecioBebida(id: string, precioUnidad: number) {
    this.actualizar((d) => ({
      ...d,
      bebidas: d.bebidas.map((b) => (b.id === id ? { ...b, precioUnidad } : b)),
    }));
  }

  renombrarBebida(id: string, nombre: string) {
    const limpio = nombre.trim();
    if (!limpio) return;
    this.actualizar((d) => ({
      ...d,
      bebidas: d.bebidas.map((b) => (b.id === id ? { ...b, nombre: limpio } : b)),
    }));
  }

  eliminarBebidaMenu(id: string) {
    this.actualizar((d) => ({
      ...d,
      bebidas: d.bebidas.filter((b) => b.id !== id),
      dias: d.dias.map((dia) => ({
        ...dia,
        consumos: dia.consumos.filter((c) => c.bebidaId !== id),
      })),
    }));
  }

  moverBebida(id: string, direccion: 'arriba' | 'abajo') {
    this.actualizar((d) => {
      const idx = d.bebidas.findIndex((b) => b.id === id);
      const nuevoIdx = direccion === 'arriba' ? idx - 1 : idx + 1;
      if (idx === -1 || nuevoIdx < 0 || nuevoIdx >= d.bebidas.length) return d;
      const bebidas = [...d.bebidas];
      [bebidas[idx], bebidas[nuevoIdx]] = [bebidas[nuevoIdx], bebidas[idx]];
      return { ...d, bebidas };
    });
  }

  moverBebidaAPosicion(idOrigen: string, posicionDestino: number) {
    this.actualizar((d) => {
      const bebidas = [...d.bebidas];
      const idxOrigen = bebidas.findIndex((b) => b.id === idOrigen);
      if (idxOrigen === -1) return d;
      const [item] = bebidas.splice(idxOrigen, 1);
      const destino = Math.max(0, Math.min(posicionDestino, bebidas.length));
      bebidas.splice(destino, 0, item);
      return { ...d, bebidas };
    });
  }

  // --- Gastos comunes (vasos, hielo... se reparten a partes iguales entre
  // TODO el grupo, independientemente de a cuántos días haya ido cada uno) ---
  añadirGastoComun(nombre: string, precioUnidad: number, cantidad: number) {
    const limpio = nombre.trim();
    if (!limpio) return;
    const nuevo: GastoComun = { id: uid(), nombre: limpio, precioUnidad, cantidad };
    this.actualizar((d) => ({ ...d, gastosComunes: [...d.gastosComunes, nuevo] }));
  }

  actualizarGastoComun(id: string, cambios: Partial<Pick<GastoComun, 'precioUnidad' | 'cantidad'>>) {
    this.actualizar((d) => ({
      ...d,
      gastosComunes: d.gastosComunes.map((g) => (g.id === id ? { ...g, ...cambios } : g)),
    }));
  }

  eliminarGastoComun(id: string) {
    this.actualizar((d) => ({
      ...d,
      gastosComunes: d.gastosComunes.filter((g) => g.id !== id),
    }));
  }

  totalGastosComunes(): number {
    return this.data().gastosComunes.reduce((acc, g) => acc + g.precioUnidad * g.cantidad, 0);
  }

  /** Personas que han ido al menos un día (las que no han ido a ninguno no pagan gastos comunes). */
  asistentesUnicos(): string[] {
    const d = this.data();
    return d.personas.filter((p) => d.dias.some((dia) => dia.asistentes.includes(p)));
  }

  gastoComunPorPersona(): number {
    const n = this.asistentesUnicos().length;
    return n > 0 ? this.totalGastosComunes() / n : 0;
  }

  // --- Días ---
  añadirDia(nombre: string, fecha: string) {
    const nuevo: DiaFiesta = {
      id: uid(),
      nombre: nombre.trim() || 'Nuevo día',
      fecha,
      asistentes: [],
      consumos: [],
    };
    this.actualizar((d) => ({ ...d, dias: [...d.dias, nuevo] }));
    this.diaSeleccionadoId.set(nuevo.id);
  }

  eliminarDia(id: string) {
    this.actualizar((d) => ({ ...d, dias: d.dias.filter((dia) => dia.id !== id) }));
    if (this.diaSeleccionadoId() === id) {
      this.diaSeleccionadoId.set(this.data().dias[0]?.id ?? null);
    }
  }

  seleccionarDia(id: string) {
    this.diaSeleccionadoId.set(id);
  }

  toggleAsistencia(diaId: string, persona: string) {
    this.actualizar((d) => ({
      ...d,
      dias: d.dias.map((dia) => {
        if (dia.id !== diaId) return dia;
        const asiste = dia.asistentes.includes(persona);
        return {
          ...dia,
          asistentes: asiste
            ? dia.asistentes.filter((a) => a !== persona)
            : [...dia.asistentes, persona],
        };
      }),
    }));
  }

  // --- Consumo de bebidas por día (cantidad de cada bebida del menú) ---
  cantidadConsumo(dia: DiaFiesta, bebidaId: string): number {
    return dia.consumos.find((c) => c.bebidaId === bebidaId)?.cantidad ?? 0;
  }

  setConsumo(diaId: string, bebidaId: string, cantidad: number) {
    this.actualizar((d) => ({
      ...d,
      dias: d.dias.map((dia) => {
        if (dia.id !== diaId) return dia;
        const resto = dia.consumos.filter((c) => c.bebidaId !== bebidaId);
        if (!cantidad || cantidad <= 0) return { ...dia, consumos: resto };
        return { ...dia, consumos: [...resto, { bebidaId, cantidad }] };
      }),
    }));
  }

  // --- Cálculos ---
  costeBebidasDia(dia: DiaFiesta): number {
    return dia.consumos.reduce((acc, c) => {
      const precio = this.bebidaPorId(c.bebidaId)?.precioUnidad ?? 0;
      return acc + precio * c.cantidad;
    }, 0);
  }

  costePorPersonaDia(dia: DiaFiesta): number {
    const n = dia.asistentes.length;
    return n > 0 ? this.costeBebidasDia(dia) / n : 0;
  }

  diasAsistidosPersona(nombre: string): number {
    return this.data().dias.filter((dia) => dia.asistentes.includes(nombre)).length;
  }

  resumenPersonas(): ResumenPersona[] {
    const d = this.data();
    const comunPorPersona = this.gastoComunPorPersona();
    return d.personas
      .map((nombre) => {
        const diasAsistidos = d.dias.filter((dia) => dia.asistentes.includes(nombre));
        const costeBebidas = diasAsistidos.reduce(
          (acc, dia) => acc + this.costePorPersonaDia(dia),
          0
        );
        const costeComun = diasAsistidos.length > 0 ? comunPorPersona : 0;
        return {
          nombre,
          diasAsistidos: diasAsistidos.length,
          costeBebidas,
          costeComun,
          totalAPagar: costeBebidas + costeComun,
        };
      })
      .sort((a, b) => b.totalAPagar - a.totalAPagar);
  }

  totalUnidadesBebida(bebidaId: string): number {
    return this.data().dias.reduce((acc, dia) => acc + this.cantidadConsumo(dia, bebidaId), 0);
  }

  /** Coste total de bebidas de todos los días (sin contar gastos comunes). */
  totalBebidasGeneral(): number {
    return this.data().dias.reduce((acc, dia) => acc + this.costeBebidasDia(dia), 0);
  }

  /** Total de la fiesta: bebidas de todos los días + gastos comunes. */
  totalGeneral(): number {
    return this.totalBebidasGeneral() + this.totalGastosComunes();
  }

  // --- Import / Export ---
  exportarJson() {
    const blob = new Blob([JSON.stringify(this.data(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.data().pueblo || 'fiesta'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importarJson(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = this.migrar(JSON.parse(reader.result as string) as FiestaData);
          this.data.set(parsed);
          this.diaSeleccionadoId.set(parsed.dias[0]?.id ?? null);
          this.guardar();
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}
