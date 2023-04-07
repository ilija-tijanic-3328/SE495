import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {RegistrationRequest} from "../../../models/request/registration-request";
import {catchError, of} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";

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
                private messageService: MessageService) {
    }

    onSubmit() {
        this.messageService.clear();
        this.authService.register(this.request)
            .pipe(catchError((error) => this.handleError(error, this)))
            .subscribe(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmation email sent',
                    detail: 'Confirm your email address to start using your account',
                    sticky: true
                });
                this.request = new RegistrationRequest();
            });
    }

    private handleError(error: HttpErrorResponse, component: this) {
        const message = error?.error?.error || 'Unknown error occurred';
        component.messageService.add({
            severity: 'error',
            summary: 'Registration failed',
            detail: message,
            sticky: true
        });
        return of({});
    }

}
