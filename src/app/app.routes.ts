import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'game',
        loadComponent: () => import('./game/game.component').then(m => m.GameComponent),
        canActivate: [authGuard],
        data: { roles: ['student', 'admin'] }
    },
    {
        path: 'scores',
        loadComponent: () => import('./scores/scores.component').then(m => m.ScoresComponent),
        canActivate: [authGuard],
        data: { roles: ['student', 'admin'] }
    }

];
