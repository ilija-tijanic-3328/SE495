import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {ForgotPasswordRequest} from "../../../models/request/forgot-password-request";
import {MessageService} from "primeng/api";

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

    request: ForgotPasswordRequest = new ForgotPasswordRequest();

    constructor(public layoutService: LayoutService, private messageService: MessageService) {
    }

    onSubmit() {
        // TODO
        this.messageService.add({
            severity: "info",
            life: 6000,
            summary: "Request sent",
            detail: "Instructions for resetting your password will be sent if the email address is in our system."
        });
    }
}
