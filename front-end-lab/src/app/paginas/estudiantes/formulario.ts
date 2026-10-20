import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudiantesService } from '../../core/estudiantes.service';
import { CAMPOS_ESTUDIANTE, Campo, Estudiante } from '../../core/estudiante.config';

// Reglas de validación según la configuración de cada campo
function validadores(c: Campo): ValidatorFn[] {
  const reglas: ValidatorFn[] = [];
  if (c.requerido) reglas.push(Validators.required);
  if (c.tipo === 'email') reglas.push(Validators.email);
  return reglas;
}

@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card class="tarjeta">
      <mat-card-header>
        <mat-card-title>{{ id() ? 'Editar' : 'Nuevo' }} estudiante</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form class="formulario" [formGroup]="form" (ngSubmit)="guardar()">
          @for (c of campos; track c.nombre) {
            <mat-form-field>
              <mat-label>{{ c.etiqueta }}</mat-label>
              <input matInput [type]="c.tipo" [formControlName]="c.nombre">
              <mat-error>
                @if (form.get(c.nombre)?.hasError('email')) { Correo no válido }
                @else { Este campo es obligatorio }
              </mat-error>
            </mat-form-field>
          }

          @if (error()) { <p class="error">{{ error() }}</p> }

          <button mat-flat-button type="submit" [disabled]="form.invalid || guardando()">Guardar</button>
          <a mat-button routerLink="/estudiantes">Cancelar</a>
        </form>
      </mat-card-content>
    </mat-card>
  `,
})
export class Formulario implements OnInit {
  // Llega solo desde la ruta /estudiantes/:id (gracias a withComponentInputBinding)
  readonly id = input<string>();

  private servicio = inject(EstudiantesService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected campos = CAMPOS_ESTUDIANTE;
  protected error = signal('');
  protected guardando = signal(false);

  // El formulario se arma automáticamente a partir de la lista de campos
  protected form = new FormGroup<Record<string, FormControl<unknown>>>(
    Object.fromEntries(
      CAMPOS_ESTUDIANTE.map(c => [c.nombre, new FormControl<unknown>(null, validadores(c))]),
    ),
  );

  ngOnInit() {
    const id = this.id();
    if (id) {
      this.servicio.obtener(+id).subscribe({
        next: e => this.form.patchValue(e),
        error: () => this.error.set('No se encontró el estudiante'),
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.error.set('');

    // Campos vacíos se mandan como null (PostgreSQL no acepta '' en una columna numérica)
    const datos: Estudiante = {};
    for (const c of this.campos) {
      const valor = this.form.value[c.nombre];
      const vacio = valor === '' || valor === null || valor === undefined;
      datos[c.nombre] = vacio ? null : c.tipo === 'number' ? Number(valor) : valor;
    }

    const id = this.id();
    const peticion = id ? this.servicio.editar(+id, datos) : this.servicio.crear(datos);

    peticion.subscribe({
      next: () => {
        this.snack.open(id ? 'Estudiante actualizado' : 'Estudiante creado', 'OK', { duration: 3000 });
        this.router.navigate(['/estudiantes']);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Error al guardar');
        this.guardando.set(false);
      },
    });
  }
}