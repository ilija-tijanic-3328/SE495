import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {ParticipationService} from "../../../../services/participation.service";

@Component({
    templateUrl: './attempt-result.component.html'
})
export class AttemptResultComponent implements OnInit {

    attempt: any = null;
    code: string | null = null;

    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        let code: string | null = this.route.snapshot.paramMap.get('code');

        if (code) {
            if (this.authService.isLoggedIn() && this.router.url.startsWith('/quiz/')) {
                this.router.navigate(['/app/quiz', code, 'results']);
                return;
            }

            this.code = code;

            this.participationService.getQuizResultsByCode(code)
                .subscribe({
                    next: data => {
                        this.attempt = data;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Invalid Code",
                            detail: message,
                            sticky: true
                        });
                        if (this.authService.isLoggedIn()) {
                            this.router.navigate(['/app/invitations']);
                        } else {
                            this.router.navigate(['/landing']);
                        }
                    }
                });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: "Invalid Code",
                detail: 'Missing quiz code',
                sticky: true
            });
            this.router.navigate(['/landing']);
        }
    }

}
