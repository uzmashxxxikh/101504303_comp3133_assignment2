export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  designation: string;
  salary: number;
  date_of_joining: Date;
  department: string;
  employee_photo?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  designation: string;
  salary: number;
  date_of_joining: Date;
  department: string;
  employee_photo?: string;
}

export interface EmployeeUpdateInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  designation?: string;
  salary?: number;
  date_of_joining?: Date;
  department?: string;
  employee_photo?: string;
}
