import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { EstudiantesService } from '../../core/estudiantes.service';
import { CAMPOS_ESTUDIANTE, Estudiante } from '../../core/estudiante.config';
import { Confirmar } from '../../shared/confirmar';

@Component({
  selector: 'app-lista',
  imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <mat-card>
      <mat-card-header><mat-card-title>Estudiantes</mat-card-title></mat-card-header>
      <mat-card-content>
        @if (auth.autenticado()) {
          <a mat-flat-button routerLink="/estudiantes/nuevo" class="nuevo">
            <mat-icon>add</mat-icon> Nuevo estudiante
          </a>
        }

        @if (cargando()) { <mat-progress-bar mode="indeterminate" /> }

        <div class="tabla">
          <table mat-table [dataSource]="estudiantes()">
            <!-- Una columna por cada campo de estudiante.config.ts -->
            @for (campo of campos; track campo.nombre) {
              <ng-container [matColumnDef]="campo.nombre">
                <th mat-header-cell *matHeaderCellDef>{{ campo.etiqueta }}</th>
                <td mat-cell *matCellDef="let e">{{ e[campo.nombre] ?? '—' }}</td>
              </ng-container>
            }

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let e">
                <a mat-icon-button [routerLink]="['/estudiantes', e.id]"><mat-icon>edit</mat-icon></a>
                @if (auth.esAdmin()) {
                  <button mat-icon-button (click)="eliminar(e)"><mat-icon>delete</mat-icon></button>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnas()"></tr>
            <tr mat-row *matRowDef="let fila; columns: columnas()"></tr>
          </table>
        </div>

        @if (!cargando() && estudiantes().length === 0) {
          <p>No hay estudiantes registrados.</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .nuevo { margin-bottom: 16px; }
    .tabla { overflow-x: auto; }
    table { width: 100%; }
  `,
})
export class Lista implements OnInit {
  protected auth = inject(AuthService);
  private servicio = inject(EstudiantesService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  protected campos = CAMPOS_ESTUDIANTE;
  protected estudiantes = signal<Estudiante[]>([]);
  protected cargando = signal(false);

  // La columna de acciones (editar/eliminar) solo aparece con sesión iniciada
  protected columnas = computed(() => [
    ...this.campos.map(c => c.nombre),
    ...(this.auth.autenticado() ? ['acciones'] : []),
  ]);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.servicio.listar().subscribe({
      next: lista => {
        this.estudiantes.set(lista);
        this.cargando.set(false);
      },
      error: err => {
        this.snack.open(err.error?.message ?? 'No hay conexión con la API', 'OK', { duration: 4000 });
        this.cargando.set(false);
      },
    });
  }

  eliminar(e: Estudiante) {
    this.dialog
      .open(Confirmar, { data: `¿Eliminar a ${e['nombre']} ${e['apellido']}?` })
      .afterClosed()
      .subscribe(confirmado => {
        if (!confirmado) return;
        this.servicio.eliminar(e.id!).subscribe({
          next: () => {
            this.snack.open('Estudiante eliminado', 'OK', { duration: 3000 });
            this.cargar();
          },
          error: err => this.snack.open(err.error?.message ?? 'Error al eliminar', 'OK', { duration: 4000 }),
        });
      });
  }
}