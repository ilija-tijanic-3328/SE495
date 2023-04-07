import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {LoginRequest} from "../../../models/request/login-request";
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

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
export class LoginComponent {

    request: LoginRequest = new LoginRequest();

    constructor(protected layoutService: LayoutService, private authService: AuthService,
                private messageService: MessageService, private router: Router) {
    }

    onSubmit() {
        this.messageService.clear();
        this.authService.login(this.request)
            .subscribe({
                next: data => {
                    if (data.two_factor_token) {
                        this.authService.save2FactorToken(data.two_factor_token);
                        this.router.navigate(['/auth/two-factor']);
                    } else if (data.access_token) {
                        this.authService.saveToken(data.access_token);
                        this.authService.saveUserName(data.user_name);
                        window.location.reload();
                        this.messageService.add({severity: 'info', summary: `Welcome back ${data.user.name}`});
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
