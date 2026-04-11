import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SIGNUP_MUTATION, LOGIN_QUERY } from '../graphql/auth.graphql';
import { AuthPayload, LoginInput, SignupInput, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.currentUserSubject.next(JSON.parse(userStr));
      }
    }
  }

  signup(input: SignupInput): Observable<User> {
    return this.apollo.mutate<{ signup: User }>({
      mutation: SIGNUP_MUTATION,
      variables: { input }
    }).pipe(
      map(result => result.data!.signup)
    );
  }

  login(input: LoginInput): Observable<AuthPayload> {
    return this.apollo.query<{ login: AuthPayload }>({
      query: LOGIN_QUERY,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('No data returned from login query');
        }
        return result.data.login;
      }),
      tap(authPayload => {
        this.setToken(authPayload.token);
        this.setUser(authPayload.user);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(authPayload.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
