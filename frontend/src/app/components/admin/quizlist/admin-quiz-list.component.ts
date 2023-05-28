import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../services/quiz.service";
import {Quiz} from "../../../models/response/quiz";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";

@Component({
    templateUrl: './admin-quiz-list.component.html'
})
export class AdminQuizListComponent implements OnInit {

    deleteQuizDialog: boolean = false;

    quizzes: Quiz[] = [];

    quizToDelete: Quiz | null = null;

    first: number = 0;

    columns: any = [
        {field: 'title', header: 'Title'},
        {field: 'status', header: 'Status'},
        {field: 'start_time', header: 'Start Time'},
        {field: 'end_time', header: 'End Time'},
        {field: 'time_allowed', header: 'Time Allowed'},
        {field: 'submitted_count', header: 'Submitted'}
    ];

    quizId: number | null = null;

    constructor(private messageService: MessageService, private quizService: QuizService, private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadQuizzes();
    }

    deleteQuiz(quiz: Quiz, event: Event) {
        event.stopPropagation();
        this.deleteQuizDialog = true;
        this.quizToDelete = {...quiz};
    }

    confirmDelete() {
        this.deleteQuizDialog = false;
        if (this.quizToDelete) {
            this.quizService.deleteQuiz(this.quizToDelete)
                .subscribe({
                    next: () => {
                        this.quizzes = this.quizzes.filter(val => val.id !== this.quizToDelete?.id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Quiz Deleted',
                            life: 3000
                        });
                        this.quizToDelete = null;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Quiz deletion failed",
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }
    }

    private loadQuizzes() {
        this.quizService.getQuizzes()
            .subscribe({
                next: quizList => {
                    this.quizzes = quizList.map(q => {
                        q.start_time = new Date(String(q.start_time));
                        q.end_time = new Date(String(q.end_time));
                        return q;
                    });

                    let quizId: string | null = this.route.snapshot.paramMap.get('quizId');
                    if (quizId) {
                        this.quizId = Number(quizId);
                        let index = this.quizzes.findIndex(q => q.id == this.quizId);
                        if (index >= 10) {
                            this.first = index % 10 + 1;
                        }
                    }
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load quizzes",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    onQuizClicked(quiz: Quiz) {
        this.router.navigate(['/app/quizzes', quiz.id])
    }

    openLeaderboard(id: any, event: any) {
        event.stopPropagation();
        this.router.navigate(['/app/quiz', id, 'leaderboard']);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}
