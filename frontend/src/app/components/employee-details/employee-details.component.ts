import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: Employee
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
