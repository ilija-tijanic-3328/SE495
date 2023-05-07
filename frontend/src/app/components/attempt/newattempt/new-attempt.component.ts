import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {ParticipationService} from "../../../services/participation.service";
import {ParticipantQuiz} from "../../../models/response/participant-quiz";
import {AttemptQuestion} from "../../../models/response/attempt-question";
import {finalize, map, takeWhile, timer} from "rxjs";

@Component({
    templateUrl: './new-attempt.component.html'
})
export class NewAttemptComponent implements OnInit {

    attempt: ParticipantQuiz | null = null;
    questions: AttemptQuestion[] = [];
    started: boolean = false;
    durationSeconds: number = 0;
    timeRemaining$ = timer(0, 1000).pipe(
        map(n => (this.durationSeconds - n) * 1000),
        takeWhile(n => n >= 0),
        finalize(() => this.submitAnswers())
    );
    private code: string | null = null;
    answers: any = {}

    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        let code: string | null = this.route.snapshot.paramMap.get('code');

        if (code) {
            if (this.authService.isLoggedIn() && this.router.url.startsWith('/quiz/')) {
                this.router.navigate(['/app/quiz', code]);
                return;
            }

            this.code = code;

            this.participationService.getQuizByCode(code)
                .subscribe({
                    next: data => {
                        this.attempt = data;
                        if (data.start_time) {
                            this.startQuiz('continue');
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

    start(startTime: Date) {
        let minutesAllowed = this.attempt?.quiz?.time_allowed || 0;
        let endTime = startTime.getTime() + minutesAllowed * 60000;
        this.durationSeconds = (endTime - new Date().getTime()) / 1000;
        this.started = true;
    }

    startQuiz(action: string = 'start') {
        if (this.code) {
            this.participationService.startQuiz(this.code)
                .subscribe({
                    next: data => {
                        this.start(new Date(String(data.start_time)));
                        this.questions = data.questions;

                        for (let question of data.questions) {
                            if (question.type == 'Multiple choice') {
                                this.answers[question.id] = [];
                            } else {
                                this.answers[question.id] = null;
                            }
                        }

                        if (action == 'start') {
                            this.messageService.add({
                                severity: 'success',
                                summary: `Quiz started, good luck!`,
                                life: 3000
                            });
                        }
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: `Couldn't ${action} quiz`,
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }
    }

    submitAnswers() {
        this.participationService.saveAnswers(this.attempt?.id, this.answers)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: `Saved answers`,
                        sticky: true
                    });
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: `Couldn't submit answers`,
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

}
