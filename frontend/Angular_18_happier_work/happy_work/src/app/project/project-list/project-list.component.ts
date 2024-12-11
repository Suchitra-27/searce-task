import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: false
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private projectServie: ProjectService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.projectServie.getAllProject().subscribe(
      (response) => {
        this.projects = response.data;
        
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }
  openAddProject(): void {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      (result);
      if (result !== undefined) {
        this.fetchProjects();
      }
    });

  }

  openPositionDetails(projectId: string) {
    this.route.navigate(['position/list'], { queryParams: { id: projectId } });
  }
}
