import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  isEditMode = false;
  employeeId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    if (!this.employeeId) return;

    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        if (employee) {
          this.employeeForm.patchValue({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            gender: employee.gender,
            designation: employee.designation,
            salary: employee.salary,
            date_of_joining: new Date(employee.date_of_joining),
            department: employee.department
          });
          this.imagePreview = employee.employee_photo || null;
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(error.message || 'Failed to load employee', 'Close', { duration: 5000 });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 10MB', 'Close', { duration: 5000 });
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.snackBar.open('Only JPG, JPEG, PNG, and GIF files are allowed', 'Close', { duration: 5000 });
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid) {
      this.loading = true;

      const formData = { ...this.employeeForm.value };

      if (this.selectedFile) {
        try {
          formData.employee_photo = await this.employeeService.convertImageToBase64(this.selectedFile);
        } catch (error) {
          this.snackBar.open('Failed to process image', 'Close', { duration: 5000 });
          this.loading = false;
          return;
        }
      }

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, formData).subscribe({
          next: () => {
            this.snackBar.open('Employee updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(error.message || 'Failed to update employee', 'Close', { duration: 5000 });
          }
        });
      } else {
        this.employeeService.addEmployee(formData).subscribe({
          next: () => {
            this.snackBar.open('Employee added successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(error.message || 'Failed to add employee', 'Close', { duration: 5000 });
          }
        });
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
