import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {RegistrationRequest} from "../../../models/request/registration-request";

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

    constructor(public layoutService: LayoutService) {
    }

    onSubmit() {
        // TODO
    }
}
