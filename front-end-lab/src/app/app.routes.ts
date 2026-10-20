import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Inicio } from './paginas/inicio/inicio';
import { Login } from './paginas/login/login';
import { Registro } from './paginas/registro/registro';
import { Lista } from './paginas/estudiantes/lista';
import { Formulario } from './paginas/estudiantes/formulario';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'estudiantes', component: Lista },
  // Estas dos rutas están protegidas por el guard: sin sesión, mandan al login
  { path: 'estudiantes/nuevo', component: Formulario, canActivate: [authGuard] },
  { path: 'estudiantes/:id', component: Formulario, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
