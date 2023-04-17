import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Quiz} from "../../../../models/response/quiz";
import {Question} from "../../../../models/response/question";

@Component({
    templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

    quiz: Quiz | null = null;
    questions: Question[] = [];
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
                        if (quiz) {
                            this.quiz = quiz;

                            let now = new Date();

                            if (this.quiz?.status == 'ARCHIVED' || (this.quiz?.end_time && now > this.quiz.end_time)) {
                                this.allDisabled = true;
                            }

                            this.loadQuestions(quizId);
                        } else {
                            this.router.navigate(['/app/quizzes/create/1']);
                        }
                    }
                });
        } else {
            this.router.navigate(['/app/quizzes/create/1']);
        }
    }

    private loadQuestions(quizId: any) {
        this.quizService.getQuestions(quizId)
            .subscribe({
                next: questions => {
                    this.questions = questions;
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load questions",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    onPrevStep() {
        this.router.navigate(['/app/quizzes/create/2'], {
            queryParams: {quizId: this.quiz?.id},
            skipLocationChange: true
        });
    }

    onNextStep() {

    }

}
