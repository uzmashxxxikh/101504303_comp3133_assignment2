import { gql } from 'apollo-angular';

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      id
      username
      email
      created_at
      updated_at
    }
  }
`;

export const LOGIN_QUERY = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        created_at
        updated_at
      }
    }
  }
`;
