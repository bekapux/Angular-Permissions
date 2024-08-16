import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HasPermissionDirective } from './_directives/has-permission.directive';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService, PermissionsEnum } from './_services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HasPermissionDirective, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public authService = inject(AuthService);
  public permissions = PermissionsEnum;

  public addPermissionForm = new FormGroup({
    permissionName: new FormControl('', Validators.required),
  });

  public onSubmit(): void {
    if (this.addPermissionForm.invalid) {
      return;
    }

    this.authService.addPermission(
      this.addPermissionForm.value.permissionName! ?? ''
    );

    this.addPermissionForm.reset();
  }

  public rerender() {
    console.log('rerender');
    return true;
  }

  public removePermission(permissionName: string): void {
    this.authService.revokePermission(permissionName);
  }
}
