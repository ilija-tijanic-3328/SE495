import {Component, OnInit} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {QuizService} from "../../../services/quiz.service";
import {Quiz} from "../../../models/response/quiz";
import {DataView} from "primeng/dataview";
import {Router} from "@angular/router";

@Component({
    templateUrl: './quiz-list.component.html'
})
export class QuizListComponent implements OnInit {

    deleteQuizDialog: boolean = false;

    quizzes: Quiz[] = [];

    quiz: Quiz | null = null;

    sortField: string = 'start_time';

    sortOrder: number = 1;

    searchFields: string = 'title,description,start_time,end_time,allowed_time';

    sortOptions: SelectItem[] = [
        {label: "Sort by Start Time Ascending", value: "start_time"},
        {label: "Sort by Start Time Descending", value: "!start_time"},
        {label: "Sort by Title Ascending", value: "title"},
        {label: "Sort by Title Descending", value: "!title"}
    ];

    filterOptions: SelectItem[] = [
        {label: "Published", value: "PUBLISHED"},
        {label: "Draft", value: "DRAFT"},
        {label: "Archived", value: "ARCHIVED"}
    ];

    constructor(private messageService: MessageService, private quizService: QuizService, private router: Router) {
    }

    ngOnInit(): void {
        this.loadQuizzes('PUBLISHED');
    }

    deleteQuiz(quiz: Quiz, event: Event) {
        event.stopPropagation();
        this.deleteQuizDialog = true;
        this.quiz = {...quiz};
    }

    confirmDelete() {
        this.deleteQuizDialog = false;
        if (this.quiz) {
            this.quizService.deleteQuiz(this.quiz)
                .subscribe({
                    next: () => {
                        this.quizzes = this.quizzes.filter(val => val.id !== this.quiz?.id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Quiz Deleted',
                            life: 3000
                        });
                        this.quiz = null;
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

    onGlobalFilter(dataView: DataView, event: Event) {
        dataView.filter((event.target as HTMLInputElement).value, 'contains');
    }

    onFilterChange(event: any) {
        this.loadQuizzes(event.value);
    }

    onSortChange(event: any) {
        let value = event.value;

        if (value.indexOf('!') == 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    getSeverity(quiz: Quiz) {
        let now = new Date();
        if (quiz.start_time && now < quiz.start_time) {
            return 'primary';
        } else if (quiz.end_time && now > quiz.end_time) {
            return 'warning';
        } else {
            return 'success';
        }
    }

    getStatus(quiz: Quiz) {
        let now = new Date();
        if (quiz.start_time && now < quiz.start_time) {
            return 'Not started';
        } else if (quiz.end_time && now > quiz.end_time) {
            return 'Finished';
        } else {
            return 'Active';
        }
    }

    private loadQuizzes(status: string) {
        this.quizService.getUserCreatedQuizzes(status)
            .subscribe({
                next: quizList => {
                    this.quizzes = quizList.map(q => {
                        q.start_time = new Date(String(q.start_time));
                        q.end_time = new Date(String(q.end_time));
                        return q;
                    });
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load your quizzes",
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

}
