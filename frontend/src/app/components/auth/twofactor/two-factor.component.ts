import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
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
export class TwoFactorComponent {

    protected request: TwoFactorLoginRequest = new TwoFactorLoginRequest();

    constructor(protected layoutService: LayoutService, private authService: AuthService,
                private messageService: MessageService, private router: Router) {
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
                        window.location.reload();
                        if (data.last_logged_in) {
                            this.messageService.add({
                                severity: 'info',
                                summary: `Welcome back ${data.user.name}`,
                                life: 4000
                            });
                        }
                    } else {
                        this.authService.logout();
                        this.router.navigate(['/auth/login'])
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
