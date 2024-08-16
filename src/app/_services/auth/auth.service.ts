import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from './models/auth.response';
import { AuthRequest } from './models/auth.request';
import { environment } from '../../../environments/environment.development';
import { User } from '../../_models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private permissions = signal<string[]>([]);
  private user = signal<User | null>(null);
  public isAuthenticated = computed<boolean>(() => this.user() !== null);

  public authenticate(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth`, authRequest)
      .pipe(
        tap((x) => {
          this.permissions.set(x.permissions);
          this.user.set(x.user);
          localStorage.setItem('token', x.token);
          localStorage.setItem('refresh-token', x.refreshToken);
        })
      );
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    this.permissions.set([]);
    this.user.set(null);
  }

  public getPermissions() {
    return this.permissions();
  }

  public hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  public addPermission(permission: string): void {
    if (!this.permissions().includes(permission)) {
      this.permissions.update((currentPermissions) => [
        ...currentPermissions,
        permission,
      ]);
    }
  }

  public revokePermission(permissionName: string): void {
    this.permissions.update((currentPermissions) => [
      ...currentPermissions.filter((x) => x !== permissionName),
    ]);
  }
}

export enum PermissionsEnum {
  POST_CREATE = 'create-post',
  POST_DELETE = 'delete-post',
  POST_UPDATE = 'update-post',
}
