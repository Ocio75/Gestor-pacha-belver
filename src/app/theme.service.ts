import { Injectable, computed, effect, signal } from '@angular/core';

export type PreferenciaTema = 'sistema' | 'claro' | 'oscuro';
export type TemaEfectivo = 'claro' | 'oscuro';

const STORAGE_KEY = 'fiesta-pueblo-pacha-tema';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  private sistemaEsClaro = signal(this.mediaQuery.matches);

  preferencia = signal<PreferenciaTema>(this.leerGuardado());

  // computed en vez de signal: así el effect de abajo solo LEE, nunca escribe
  // una signal dentro de sí mismo (eso es lo que impedía que el tema se aplicara).
  temaEfectivo = computed<TemaEfectivo>(() => {
    const pref = this.preferencia();
    return pref === 'sistema' ? (this.sistemaEsClaro() ? 'claro' : 'oscuro') : pref;
  });

  constructor() {
    this.mediaQuery.addEventListener('change', (e) => this.sistemaEsClaro.set(e.matches));

    effect(() => {
      const efectivo = this.temaEfectivo();
      document.documentElement.setAttribute('data-theme', efectivo);
      localStorage.setItem(STORAGE_KEY, this.preferencia());
    });
  }

  establecer(pref: PreferenciaTema) {
    this.preferencia.set(pref);
  }

  private leerGuardado(): PreferenciaTema {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado === 'claro' || guardado === 'oscuro' || guardado === 'sistema'
      ? guardado
      : 'sistema';
  }
}
