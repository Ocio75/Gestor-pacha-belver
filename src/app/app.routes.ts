import { Routes } from '@angular/router';
import { DiasComponent } from './pages/dias.component';
import { AsistentesComponent } from './pages/asistentes.component';
import { BebidasComponent } from './pages/bebidas.component';
import { ResumenComponent } from './pages/resumen.component';
import { AjustesComponent } from './pages/ajustes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dias', pathMatch: 'full' },
  { path: 'dias', component: DiasComponent, title: 'Días de fiesta — Fiestas del Pueblo' },
  { path: 'asistentes', component: AsistentesComponent, title: 'Asistentes — Fiestas del Pueblo' },
  { path: 'bebidas', component: BebidasComponent, title: 'Bebidas — Fiestas del Pueblo' },
  { path: 'resumen', component: ResumenComponent, title: 'Resumen — Fiestas del Pueblo' },
  { path: 'ajustes', component: AjustesComponent, title: 'Ajustes — Fiestas del Pueblo' },
  { path: '**', redirectTo: 'dias' },
];
