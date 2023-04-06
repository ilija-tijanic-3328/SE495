import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {LoginRequest} from "../../../models/request/login-request";
import {AuthService} from "../../../services/auth.service";
import {catchError, of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";

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

    constructor(protected layoutService: LayoutService, private authService: AuthService, private messageService: MessageService) {
    }

    onSubmit() {
        this.authService.login(this.request)
            .pipe(catchError((error) => this.handleError(error, this)))
            .subscribe(data => {
                if (data.access_token) {
                    this.authService.saveToken(data.access_token);
                    window.location.reload();
                }
            });
    }

    private handleError(error: HttpErrorResponse, component: this) {
        const message = error?.error?.error || 'Unknown error occurred';
        component.showErrorMessage(message);
        return of({});
    }

    private showErrorMessage(message: string) {
        this.messageService.add({severity: 'error', summary: 'Login failed', detail: message, life: 6000});
    }

}
