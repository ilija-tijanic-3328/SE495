import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Invitation} from "../models/response/invitation";
import {ParticipantQuiz} from "../models/response/participant-quiz";
import {ParticipantAttempt} from "../models/response/participant-attempt";

@Injectable()
export class ParticipationService {

    constructor(private http: HttpClient) {
    }

    getQuizByCode(code: string): Observable<ParticipantQuiz> {
        return this.http.get<ParticipantQuiz>(environment.apiBaseUrl + `/participation/${code}`);
    }

    getUserInvitations(): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(environment.apiBaseUrl + '/participation/invitations');
    }

    startQuiz(code: string): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/participation/start', {code: code});
    }

    saveAnswers(participantId: any, answers: any): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + `/participation/${participantId}/submit`, answers);
    }

    getQuizResultsByCode(code: string): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + `/participation/${code}/results`);
    }

    getUserAttempts(): Observable<ParticipantAttempt[]> {
        return this.http.get<ParticipantAttempt[]>(environment.apiBaseUrl + '/participation/attempts');
    }

    reportQuizToAdmin(participantId: any, message: string): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/participation/report-quiz', {
            participant_id: participantId,
            message: message
        });
    }

}
