import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {ParticipationService} from "../../../../services/participation.service";
import {formatNumber} from "@angular/common";
import {ParticipantAttempt} from "../../../../models/response/participant-attempt";
import {Leaderboard} from "../../../../models/response/leaderboard";

@Component({
    templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit {

    leaderboard: Leaderboard | null = null;

    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        let quizId: string | null = this.route.snapshot.paramMap.get('quizId');

        if (quizId) {
            if (this.authService.isLoggedIn() && this.router.url.startsWith('/quiz/')) {
                this.router.navigate(['/app/quiz', quizId, 'leaderboard']);
                return;
            }

            this.participationService.getQuizLeaderboard(quizId)
                .subscribe({
                    next: data => {
                        data.participants = data.participants.map(p => {
                            let date = new Date(1970, 0, 1);
                            date.setSeconds(p.duration_seconds);
                            p.duration = date;
                            return p;
                        })
                        this.leaderboard = data;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Invalid ID",
                            detail: message,
                            sticky: true
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: "Invalid ID",
                detail: 'Missing quiz id',
                sticky: true
            });
            this.router.navigate(['/landing']);
        }
    }

    protected readonly formatNumber = formatNumber;

    getSeverity(attempt: ParticipantAttempt) {
        if (attempt.percentage > 90) {
            return '#22C55E';
        } else if (attempt.percentage > 75) {
            return '#6366F1';
        } else if (attempt.percentage > 50) {
            return '#F59E0B';
        } else {
            return '#EF4444';
        }
    }

    getColor(index: number) {
        switch (index) {
            case 0:
                return 'gold';
            case 1:
                return 'silver';
            case 2:
                return '#CD7F32';
            default:
                return 'gray';
        }
    }

}
