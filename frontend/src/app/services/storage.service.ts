import {Injectable} from '@angular/core';
import {Participant} from "../models/response/participant";
import {Question} from "../models/response/question";

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';
const TWO_FACTOR_TOKEN_KEY = '2-factor-token';
const QUESTIONS_KEY = 'questions-';
const PARTICIPANTS_KEY = 'participants-';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private storage = window.localStorage;

    constructor() {
    }

    public clear(): void {
        this.storage.clear();
    }

    public saveToken(token: string): void {
        this.storage.setItem(TOKEN_KEY, token);
    }

    public saveUserName(userName: string): void {
        this.storage.setItem(USER_KEY, userName);
    }

    public save2FactorToken(token: string): void {
        this.storage.setItem(TWO_FACTOR_TOKEN_KEY, token);
    }

    public getToken() {
        return this.storage.getItem(TOKEN_KEY);
    }

    public getUserName(): any {
        return this.storage.getItem(USER_KEY);
    }

    public get2FactorToken() {
        return this.storage.getItem(TWO_FACTOR_TOKEN_KEY);
    }

    public saveQuestions(questions: Question[], quizId: any) {
        this.storage.setItem(QUESTIONS_KEY + quizId, JSON.stringify(questions));
    }

    public getQuestions(quizId: any): Question[] {
        let questions = this.storage.getItem(QUESTIONS_KEY + quizId);
        return questions ? JSON.parse(questions) : [];
    }

    saveParticipants(participants: Participant[], quizId: any) {
        this.storage.setItem(PARTICIPANTS_KEY + quizId, JSON.stringify(participants));
    }

    public getParticipants(quizId: any): Participant[] {
        let participants = this.storage.getItem(PARTICIPANTS_KEY + quizId);
        return participants ? JSON.parse(participants) : [];
    }

}
