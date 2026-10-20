import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, ROLES } from '../../core/auth.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule,
            MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <mat-card class="tarjeta">
      <mat-card-header><mat-card-title>Registrarse</mat-card-title></mat-card-header>
      <mat-card-content>
        <form class="formulario" [formGroup]="form" (ngSubmit)="registrar()">
          <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre">
            <mat-error>El nombre es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Correo</mat-label>
            <input matInput type="email" formControlName="email">
            <mat-error>Escribe un correo válido</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password">
            <mat-error>La contraseña es obligatoria</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Rol</mat-label>
            <mat-select formControlName="rol_id">
              @for (rol of roles; track rol.id) {
                <mat-option [value]="rol.id">{{ rol.nombre }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          @if (error()) { <p class="error">{{ error() }}</p> }

          <button mat-flat-button type="submit" [disabled]="form.invalid || cargando()">Crear cuenta</button>
        </form>
        <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
      </mat-card-content>
    </mat-card>
  `,
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected roles = ROLES;
  protected error = signal('');
  protected cargando = signal(false);

  protected form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rol_id: [2, Validators.required], // por defecto "usuario"
  });

  registrar() {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.error.set('');

    this.auth.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.snack.open('Usuario creado. Ahora inicia sesión.', 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: e => {
        this.error.set(e.error?.message ?? 'No hay conexión con la API');
        this.cargando.set(false);
      },
    });
  }
}