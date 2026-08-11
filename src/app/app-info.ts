/**
 * Información fija de la app (autor, versión, notas del footer).
 *
 * A propósito NO forma parte de FiestaData ni se guarda en localStorage:
 * solo se puede cambiar editando este archivo y volviendo a desplegar,
 * nunca desde la interfaz web.
 */
export const APP_INFO = {
  autor: 'Jon Ocio Garcia',
  version: '1.2',
  notas: [
    'Edición Pacha 🍒',
  ] as string[],
};
