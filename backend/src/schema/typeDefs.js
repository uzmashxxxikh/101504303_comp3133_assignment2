const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: [Employee!]!
    getEmployeeById(id: ID!): Employee
    searchEmployees(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    signup(input: SignupInput!): User!
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployeeById(id: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployeeById(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
