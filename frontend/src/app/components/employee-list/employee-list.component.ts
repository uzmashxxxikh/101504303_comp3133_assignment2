import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['photo', 'name', 'email', 'designation', 'department', 'salary', 'date_of_joining', 'actions'];
  loading = false;
  searchForm: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      designation: [''],
      department: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.onSearch();
      });
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(error.message || 'Failed to load employees', 'Close', { duration: 5000 });
      }
    });
  }

  onSearch(): void {
    const { designation, department } = this.searchForm.value;
    
    if (!designation && !department) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployees(designation, department).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(error.message || 'Search failed', 'Close', { duration: 5000 });
      }
    });
  }

  viewDetails(employee: Employee): void {
    this.dialog.open(EmployeeDetailsComponent, {
      width: '600px',
      data: employee
    });
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
            this.loadEmployees();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Failed to delete employee', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
