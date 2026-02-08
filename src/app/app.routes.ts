import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Blog } from './pages/blog/blog';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'blog', component: Blog},
    {path: 'about', component: About},
    {path: 'privacy', component: Privacy},
    {path: 'terms', component: Terms},
    {path: '**', component: NotFound}
];
