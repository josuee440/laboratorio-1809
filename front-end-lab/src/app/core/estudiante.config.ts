// UN SOLO LUGAR para definir los campos de "estudiante".
// La tabla y el formulario se generan a partir de esta lista.
// (id y fecha_creacion los genera el servidor.)

export interface Campo {
  nombre: string;   // nombre exacto del campo en la API
  etiqueta: string; // texto que ve el usuario
  tipo: 'text' | 'email' | 'number';
  requerido: boolean;
}

export const CAMPOS_ESTUDIANTE: Campo[] = [
  { nombre: 'nombre',   etiqueta: 'Nombre',   tipo: 'text',   requerido: true },
  { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text',   requerido: true },
  { nombre: 'email',    etiqueta: 'Correo',   tipo: 'email',  requerido: true },
  { nombre: 'carrera',  etiqueta: 'Carrera',  tipo: 'text',   requerido: false },
  { nombre: 'edad',     etiqueta: 'Edad',     tipo: 'number', requerido: false },
];

export interface Estudiante {
  id?: number;
  [campo: string]: unknown;
}