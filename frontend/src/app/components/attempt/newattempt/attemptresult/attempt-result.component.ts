import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {ParticipationService} from "../../../../services/participation.service";
import {formatNumber} from "@angular/common";

@Component({
    templateUrl: './attempt-result.component.html'
})
export class AttemptResultComponent implements OnInit {

    attempt: any = null;
    code: string | null = null;
    leaderboardEnabled: boolean = false;
    statsEnabled: boolean = false;
    creator: boolean = false;

    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
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
                        let date = new Date(1970, 0, 1);
                        date.setSeconds(data.duration_seconds);
                        data.duration = date;

                        this.attempt = data;

                        let currentUserId = this.authService.getUserId();
                        if (currentUserId && data.quiz.user_id == Number(currentUserId)) {
                            this.creator = true;
                        }

                        if (data.quiz.configs) {
                            this.leaderboardEnabled = this.creator || data?.quiz?.configs
                                .find((c: any) => c.config == 'Participants can view leaderboard')?.value == 'true';
                            this.statsEnabled = this.creator || data?.quiz?.configs
                                .find((c: any) => c.config == 'Participants can view report')?.value == 'true';
                        }
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

    getTooltipText(component: string) {
        if (!this.isLoggedIn()) {
            return "Only logged in users can access " + component;
        }
        if (component == 'leaderboard' && !this.leaderboardEnabled) {
            return "The creator of this quiz has disabled the leaderboard";
        }
        if (component == 'stats' && !this.statsEnabled) {
            return "The creator of this quiz has disabled the stats report";
        }
        return '';
    }

    getSeverity(attempt: any) {
        if (attempt?.percentage > 90) {
            return '#22C55E';
        } else if (attempt?.percentage > 80) {
            return '#3B82F6';
        } else if (attempt?.percentage > 70) {
            return '#a563f1';
        } else if (attempt?.percentage > 60) {
            return '#ee842d';
        } else if (attempt?.percentage > 50) {
            return '#efcb16';
        } else {
            return '#EF4444';
        }
    }

    protected readonly formatNumber = formatNumber;
}
