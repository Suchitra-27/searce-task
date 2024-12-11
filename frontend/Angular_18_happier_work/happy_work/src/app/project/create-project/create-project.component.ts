import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProjectService } from '../project.service';

export interface DialogData {
  project_name: string;
  project_description: string;
  co_planner: string;
  project_budget: string;
}

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  standalone: false
})
export class CreateProjectComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateProjectComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  createProjectForm: FormGroup = this.fb.group({
    project_name: ['', Validators.required],
    project_description: ['', Validators.required],
    co_planner: ['', Validators.required],
    project_budget: ['', Validators.required],
  });

  coPlanners: Array<{ id: string, name: string }> = [];

  ngOnInit(): void {
    // Fetch co-planners data when the component is initialized
    this.fetchCoPlanners();
  }

  fetchCoPlanners(): void {
    this.projectService.getCoPlanners().subscribe((response) => {
      this.coPlanners = response.data; // Assume response has a 'data' field with co-planner list
    });
  }

  getRequiredError(key: any): any {
    return this.createProjectForm.controls[key].hasError('required');
  }

  getValidationErrors(key: any): any {
    return (
      (this.createProjectForm.controls[key].touched ||
        this.createProjectForm.controls[key].dirty) &&
      this.createProjectForm.controls[key].errors
    );
  }

  getFormControlValue(key: any): any {
    return this.createProjectForm.get(key)?.value;
  }

  close(): void {
    this.dialogRef.close();
  }

  update(): void {
    // Prepare the data object for the API
    const projectData = {
      name: this.getFormControlValue('project_name'),
      project_description: this.getFormControlValue('project_description'),
      project_budget: this.getFormControlValue('project_budget'),
      co_planner: this.getFormControlValue('co_planner'),  // Send the selected co-planner id
    };

    // Call the service to create the project via API
    this.projectService.createProject(projectData).subscribe(
      (response) => {
        this.dialogRef.close(response); // Close modal and pass back the response
      },
      (error) => {
        console.error('Error creating project:', error);
      }
    );
  }
}
