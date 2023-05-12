import {Component, OnInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {LoginRequest} from "../../../models/request/login-request";
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    protected request: LoginRequest = new LoginRequest();
    private forwardUrl: string | null = null;

    constructor(protected layoutService: LayoutService, private authService: AuthService,
                private messageService: MessageService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.forwardUrl = this.route.snapshot.queryParamMap.get('forwardUrl');
        let unlockToken = this.route.snapshot.queryParamMap.get('unlockToken');

        if (unlockToken) {
            this.authService.unlockAccount(unlockToken)
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Account Unlocked',
                            detail: 'We recommend changing your password and turning on two-factor authentication to secure your account.',
                            sticky: true
                        });
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Unlock account failed',
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }

        if (this.authService.savedEmail) {
            this.request.email = this.authService.savedEmail;
        }
    }

    onSubmit() {
        this.messageService.clear();
        this.authService.login(this.request)
            .subscribe({
                next: data => {
                    if (data.two_factor_token) {
                        this.authService.save2FactorToken(data.two_factor_token);
                        this.router.navigate(['/auth/two-factor'], {queryParams: {forwardUrl: this.forwardUrl}});
                    } else if (data.access_token) {
                        this.authService.saveToken(data.access_token);
                        this.authService.saveUserName(data.user_name);
                        this.authService.saveRole(data.role);

                        if (data.last_logged_in) {
                            this.messageService.add({
                                severity: 'info',
                                summary: `Welcome back ${data.user_name}!`,
                                life: 3000
                            });
                        }

                        if (this.forwardUrl) {
                            this.router.navigate([this.forwardUrl]);
                        } else {
                            if (data.role == 'ADMIN') {
                                this.router.navigate(['/admin/users']);
                            } else {
                                this.router.navigate(['/app/quizzes']);
                            }
                        }
                    }
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login failed',
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

}
