import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {Quiz} from "../../../../models/response/quiz";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {QuizConfig} from "../../../../models/response/quiz-config";
import {Observable} from "rxjs";

@Component({
    templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {

    quiz: Quiz = {}
    quizConfigs: QuizConfig[] = [];
    minDate: Date = new Date();
    startTimeDisabled: boolean = false;
    allDisabled: boolean = false;

    constructor(private messageService: MessageService, private quizService: QuizService, private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        let quizId: number = Number(this.route.snapshot.queryParamMap.get('quizId'));
        if (quizId) {
            this.quizService.loadQuiz(quizId)
                .subscribe({
                    next: quiz => {
                        this.quiz = quiz || {};

                        if (this.quiz.id) {
                            let now = new Date();

                            if (this.quiz.status == 'ARCHIVED' || (this.quiz.end_time && now > this.quiz.end_time)) {
                                this.allDisabled = true;
                            }

                            if (this.quiz.start_time && now > this.quiz.start_time) {
                                this.startTimeDisabled = true;
                            }
                        }
                    }
                });
        }
        this.loadQuizConfigs(quizId);
    }

    loadQuizConfigs(quizId?: any) {
        let observable: Observable<QuizConfig[]> = quizId ? this.quizService.getQuizConfigs(quizId)
            : this.quizService.getDefaultQuizConfigs();

        observable.subscribe({
            next: quizConfigs => {
                this.quizConfigs = quizConfigs.map(config => {
                    config.value = String(config.value) == 'true';
                    return config;
                });
            },
            error: error => {
                const message = error?.error?.error || 'Unknown error occurred';
                this.messageService.add({
                    severity: 'error',
                    summary: "Couldn't load quiz configuration",
                    detail: message,
                    sticky: true
                });
            }
        });
    }

    onNextStep(quizForm: NgForm) {
        if (this.quiz.id) {
            if (quizForm.untouched && quizForm.valid) {
                this.updateConfigs();
            } else {
                this.quizService.updateQuiz(this.quiz)
                    .subscribe({
                        next: () => {
                            this.updateConfigs();
                        },
                        error: error => {
                            const message = error?.error?.error || 'Unknown error occurred';
                            this.messageService.add({
                                severity: 'error',
                                summary: "Quiz update failed",
                                detail: message,
                                sticky: true
                            });
                        }
                    });
            }
        } else {
            this.quizService.createQuiz(this.quiz)
                .subscribe({
                    next: data => {
                        this.quiz.id = data.id;
                        this.updateConfigs();
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Quiz creation failed",
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }

    }

    private updateConfigs() {
        if (!this.allDisabled) {
            this.quizService.updateQuizConfigs(this.quiz?.id, this.quizConfigs)
                .subscribe({
                    next: () => {
                        this.nextStep();
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Couldn't update quiz configuration",
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }
    }

    private nextStep() {
        this.router.navigate(['/app/quizzes/create/2'],
            {queryParams: {quizId: this.quiz.id}, skipLocationChange: true});
    }

}
