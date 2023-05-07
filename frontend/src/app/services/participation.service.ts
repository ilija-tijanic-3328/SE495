import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Invitation} from "../models/response/invitation";
import {ParticipantQuiz} from "../models/response/participant-quiz";

@Injectable()
export class ParticipationService {

    constructor(private http: HttpClient) {
    }

    getQuizByCode(code: string): Observable<ParticipantQuiz> {
        return this.http.get<ParticipantQuiz>(environment.apiBaseUrl + `/participation/quiz-participants/${code}`);
    }

    getUserInvitations(): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(environment.apiBaseUrl + '/participation/invitations');
    }

    startQuiz(code: string): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/participation/start', {code: code});
    }

    saveAnswers(participantId: any, answers: any) {
        return this.http.put<any>(environment.apiBaseUrl + `/participation/${participantId}/submit`, answers);
    }

}
