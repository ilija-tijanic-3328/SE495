import {Component, OnInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {ResetPasswordRequest} from "../../../models/request/reset-password-request";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ResetPasswordComponent implements OnInit {

    protected request: ResetPasswordRequest = new ResetPasswordRequest();
    protected validToken: boolean = false;

    constructor(protected layoutService: LayoutService, private messageService: MessageService,
                private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        let token = this.route.snapshot.queryParamMap.get("token");

        if (token) {
            // TODO
            this.validToken = true;
        } else {
            this.onError("Missing token", "A valid token must be provided.");
        }
    }

    onSubmit() {
        // TODO
    }

    onError(summary: string, detail: string) {
        this.messageService.add({
            severity: "error",
            life: 7000,
            summary: summary,
            detail: detail
        });
        this.router.navigate(["/"]);
    }

}
