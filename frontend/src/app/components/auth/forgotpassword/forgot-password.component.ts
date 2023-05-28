import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ForgotPasswordComponent {

    email: string = '';

    constructor(public layoutService: LayoutService, private messageService: MessageService,
                private authService: AuthService) {
    }

    onSubmit() {
        this.authService.forgotPassword(this.email)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: "success",
                        sticky: true,
                        summary: "Request sent",
                        detail: "Instructions for resetting your password will be sent if the email address is in our system."
                    });
                },
                error: () => {
                    this.messageService.add({
                        severity: "error",
                        sticky: true,
                        summary: "Request failed",
                        detail: "Unknown error occurred"
                    });
                }
            });
    }

}
