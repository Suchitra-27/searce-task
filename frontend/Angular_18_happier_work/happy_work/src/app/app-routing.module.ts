import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule), // Lazy load AuthModule
  },
  {
    path: 'project',
    loadChildren: () =>
      import('./project/project.module').then((m) => m.ProjectModule), // Lazy load ProjectModule
  },
  {
    path: 'position',
    loadChildren: () =>
      import('./position/position.module').then((m) => m.PositionModule), // Lazy load PositionModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
