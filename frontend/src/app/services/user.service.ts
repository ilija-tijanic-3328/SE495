import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Account} from "../models/response/account";
import {AutoCompleteUser} from "../models/response/auto-complete-user";
import {User} from "../models/response/user";

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

    getUser(): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + '/users/current-user');
    }

    updateUser(account: Account): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/users', {
            "name": account.name,
            "phone_number": account.phoneNumber
        });
    }

    getActiveUsers(): Observable<AutoCompleteUser[]> {
        return this.http.get<AutoCompleteUser[]>(environment.apiBaseUrl + '/users/active');
    }

    deleteUser(userId: any): Observable<any> {
        return this.http.delete<any>(environment.apiBaseUrl + '/users/' + userId);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(environment.apiBaseUrl + '/admin/users');
    }

    changeStatus(userId: any, status: string): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + `/admin/users/${userId}/status`, {status: status});
    }

}
