import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// withHashLocation() usa URLs del tipo /#/gestion en vez de /gestion.
// Así la app funciona en cualquier hosting estático (GitHub Pages, Netlify,
// Vercel...) sin tener que configurar reglas de reescritura en el servidor.
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes, withHashLocation())],
}).catch((err) => console.error(err));
