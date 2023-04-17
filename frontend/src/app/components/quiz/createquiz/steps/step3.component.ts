import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Quiz} from "../../../../models/response/quiz";

@Component({
    templateUrl: './step3.component.html'
})
export class Step3Component implements OnInit {

    quiz: Quiz | null = null;

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

                        } else {
                            this.router.navigate(['/app/quizzes/create/1']);
                        }
                    }
                });
        } else {
            this.router.navigate(['/app/quizzes/create/1']);
        }
    }

}
