import {Component} from '@angular/core';
import {ChangePasswordRequest} from "../../models/request/change-password-request";
import {MessageService} from "primeng/api";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ChangePasswordComponent {

    protected request: ChangePasswordRequest = new ChangePasswordRequest();

    constructor(private messageService: MessageService, private authService: AuthService) {
    }

    onSubmit(changePasswordForm: NgForm) {
        this.messageService.clear();
        this.authService.changePassword(this.request)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password changed',
                        detail: 'Your password has been changed',
                        sticky: true
                    });
                    changePasswordForm.resetForm();
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Password change failed',
                        detail: message,
                        sticky: true
                    });
                }
            })
    }

}
