import {Component} from '@angular/core';
import {ResetPasswordRequest} from "../../models/request/reset-password-request";
import {MessageService} from "primeng/api";

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

    protected request: ResetPasswordRequest = new ResetPasswordRequest();

    constructor(private messageService: MessageService) {
    }

    onSubmit() {
        // TODO
    }

}
