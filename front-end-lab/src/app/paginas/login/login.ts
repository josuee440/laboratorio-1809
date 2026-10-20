import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card class="tarjeta">
      <mat-card-header><mat-card-title>Iniciar sesión</mat-card-title></mat-card-header>
      <mat-card-content>
        <form class="formulario" [formGroup]="form" (ngSubmit)="entrar()">
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

          @if (error()) { <p class="error">{{ error() }}</p> }

          <button mat-flat-button type="submit" [disabled]="form.invalid || cargando()">Entrar</button>
        </form>
        <p>¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
      </mat-card-content>
    </mat-card>
  `,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected error = signal('');
  protected cargando = signal(false);

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  entrar() {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: e => {
        // Muestra el mensaje que manda el servidor ("Usuario no encontrado", etc.)
        this.error.set(e.error?.message ?? 'No hay conexión con la API');
        this.cargando.set(false);
      },
    });
  }
}