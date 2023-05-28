import {Component, OnInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {ResetPasswordRequest} from "../../../models/request/reset-password-request";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ResetPasswordComponent implements OnInit {

    protected request: ResetPasswordRequest = new ResetPasswordRequest();
    protected validToken: boolean = false;

    constructor(protected layoutService: LayoutService, private messageService: MessageService,
                private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    }

    ngOnInit() {
        let token = this.route.snapshot.queryParamMap.get('token');
        if (token) {
            this.authService.validatePasswordResetToken(token)
                .subscribe({
                    next: () => {
                        this.validToken = true;
                        this.request.token = token || undefined;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Invalid token',
                            detail: message,
                            sticky: true
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Cannot reset password',
                detail: 'Missing token',
                sticky: true
            });
        }
    }

    onSubmit() {
        this.authService.resetPassword(this.request)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password changed',
                        detail: 'You can now sign in to your account with your new password',
                        sticky: true
                    });
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Password reset failed',
                        detail: message,
                        sticky: true
                    });
                }
            })
    }

}
