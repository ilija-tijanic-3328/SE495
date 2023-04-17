import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {QuizService} from "../../../services/quiz.service";
import {Quiz} from "../../../models/response/quiz";

@Component({
    templateUrl: './create-quiz.component.html',
    styles: [`

    `]
})
export class CreateQuizComponent implements OnInit {

    items: MenuItem[] = [
        {label: 'Basic Information', routerLink: '1', skipLocationChange: true},
        {label: 'Questions & Answers', routerLink: '2', skipLocationChange: true},
        {label: 'Invitations', routerLink: '3', skipLocationChange: true}
    ];

    activeIndex: number = 0;

    title = 'Create Quiz';

    quiz: Quiz | null = null;

    constructor(private router: Router, private quizService: QuizService, private route: ActivatedRoute) {
    }

    onActiveIndexChange(event: any) {
        this.activeIndex = event;
    }

    ngOnInit(): void {
        let quizId: number = Number(this.route.snapshot.queryParamMap.get('quizId'));
        if (quizId) {
            this.quizService.loadQuiz(quizId)
                .subscribe({
                    next: quiz => {
                        this.quiz = quiz;
                        if (this.quiz?.title) {
                            this.title = this.quiz.title;
                            this.items.map(item => {
                                item.queryParams = {quizId: quizId};
                                return item;
                            });
                        }
                    }
                });
        }
        this.router.navigate(['/app/quizzes/create/1'],
            {queryParams: {quizId: quizId}, skipLocationChange: true});
    }

}
