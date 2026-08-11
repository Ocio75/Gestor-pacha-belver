import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FiestaService } from './fiesta.service';
import { ThemeService } from './theme.service';
import { APP_INFO } from './app-info';

const COOKIE_KEY = 'fiesta-pueblo-pacha-aviso-ok';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  fiesta = inject(FiestaService);
  theme = inject(ThemeService); // se instancia aquí para aplicar el tema desde el arranque
  data = this.fiesta.data;

  // Información fija del footer (autor, versión, notas): NO editable desde
  // la web, solo cambiando /src/app/app-info.ts en el código.
  appInfo = APP_INFO;

  cookiesAceptadas = signal(localStorage.getItem(COOKIE_KEY) === '1');

  aceptarCookies() {
    localStorage.setItem(COOKIE_KEY, '1');
    this.cookiesAceptadas.set(true);
  }

  renombrarPueblo(nombre: string) {
    this.fiesta.renombrarPueblo(nombre);
  }

  anioActual = new Date().getFullYear();

  exportar() {
    this.fiesta.exportarJson();
  }

  onImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fiesta.importarJson(file).catch(() => alert('El archivo JSON no es válido.'));
    input.value = '';
  }

  // Racimo de cerezas colgando de la cabecera, siguiendo la misma curva que
  // antes tenía la guirnalda de banderines, ahora con el logo real de cerezas.
  cherryGarland = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  cherryGarlandStyle(i: number): Record<string, string> {
    const count = this.cherryGarland.length;
    const leftPct = ((i + 0.5) / count) * 100;
    const t = i / (count - 1);
    const topPx = 2 + 34 * 4 * t * (1 - t);
    const rot = (i % 2 === 0 ? -1 : 1) * (4 + (i % 3) * 2);
    return {
      left: `${leftPct}%`,
      top: `${topPx}px`,
      transform: `rotate(${rot}deg)`,
    };
  }

  // Cerezas decorativas fijas en los márgenes de la pantalla (fuera del
  // contenido), puramente estéticas.
  marginCherries = [
    { top: '10%', left: '1.5%', size: 46, rot: -12, opacity: 0.55 },
    { top: '38%', left: '0.5%', size: 34, rot: 10, opacity: 0.4 },
    { top: '68%', left: '2%', size: 40, rot: -6, opacity: 0.5 },
    { top: '16%', right: '1.5%', size: 42, rot: 14, opacity: 0.5 },
    { top: '46%', right: '0.5%', size: 30, rot: -10, opacity: 0.4 },
    { top: '74%', right: '2%', size: 44, rot: 8, opacity: 0.55 },
  ];
}
