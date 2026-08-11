import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, PreferenciaTema } from '../theme.service';
import { FiestaService } from '../fiesta.service';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css',
})
export class AjustesComponent {
  theme = inject(ThemeService);
  fiesta = inject(FiestaService);
  data = this.fiesta.data;

  opciones: { valor: PreferenciaTema; etiqueta: string; icono: string }[] = [
    { valor: 'sistema', etiqueta: 'Del sistema', icono: '🖥️' },
    { valor: 'claro', etiqueta: 'Claro', icono: '☀️' },
    { valor: 'oscuro', etiqueta: 'Oscuro', icono: '🌙' },
  ];

  elegirTema(pref: PreferenciaTema) {
    this.theme.establecer(pref);
  }

  borrarDatos() {
    if (confirm('Esto borra todos los días, personas y bebidas guardados en este navegador. ¿Continuar?')) {
      localStorage.removeItem('fiesta-pueblo-pacha-data');
      location.reload();
    }
  }
}
