# Fiestas del Pueblo 🎉

Mini app en Angular (standalone, Angular 18, con routing) para gestionar las
fiestas del pueblo: quién va cada día, qué bebidas se compran, y cuánto le
toca pagar a cada uno.

## Cómo arrancarla en local

```bash
npm install
npm start
```

Luego abre http://localhost:4200

## Secciones (nav superior)

- **Días de fiesta** — pestañas de días (banderines) y el consumo de bebidas
  del día seleccionado.
- **Asistentes** — gestión de personas (añadir, renombrar, quitar) y la
  tabla de asistencia (personas × días) con un check por cada día.
- **Bebidas** — el menú/catálogo de bebidas: nombre, precio por unidad, y
  cuánto se ha consumido y gastado en total de cada una.
- **Resumen** — tabla de consumo total por bebida y por día, e importe total
  a pagar por cada persona.
- **Ajustes** — icono de engranaje ⚙️ junto a "Exportar/Importar JSON", en
  la cabecera. Tema claro / oscuro / según el sistema, e información sobre
  qué datos guarda la app.

## Cómo funciona

- **Menú de bebidas** (apartado "Bebidas"): catálogo único con el nombre y
  el precio por unidad de cada bebida. Se define una sola vez porque el
  precio no cambia de un día a otro.
- **Días de fiesta**: pestañas en forma de banderín, con nombre y fecha.
  Añade tantos como quieras.
- **Asistentes**: gestiona el grupo (añadir, renombrar con el lápiz ✎, o
  quitar con la ✕) y marca en la tabla quién va cada día. La primera
  columna queda fija al hacer scroll horizontal si hay muchos días.
- **Consumo por día**: en el día seleccionado (en "Días de fiesta") indicas
  la *cantidad* consumida de cada bebida del menú; el precio se coge
  automáticamente del catálogo.
- **Reparto**: el coste de las bebidas de un día se divide entre las
  personas que asistieron ese día (coste por persona = coste bebidas /
  asistentes).
- **Resumen**: cantidades consumidas por bebida y por día, importe de cada
  día, total general, y el total que debe pagar cada persona sumando su
  parte de todos los días en los que estuvo.

## Tema claro / oscuro

En **Ajustes** puedes fijar el tema en Claro, Oscuro, o dejarlo en "Del
sistema" (por defecto), que sigue automáticamente la preferencia del
sistema operativo o navegador (`prefers-color-scheme`) y se actualiza sola
si la cambias mientras usas la app.

## Datos, cookies y privacidad

- Los datos (fiesta, personas, bebidas, consumo y tema elegido) se guardan
  únicamente en el `localStorage` de tu navegador, en tu propio dispositivo.
  No hay backend ni se envía nada a ningún servidor.
- La app **no usa cookies** de publicidad ni de seguimiento de terceros; el
  único almacenamiento es técnico y necesario para que la app funcione. Al
  entrar por primera vez aparece un aviso en forma de ventana que hay que
  aceptar para poder usar la app (se guarda que ya lo has aceptado, así no
  vuelve a salir).
- Puedes **exportar** todo a un archivo `.json` (botón "Exportar JSON") para
  guardarlo o compartirlo con el grupo, e **importarlo** de vuelta en
  cualquier momento.
- En Ajustes también puedes borrar todos los datos guardados en el
  navegador.

## Estructura del JSON

```json
{
  "pueblo": "Mi Pueblo",
  "personas": ["Ana", "Luis"],
  "bebidas": [
    { "id": "cerveza", "nombre": "Cerveza", "precioUnidad": 1.5 }
  ],
  "dias": [
    {
      "id": "d1",
      "fecha": "2026-08-15",
      "nombre": "Día grande",
      "asistentes": ["Ana", "Luis"],
      "consumos": [
        { "bebidaId": "cerveza", "cantidad": 24 }
      ]
    }
  ]
}
```

Si importas un `.json` con el formato antiguo (bebidas con precio repetido
dentro de cada día), la app lo convierte automáticamente al nuevo formato de
catálogo la primera vez que lo carga.

Si quieres precargar tus propios datos de partida (en vez de crearlos desde
la interfaz), edita `src/assets/data.json` con esta misma estructura antes
de arrancar la app por primera vez.

## Publicarla en GitHub Pages

Ya viene preparado un workflow de GitHub Actions
(`.github/workflows/deploy.yml`) que compila y publica la app automáticamente
cada vez que subes cambios a `main`. Pasos:

### 1. Crear el repositorio en GitHub

1. Entra en [github.com/new](https://github.com/new).
2. Ponle un nombre, por ejemplo `fiestas-del-pueblo`.
3. Déjalo público (GitHub Pages gratuito requiere repo público, salvo plan
   de pago). No marques "Add a README" (ya tienes uno).
4. Pulsa "Create repository".

### 2. Subir el proyecto desde tu ordenador

Desde la carpeta del proyecto (`fiesta-app`), en una terminal:

```bash
git init
git add .
git commit -m "Primer commit: Fiestas del Pueblo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/fiestas-del-pueblo.git
git push -u origin main
```

Cambia `TU-USUARIO` y el nombre del repo por los tuyos.

### 3. Activar GitHub Pages con GitHub Actions

1. En GitHub, entra en tu repositorio → pestaña **Settings**.
2. En el menú lateral, **Pages**.
3. En "Build and deployment" → "Source", elige **GitHub Actions** (no
   "Deploy from a branch").
4. Ve a la pestaña **Actions** del repo: verás el workflow "Deploy a GitHub
   Pages" ejecutándose (se lanza solo tras el `push` del paso 2). Espera a
   que termine en verde ✅.

### 4. Abrir la app

La URL será:

```
https://TU-USUARIO.github.io/fiestas-del-pueblo/
```

(la puedes ver también en Settings → Pages, arriba del todo, o en la pestaña
Actions, en el resumen del último despliegue).

A partir de aquí, cada vez que hagas cambios y ejecutes:

```bash
git add .
git commit -m "Describe el cambio"
git push
```

GitHub Actions vuelve a compilar y publicar sola, en 1-2 minutos.

### Por qué funciona sin configuración extra de rutas

La app usa navegación con `#` en la URL (`/#/dias`, `/#/asistentes`...), así
que un único `index.html` sirve todas las rutas sin tener que configurar
redirecciones ni un archivo `404.html`, algo que sí hace falta en Angular
con rutas "normales" en GitHub Pages.

### Alternativa: desplegar manualmente sin Actions

Si prefieres no usar el workflow automático:

```bash
npm install
npm install -g angular-cli-ghpages
npm run build -- --base-href /fiestas-del-pueblo/
npx angular-cli-ghpages --dir=dist/fiesta-pueblo/browser
```

Esto crea/actualiza la rama `gh-pages` con el contenido compilado. Luego en
Settings → Pages, en "Source" elige **Deploy from a branch** → rama
`gh-pages` → carpeta `/ (root)`.

### Otros hostings (sin GitHub Pages)

Si en vez de GitHub Pages prefieres Netlify, Vercel o cualquier otro
hosting estático, el proceso es aún más simple porque no necesitan
`--base-href`:

```bash
npm run build
```

Sube el contenido de `dist/fiesta-pueblo/browser` a Netlify (arrastrar a
[app.netlify.com/drop](https://app.netlify.com/drop)), Vercel, Firebase
Hosting, Cloudflare Pages, etc.

## Estructura del proyecto

```
src/
  app/
    models.ts               interfaces TypeScript (Bebida, DiaFiesta, FiestaData...)
    fiesta.service.ts        lógica de datos: personas, días, menú, consumo, import/export
    theme.service.ts         preferencia de tema (claro/oscuro/sistema)
    app.routes.ts             definición de rutas
    app.component.ts/html/css  shell: cabecera, nav, aviso de cookies
    pages/
      dias.component.*        pestañas de días y consumo del día
      asistentes.component.*   gestión de personas y tabla de asistencia
      bebidas.component.*      menú de bebidas y precios
      resumen.component.*      resumen de consumo y total a pagar por persona
      ajustes.component.*      tema y privacidad
  assets/data.json           datos de ejemplo / datos iniciales
```
