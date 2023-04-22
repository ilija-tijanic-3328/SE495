import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {Quiz} from "../../../../models/response/quiz";
import {NgForm} from "@angular/forms";
import {QuizConfig} from "../../../../models/response/quiz-config";
import {Observable} from "rxjs";

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html'
})
export class Step1Component implements OnChanges {

    @Input() quiz: Quiz = {};
    @Output() quizChange = new EventEmitter<Quiz>();
    @Output() indexChange = new EventEmitter<number>();
    quizConfigs: QuizConfig[] = [];
    minDate: Date = new Date();
    startTimeDisabled: boolean = false;
    allDisabled: boolean = false;
    configTouched: boolean = false;


    constructor(private messageService: MessageService, private quizService: QuizService) {
    }

    ngOnChanges(): void {
        if (this.quiz.id) {
            let now = new Date();

            if (this.quiz.status == 'ARCHIVED' || (this.quiz.end_time && now > this.quiz.end_time)) {
                this.allDisabled = true;
            }

            if (this.quiz.start_time && now > this.quiz.start_time) {
                this.startTimeDisabled = true;
            }
        }
        this.loadQuizConfigs(this.quiz.id);
    }

    loadQuizConfigs(quizId?: any) {
        let observable: Observable<QuizConfig[]> = quizId ? this.quizService.getConfigs(quizId)
            : this.quizService.getDefaultConfigs();

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
            this.quizService.updateConfigs(this.quiz.id, this.quizConfigs)
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
        this.quizChange.emit(this.quiz);
        this.indexChange.next(1);
    }

}
