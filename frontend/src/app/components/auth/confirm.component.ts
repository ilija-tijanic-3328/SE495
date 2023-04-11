import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MessageService} from "primeng/api";

@Component({template: ''})
export class ConfirmComponent implements OnInit {

    constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        let token = this.route.snapshot.queryParamMap.get('token');
        if (token) {
            this.authService.confirmEmailToken(token)
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Email address confirmed',
                            detail: 'You can now sign in to your account',
                            sticky: true
                        });
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Email confirmation failed',
                            detail: message,
                            sticky: true
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Email confirmation failed',
                detail: 'Missing verification token',
                sticky: true
            });
        }
        this.router.navigate(['/auth/login']);
    }

}
