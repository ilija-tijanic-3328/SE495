import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {RegistrationRequest} from "../../../models/request/registration-request";
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegisterComponent {

    protected request: RegistrationRequest = new RegistrationRequest();
    termsAccepted: boolean = false;
    showTermsModal: boolean = false;
    showPrivacyModal: boolean = false;

    constructor(public layoutService: LayoutService, private authService: AuthService,
                private messageService: MessageService, private router: Router) {
    }

    onSubmit() {
        this.messageService.clear();
        this.authService.register(this.request)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmation email sent',
                        detail: 'Confirm your email address to start using your account',
                        sticky: true
                    });
                    this.router.navigate(['/auth/login'])
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Registration failed',
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

}
