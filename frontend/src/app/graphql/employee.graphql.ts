import { gql } from 'apollo-angular';

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($id: ID!) {
    getEmployeeById(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployees(designation: $designation, department: $department) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployeeById(id: $id, input: $input) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployeeById(id: $id)
  }
`;
