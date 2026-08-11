import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiestaService } from '../fiesta.service';

@Component({
  selector: 'app-asistentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistentes.component.html',
  styleUrl: './asistentes.component.css',
})
export class AsistentesComponent {
  fiesta = inject(FiestaService);
  data = this.fiesta.data;

  nuevaPersona = '';
  personaEnEdicion = signal<string | null>(null);
  nombreEdicion = '';

  crearPersona() {
    if (!this.nuevaPersona.trim()) return;
    this.fiesta.añadirPersona(this.nuevaPersona);
    this.nuevaPersona = '';
  }

  empezarEdicion(nombre: string) {
    this.personaEnEdicion.set(nombre);
    this.nombreEdicion = nombre;
  }

  guardarEdicion(actual: string) {
    this.fiesta.renombrarPersona(actual, this.nombreEdicion);
    this.personaEnEdicion.set(null);
  }

  cancelarEdicion() {
    this.personaEnEdicion.set(null);
  }

  eliminarPersona(nombre: string) {
    if (confirm(`¿Quitar a ${nombre} de todos los días?`)) {
      this.fiesta.eliminarPersona(nombre);
    }
  }
}
