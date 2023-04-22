import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class ParticipationService {

    constructor(private http: HttpClient) {
    }

    getQuizByCode(code: string): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + `/quiz-participants/${code}`);
    }

}
