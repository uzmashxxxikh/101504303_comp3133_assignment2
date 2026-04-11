# COMP3133 Assignment 1 – Employee Management GraphQL API

Backend application for **COMP3133 – Full Stack Development II** Assignment 1.  
This project implements an **Employee Management System** backend using **Node.js, Express, Apollo GraphQL, and MongoDB Atlas**.

---

## Features

- User **signup** with encrypted passwords using bcrypt.
- User **login** with JWT token generation (login via username or email + password).
- Employee management operations:
  - Get all employees
  - Add new employee (with salary validation)
  - Get employee by ID
  - Update employee by ID
  - Delete employee by ID
  - Search employees by **designation** and/or **department**
- Employee profile pictures stored on **Cloudinary**; the GraphQL API stores the Cloudinary image URL.
- Validation via Mongoose schema rules and custom error messages.

---

## Technologies Used

- Node.js / Express
- Apollo Server (GraphQL with Express)
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Cloudinary for image hosting
- Postman and Apollo Sandbox for testing

---

## GraphQL API Overview

### Queries

- `login(input: LoginInput!): AuthPayload!`
- `getAllEmployees: [Employee!]!`
- `getEmployeeById(id: ID!): Employee`
- `searchEmployees(designation: String, department: String): [Employee!]!`

### Mutations

- `signup(input: SignupInput!): User!`
- `addEmployee(input: EmployeeInput!): Employee!`
- `updateEmployeeById(id: ID!, input: EmployeeUpdateInput!): Employee!`
- `deleteEmployeeById(id: ID!): Boolean!`

All requests and responses use JSON.

---

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/COMP3133_101504303_Assignment1.git
cd COMP3133_101504303_Assignment1
