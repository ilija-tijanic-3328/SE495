import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {
    }

    getUserConfigs(): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + '/user-app-configs');
    }

    updateUserConfig(config: string, value: any): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/user-app-configs', {
            "config": config,
            "value": String(value)
        });
    }

}
