import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LoginRequest} from "../models/request/login-request";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import {RegistrationRequest} from "../models/request/registration-request";
import {TwoFactorLoginRequest} from "../models/request/two-factor-login-request";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private storageService: StorageService) {
    }

    login(request: LoginRequest) {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/login', request);
    }

    loginTwoFactor(request: TwoFactorLoginRequest) {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/login/two-factor', request);
    }


    logout() {
        this.storageService.clear();
    }

    getToken(): string | null {
        return this.storageService.getToken();
    }

    isLoggedIn(): boolean {
        return !!this.storageService.getToken();
    }

    saveToken(token: string) {
        this.storageService.saveToken(token);
    }

    saveUserName(userName: string) {
        this.storageService.saveUserName(userName);
    }

    save2FactorToken(token: string) {
        this.storageService.save2FactorToken(token);
    }

    register(request: RegistrationRequest) {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/register', request);
    }

    getUserName() {
        return this.storageService.getUserName();
    }

    isWaitingFor2FactorCode() {
        return !!this.storageService.get2FactorToken();
    }

    get2FactorToken() {
        return this.storageService.get2FactorToken();
    }

    confirmEmailToken(token: string): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/auth/confirm', {"token": token});
    }

}
