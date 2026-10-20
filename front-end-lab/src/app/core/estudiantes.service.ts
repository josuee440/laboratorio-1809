import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estudiante } from './estudiante.config';

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private http = inject(HttpClient);
  private url = '/api/estudiante';

  listar() { return this.http.get<Estudiante[]>(this.url); }
  obtener(id: number) { return this.http.get<Estudiante>(`${this.url}/${id}`); }
  crear(e: Estudiante) { return this.http.post<Estudiante>(this.url, e); }
  editar(id: number, e: Estudiante) { return this.http.put<Estudiante>(`${this.url}/${id}`, e); }
  eliminar(id: number) { return this.http.delete(`${this.url}/${id}`); }
}