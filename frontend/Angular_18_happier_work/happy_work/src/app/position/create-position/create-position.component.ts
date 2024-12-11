import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionService } from '../position.service';
import { ActivatedRoute } from '@angular/router';

export interface DialogData {
  designation: string;
  project_id: string;
  department_id: string;
  budget: number;
  location: string;
}

@Component({
  selector: 'app-create-position',
  templateUrl: './create-position.component.html',
  styleUrls: ['./create-position.component.scss'],
  standalone: false
})
export class CreatePositionComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreatePositionComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private positionService = inject(PositionService);

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}
  

  createPositionForm: FormGroup = this.fb.group({
    designation: ['', Validators.required],
    // project_id: ['', Validators.required],
    department_id: ['', Validators.required],  // Department field with required validation
    budget: ['', [Validators.required, Validators.min(1)]],
    location: ['', Validators.required],
  });

  departments: Array<{ id: string, name: string }> = [];  // To hold the department data

  ngOnInit(): void {
    // Fetch departments data when the component is initialized
    this.fetchDepartments();
  }

  fetchDepartments(): void {
    this.positionService.getAllDepartments().subscribe((response) => {
      this.departments = response.data; // Assume response has a 'data' field with the department list
    });
  }

  getRequiredError(key: any): any {
    return this.createPositionForm.controls[key].hasError('required');
  }

  getValidationErrors(key: any): any {
    return (
      (this.createPositionForm.controls[key].touched ||
        this.createPositionForm.controls[key].dirty) &&
      this.createPositionForm.controls[key].errors
    );
  }

  getFormControlValue(key: any): any {
    return this.createPositionForm.get(key)?.value;
  }

  close(): void {
    this.dialogRef.close();
  }

  createPosition(): void {
    const positionData = {
      designation: this.getFormControlValue('designation'),
      project_id: this.data.project_id,
      department_id: this.getFormControlValue('department_id'),
      budget: this.getFormControlValue('budget'),
      location: this.getFormControlValue('location'),
    };

    // Call the service to create the position via API
    this.positionService.createPosition(positionData).subscribe(
      (response) => {
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Error creating position:', error);
      }
    );
  }
}
