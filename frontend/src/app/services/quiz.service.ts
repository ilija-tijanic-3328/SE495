import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {Quiz} from "../models/response/quiz";
import {MessageService} from "primeng/api";
import {QuizConfig} from "../models/response/quiz-config";
import {Question} from "../models/response/question";

@Injectable()
export class QuizService {

    constructor(private http: HttpClient, private messageService: MessageService) {
    }

    loadQuiz(quizId: any): Observable<Quiz | null> {
        return this.getQuiz(quizId)
            .pipe(
                map((quiz: any) => {
                    quiz.start_time = new Date(quiz.start_time);
                    quiz.end_time = new Date(quiz.end_time);
                    return quiz;
                }),
                catchError((error: any) => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load quiz data",
                        detail: message,
                        sticky: true
                    });
                    return of(null);
                })
            )
    }

    getUserCreatedQuizzes(status: string): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(environment.apiBaseUrl + '/quizzes?status=' + status);
    }

    deleteQuiz(quiz: Quiz): Observable<any> {
        return this.http.delete<any>(environment.apiBaseUrl + '/quizzes/' + quiz.id);
    }

    createQuiz(quiz: Quiz): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/quizzes', quiz);
    }

    updateQuiz(quiz: Quiz): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/quizzes/' + quiz.id, quiz);
    }

    getQuiz(quizId: any): Observable<Quiz> {
        return this.http.get<Quiz>(environment.apiBaseUrl + '/quizzes/' + quizId);
    }

    getQuizConfigs(quizId: any): Observable<QuizConfig[]> {
        return this.http.get<QuizConfig[]>(environment.apiBaseUrl + `/quizzes/${quizId}/quiz-configs`);
    }

    getDefaultQuizConfigs(): Observable<QuizConfig[]> {
        return this.http.get<QuizConfig[]>(environment.apiBaseUrl + '/quiz-configs');
    }

    updateQuizConfigs(quizId: any, quizConfigs: QuizConfig[]): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + `/quizzes/${quizId}/quiz-configs`, quizConfigs);
    }

    getQuestions(quizId: any): Observable<Question[]> {
        return this.http.get<Question[]>(environment.apiBaseUrl + `/quizzes/${quizId}/questions`);
    }

}
