import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {ParticipationService} from "../../../services/participation.service";

@Component({
    templateUrl: './new-attempt.component.html'
})
export class NewAttemptComponent implements OnInit {


    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        let code: string | null = this.route.snapshot.paramMap.get('code');

        if (code) {
            if (this.authService.isLoggedIn() && this.router.url.startsWith('/quiz/')) {
                this.router.navigate(['/app/quiz', code]);
            }

            this.participationService.getQuizByCode(code)
                .subscribe({
                    next: data => {

                    },
                    error: error => {

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
