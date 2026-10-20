import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [JsonPipe, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header><mat-card-title>Inicio</mat-card-title></mat-card-header>
      <mat-card-content>
        @if (auth.autenticado()) {
          <p>Sesión iniciada con rol: <strong>{{ auth.rolNombre() }}</strong></p>
        } @else {
          <p>No has iniciado sesión. <a routerLink="/login">Inicia sesión</a> para probar el token.</p>
        }
        @if (respuesta()) { <pre>{{ respuesta() | json }}</pre> }
        @if (error()) { <p class="error">{{ error() }}</p> }
      </mat-card-content>
      <mat-card-actions>
        <button mat-flat-button (click)="probar()" [disabled]="!auth.autenticado()">Probar token</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class Inicio {
  protected auth = inject(AuthService);
  protected respuesta = signal<unknown>(null);
  protected error = signal('');

  probar() {
    this.error.set('');
    this.respuesta.set(null);
    this.auth.probarToken().subscribe({
      next: r => this.respuesta.set(r),
      error: e => this.error.set(e.error?.message ?? 'No hay conexión con la API'),
    });
  }
}