import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';


const routes: Routes = [

  { path: 'list', component: ProjectListComponent },
];
@NgModule({
  declarations: [ ProjectListComponent, CreateProjectComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class ProjectModule { }
