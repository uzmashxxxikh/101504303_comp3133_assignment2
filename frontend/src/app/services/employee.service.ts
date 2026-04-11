import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  GET_ALL_EMPLOYEES,
  GET_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../graphql/employee.graphql';
import { Employee, EmployeeInput, EmployeeUpdateInput } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query<{ getAllEmployees: Employee[] }>({
      query: GET_ALL_EMPLOYEES
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('No data returned from getAllEmployees query');
        }
        return result.data.getAllEmployees;
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee | null> {
    return this.apollo.query<{ getEmployeeById: Employee }>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('No data returned from getEmployeeById query');
        }
        return result.data.getEmployeeById;
      })
    );
  }

  searchEmployees(designation?: string, department?: string): Observable<Employee[]> {
    return this.apollo.query<{ searchEmployees: Employee[] }>({
      query: SEARCH_EMPLOYEES,
      variables: { designation, department }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('No data returned from searchEmployees query');
        }
        return result.data.searchEmployees;
      })
    );
  }

  addEmployee(input: EmployeeInput): Observable<Employee> {
    return this.apollo.mutate<{ addEmployee: Employee }>({
      mutation: ADD_EMPLOYEE,
      variables: { input }
    }).pipe(
      map(result => result.data!.addEmployee)
    );
  }

  updateEmployee(id: string, input: EmployeeUpdateInput): Observable<Employee> {
    return this.apollo.mutate<{ updateEmployeeById: Employee }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, input }
    }).pipe(
      map(result => result.data!.updateEmployeeById)
    );
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteEmployeeById: boolean }>({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    }).pipe(
      map(result => result.data!.deleteEmployeeById)
    );
  }

  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
