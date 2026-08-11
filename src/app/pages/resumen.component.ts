import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiestaService } from '../fiesta.service';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css',
})
export class ResumenComponent {
  fiesta = inject(FiestaService);

  data = this.fiesta.data;
  resumen = computed(() => this.fiesta.resumenPersonas());

  eliminarPersona(nombre: string) {
    if (confirm(`¿Quitar a ${nombre} de todos los días?`)) {
      this.fiesta.eliminarPersona(nombre);
    }
  }
}
