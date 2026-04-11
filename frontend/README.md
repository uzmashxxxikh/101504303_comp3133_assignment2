# Employee Management System - Frontend

Angular frontend application for COMP 3133 Assignment 2 by Uzma Shaikh (Student ID: 101504303).

## Features

- User Authentication (Login/Signup)
- Employee CRUD Operations
- Search by Department and Designation
- Profile Picture Upload
- Responsive Design with Angular Material
- GraphQL Integration with Apollo Client

## Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v21 or higher)
- Backend API running on http://localhost:4000/graphql

## Installation

```bash
npm install
```

## Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

## Build

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Backend Configuration

Update the GraphQL endpoint in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  graphqlEndpoint: 'http://localhost:4000/graphql'
};
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── employee-list/
│   │   ├── employee-form/
│   │   ├── employee-details/
│   │   └── confirm-dialog/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── employee.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── employee.model.ts
│   ├── graphql/
│   │   ├── auth.graphql.ts
│   │   └── employee.graphql.ts
│   └── graphql.module.ts
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## Technologies Used

- Angular 21
- Apollo Client for GraphQL
- Angular Material
- RxJS
- TypeScript

## Author

Uzma Shaikh - 101504303
