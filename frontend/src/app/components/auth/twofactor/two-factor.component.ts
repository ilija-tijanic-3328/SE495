import {Component, OnInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {TwoFactorLoginRequest} from "../../../models/request/two-factor-login-request";

@Component({
    selector: 'app-two-factor',
    templateUrl: './two-factor.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class TwoFactorComponent implements OnInit {

    protected request: TwoFactorLoginRequest = new TwoFactorLoginRequest();
    private forwardUrl: string | null = null;

    constructor(protected layoutService: LayoutService, private authService: AuthService,
                private messageService: MessageService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.forwardUrl = this.route.snapshot.queryParamMap.get('forwardUrl');
    }

    onSubmit() {
        this.messageService.clear();
        this.request.token = this.authService.get2FactorToken();
        this.authService.loginTwoFactor(this.request)
            .subscribe({
                next: data => {
                    if (data.access_token) {
                        this.authService.logout();
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
                    } else {
                        this.authService.logout();
                        this.router.navigate(['/auth/login'], {queryParams: {forwardUrl: this.forwardUrl}})
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
