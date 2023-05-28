import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {ParticipationService} from "../../../../services/participation.service";
import {QuizStats} from "../../../../models/response/quiz-stats";

@Component({
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

    quiz: QuizStats | null = null;
    code: string | null = null;
    creator: boolean = false;
    quizScores: any;
    quizScoreChartOptions: any;
    questionCompletion: any;
    questionCompletionChartOptions: any;
    canViewLeaderboard: boolean = false;

    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        let quizId: string | null = this.route.snapshot.paramMap.get('quizId');

        if (quizId) {
            if (this.authService.isLoggedIn() && this.router.url.startsWith('/quiz/')) {
                this.router.navigate(['/app/quiz', quizId, 'stats']);
                return;
            }

            this.participationService.getQuizStats(quizId)
                .subscribe({
                    next: data => {
                        this.quiz = data;

                        let currentUserId = this.authService.getUserId();
                        if (currentUserId && data.user_id == Number(currentUserId)) {
                            this.creator = true;
                        }

                        this.canViewLeaderboard = data?.configs
                            .find((c: any) => c.config == 'Participants can view leaderboard')?.value == 'true';


                        this.initCharts();
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

    private initCharts() {
        if (!this.quiz?.stats) {
            return;
        }

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.quizScores = {
            labels: this.quiz.stats.quiz_scores.map(q => q.label),
            datasets: [
                {
                    data: this.quiz.stats.quiz_scores.map(q => q.value),
                    backgroundColor: ['#22C55E', '#3B82F6', '#a563f1', '#ee842d', '#efcb16', '#EF4444', '#dee2e6']
                }
            ]
        };

        this.questionCompletion = {
            labels: this.quiz.stats.question_completion.map(q => q.label),
            datasets: [
                {
                    data: this.quiz.stats.question_completion.map(q => q.value),
                    backgroundColor: documentStyle.getPropertyValue('--primary-color')
                }
            ]
        };

        this.quizScoreChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            let sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }

                            if (context.parsed !== null) {
                                label += context.parsed + ' (' + (context.parsed * 100 / sum).toFixed(2) + '%)';
                            }

                            return label;
                        }
                    }
                }
            }
        };

        this.questionCompletionChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
}
