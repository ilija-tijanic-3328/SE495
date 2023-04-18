import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Quiz} from "../models/response/quiz";
import {QuizConfig} from "../models/response/quiz-config";
import {Question} from "../models/response/question";

@Injectable()
export class QuizService {

    constructor(private http: HttpClient) {
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

    updateQuestions(quizId: any, questions: Question[]): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + `/quizzes/${quizId}/questions`, questions);
    }

}
