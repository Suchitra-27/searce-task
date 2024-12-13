import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionListComponent } from './position-list/position-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CreatePositionComponent } from './create-position/create-position.component';
import { BaseChartDirective } from 'ng2-charts';

const routes: Routes = [
  { path: 'list', component: PositionListComponent },
];

@NgModule({
  declarations: [PositionListComponent, CreatePositionComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconButton,
    ReactiveFormsModule,
    BaseChartDirective,
    RouterModule.forChild(routes)
  ]
})
export class PositionModule { }
