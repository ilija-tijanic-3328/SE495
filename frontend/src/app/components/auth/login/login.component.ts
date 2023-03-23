import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {LoginRequest} from "../../../models/request/login-request";

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

    constructor(public layoutService: LayoutService) {
    }

    onSubmit() {
        // TODO
    }
}
