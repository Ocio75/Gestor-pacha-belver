import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiestaService } from '../fiesta.service';

@Component({
  selector: 'app-dias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dias.component.html',
  styleUrl: './dias.component.css',
})
export class DiasComponent {
  fiesta = inject(FiestaService);

  data = this.fiesta.data;
  diaSeleccionadoId = this.fiesta.diaSeleccionadoId;
  diaSeleccionado = this.fiesta.diaSeleccionado;

  nuevoDiaNombre = '';
  nuevoDiaFecha = '';

  crearDia() {
    if (!this.nuevoDiaFecha) return;
    this.fiesta.añadirDia(this.nuevoDiaNombre, this.nuevoDiaFecha);
    this.nuevoDiaNombre = '';
    this.nuevoDiaFecha = '';
  }

  eliminarDia(id: string) {
    if (confirm('¿Eliminar este día y su consumo registrado?')) {
      this.fiesta.eliminarDia(id);
    }
  }

  actualizarConsumo(diaId: string, bebidaId: string, valor: string) {
    const cantidad = parseInt(valor, 10);
    this.fiesta.setConsumo(diaId, bebidaId, isNaN(cantidad) ? 0 : cantidad);
  }
}
