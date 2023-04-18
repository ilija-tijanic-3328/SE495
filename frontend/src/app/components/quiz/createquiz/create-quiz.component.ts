import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {QuizService} from "../../../services/quiz.service";
import {Quiz} from "../../../models/response/quiz";

@Component({
    templateUrl: './create-quiz.component.html'
})
export class CreateQuizComponent implements OnInit {

    items: MenuItem[] = [
        {label: 'Basic Information'},
        {label: 'Questions & Answers'},
        {label: 'Invitations'}
    ];

    activeIndex: number = 0;

    quiz: Quiz = {};

    constructor(private router: Router, private quizService: QuizService, private route: ActivatedRoute,
                private messageService: MessageService) {
    }

    onActiveIndexChange(event: any) {
        this.activeIndex = event;
    }

    ngOnInit(): void {
        let quizId: number = Number(this.route.snapshot.queryParamMap.get('quizId'));
        if (quizId) {
            this.quizService.getQuiz(quizId)
                .subscribe({
                    next: quiz => {
                        quiz.start_time = new Date(String(quiz.start_time));
                        quiz.end_time = new Date(String(quiz.end_time));
                        this.quiz = quiz;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Couldn't load quiz data",
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }
    }

    onQuizChange(quiz: Quiz) {
        this.quiz = quiz;
    }

}
