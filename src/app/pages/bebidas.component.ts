import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiestaService } from '../fiesta.service';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css',
})
export class BebidasComponent {
  fiesta = inject(FiestaService);
  data = this.fiesta.data;

  nuevoMenuNombre = '';
  nuevoMenuPrecio: number | null = null;

  nuevoGastoNombre = '';
  nuevoGastoPrecio: number | null = null;
  nuevoGastoCantidad: number | null = null;

  // --- Reordenar (drag & drop) ---
  idArrastrado = signal<string | null>(null);
  indiceSobreDestino = signal<number | null>(null);

  crearBebidaMenu() {
    if (!this.nuevoMenuNombre.trim() || this.nuevoMenuPrecio == null) return;
    this.fiesta.añadirBebidaMenu(this.nuevoMenuNombre, this.nuevoMenuPrecio);
    this.nuevoMenuNombre = '';
    this.nuevoMenuPrecio = null;
  }

  actualizarPrecioBebida(id: string, valor: string) {
    const precio = parseFloat(valor);
    if (!isNaN(precio) && precio >= 0) {
      this.fiesta.actualizarPrecioBebida(id, precio);
    }
  }

  eliminarBebidaMenu(id: string) {
    if (confirm('¿Eliminar esta bebida del menú? Se quitará también de todos los días.')) {
      this.fiesta.eliminarBebidaMenu(id);
    }
  }

  moverArriba(id: string) {
    this.fiesta.moverBebida(id, 'arriba');
  }

  moverAbajo(id: string) {
    this.fiesta.moverBebida(id, 'abajo');
  }

  onDragStart(id: string, event: DragEvent) {
    this.idArrastrado.set(id);
    event.dataTransfer?.setData('text/plain', id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onDragOver(index: number, event: DragEvent) {
    event.preventDefault();
    this.indiceSobreDestino.set(index);
  }

  onDragLeave() {
    this.indiceSobreDestino.set(null);
  }

  onDrop(index: number, event: DragEvent) {
    event.preventDefault();
    const id = this.idArrastrado();
    if (id) {
      this.fiesta.moverBebidaAPosicion(id, index);
    }
    this.idArrastrado.set(null);
    this.indiceSobreDestino.set(null);
  }

  onDragEnd() {
    this.idArrastrado.set(null);
    this.indiceSobreDestino.set(null);
  }

  // --- Gastos comunes ---
  crearGastoComun() {
    if (!this.nuevoGastoNombre.trim() || this.nuevoGastoPrecio == null || this.nuevoGastoCantidad == null) {
      return;
    }
    this.fiesta.añadirGastoComun(this.nuevoGastoNombre, this.nuevoGastoPrecio, this.nuevoGastoCantidad);
    this.nuevoGastoNombre = '';
    this.nuevoGastoPrecio = null;
    this.nuevoGastoCantidad = null;
  }

  actualizarPrecioGasto(id: string, valor: string) {
    const precioUnidad = parseFloat(valor);
    if (!isNaN(precioUnidad) && precioUnidad >= 0) {
      this.fiesta.actualizarGastoComun(id, { precioUnidad });
    }
  }

  actualizarCantidadGasto(id: string, valor: string) {
    const cantidad = parseInt(valor, 10);
    if (!isNaN(cantidad) && cantidad >= 0) {
      this.fiesta.actualizarGastoComun(id, { cantidad });
    }
  }

  eliminarGastoComun(id: string) {
    if (confirm('¿Eliminar este gasto común?')) {
      this.fiesta.eliminarGastoComun(id);
    }
  }
}
