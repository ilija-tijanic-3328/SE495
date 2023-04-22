import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {Quiz} from "../../../../models/response/quiz";
import {Question} from "../../../../models/response/question";
import {Answer} from "../../../../models/response/answer";

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html'
})
export class Step2Component implements OnChanges {

    @Input() quiz: Quiz = {};
    @Output() indexChange = new EventEmitter<number>();
    questions: Question[] = [];
    allDisabled: boolean = false;
    selectedQuestion: Question | null = null;
    showQuestionDialog: boolean = false;
    showAnswerDialog: boolean = false;
    currentQuestion: Question = {answers: []};
    currentAnswer: Answer = {};
    questionTypes: string[] = ['Single choice', 'Multiple choice'];
    touched: boolean = false;
    edit: boolean = false;

    constructor(private messageService: MessageService, private quizService: QuizService) {
    }

    ngOnChanges(): void {
        let now = new Date();

        if (this.quiz?.status == 'ARCHIVED' || (this.quiz?.end_time && now > this.quiz.end_time)) {
            this.allDisabled = true;
        }

        this.loadQuestions(this.quiz.id);
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
        this.indexChange.emit(0);
    }

    onNextStep() {
        if (this.touched) {
            if (this.questions.length > 0) {
                if (this.allQuestionsHaveValidAnswers()) {
                    this.questions.forEach((question, index) => {
                        question.order = index;
                        question.answers?.forEach((answer, aIndex) => {
                            answer.order = aIndex;
                        });
                    });
                    this.quizService.updateQuestions(this.quiz.id, this.questions)
                        .subscribe({
                            next: () => {
                                this.indexChange.emit(2);
                            },
                            error: error => {
                                const message = error?.error?.error || 'Unknown error occurred';
                                this.showErrorMessage(message);
                            }
                        });
                }
            } else {
                this.showErrorMessage('At least one question must be added');
            }
        } else {
            this.indexChange.emit(2);
        }
    }

    onSelectionChange(value: any) {
        this.selectedQuestion = value[0];
    }

    removeQuestion(question: Question, event: Event) {
        event.stopPropagation();
        this.questions = this.questions.filter(q => q != question);
        this.touched = true;

        if (this.selectedQuestion == question) {
            this.selectedQuestion = null;
        }
    }

    removeAnswer(answer: Answer, event: Event) {
        event.stopPropagation();

        if (this.selectedQuestion?.answers) {
            this.selectedQuestion.answers = this.selectedQuestion.answers.filter(a => a != answer);
        }

        this.touched = true;
    }

    saveQuestion() {
        if (!this.currentQuestion.id && !this.edit) {
            this.questions.push(this.currentQuestion);
            this.questions = [...this.questions];
        }

        this.edit = false;
        this.currentQuestion = {answers: []};
        this.showQuestionDialog = false;
        this.touched = true;
    }

    saveAnswer() {
        if (!this.currentAnswer.id && !this.edit) {
            if (this.selectedQuestion?.answers) {
                this.selectedQuestion.answers.push(this.currentAnswer);
                this.selectedQuestion.answers = [...this.selectedQuestion.answers];
            }
        }

        this.edit = false;
        this.currentAnswer = {};
        this.showAnswerDialog = false;
        this.touched = true;
    }

    showErrorMessage(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: "Couldn't save questions",
            detail: message,
            sticky: true
        });
    }

    private allQuestionsHaveValidAnswers() {
        for (let question of this.questions) {
            if (!question.answers || question.answers.length < 2) {
                this.showErrorMessage('All questions must have at least one correct and one incorrect answer');
                return false;
            }

            let correctCount = question.answers.filter(a => a.correct).length;
            let incorrectCount = question.answers.filter(a => !a.correct).length;

            if (correctCount < 1 || incorrectCount < 1) {
                this.showErrorMessage('All questions must have at least one correct and one incorrect answer');
                return false;
            }

            if (question.type == 'Single choice' && correctCount > 1) {
                this.showErrorMessage('Single choice questions can have only one correct answer');
                return false;
            }
        }
        return true;
    }

    editQuestion(question: any, event: Event) {
        event.stopPropagation();
        this.currentQuestion = question;
        this.edit = true;
        this.showQuestionDialog = true;
    }

    addAnswer() {
        this.currentAnswer = {};
        this.showAnswerDialog = true;
    }

    addQuestion() {
        this.currentQuestion = {answers: []};
        this.showQuestionDialog = true;
    }

    editAnswer(answer: Answer, event: Event) {
        event.stopPropagation();
        this.currentAnswer = answer;
        this.edit = true;
        this.showAnswerDialog = true;
    }

}
