import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class NotificationService {

    constructor(private http: HttpClient) {
    }

    getUserNotifications(): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + '/notifications');
    }

    getUnseenCount(): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + '/notifications/unseen-count');
    }

    markNotificationAsSeen(id: any): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/notifications', {"ids": [id]});
    }

}
