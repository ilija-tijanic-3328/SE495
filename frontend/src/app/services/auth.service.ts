import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LoginRequest} from "../models/request/login-request";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import {RegistrationRequest} from "../models/request/registration-request";
import {TwoFactorLoginRequest} from "../models/request/two-factor-login-request";
import {Observable} from "rxjs";
import {ChangePasswordRequest} from "../models/request/change-password-request";
import {ResetPasswordRequest} from "../models/request/reset-password-request";
import {MessageService} from "primeng/api";

@Injectable()
export class AuthService {

    savedEmail: string | null = null;

    constructor(private http: HttpClient, private storageService: StorageService,
                private messageService: MessageService) {
    }

    login(request: LoginRequest): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/login', request);
    }

    loginTwoFactor(request: TwoFactorLoginRequest): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/login/two-factor', request);
    }


    logout(): void {
        this.messageService.clear();
        this.storageService.clear();
    }

    getToken(): string | null {
        return this.storageService.getToken();
    }

    isLoggedIn(): boolean {
        return !!this.storageService.getToken();
    }

    saveToken(token: string): void {
        this.storageService.saveToken(token);
        this.saveUserId(token);
    }

    saveUserName(userName: string): void {
        this.storageService.saveUserName(userName);
    }

    save2FactorToken(token: string): void {
        this.storageService.save2FactorToken(token);
    }

    register(request: RegistrationRequest): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/register', request);
    }

    getUserName() {
        return this.storageService.getUserName();
    }

    isWaitingFor2FactorCode(): boolean {
        return !!this.storageService.get2FactorToken();
    }

    get2FactorToken(): string | null {
        return this.storageService.get2FactorToken();
    }

    confirmEmailToken(token: string): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/auth/confirm', {"token": token});
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/forgot-password', {"email": email});
    }

    validatePasswordResetToken(token: string): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/reset-password/validate', {"token": token});
    }

    resetPassword(request: ResetPasswordRequest): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/auth/reset-password', request);
    }

    changePassword(request: ChangePasswordRequest): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/auth/change-password', request);
    }

    deleteAccount(password: string): Observable<any> {
        return this.http.delete<any>(environment.apiBaseUrl + '/auth/delete-account', {body: {password: password}});
    }

    unlockAccount(unlockToken: string): Observable<any> {
        return this.http.put<any>(environment.apiBaseUrl + '/auth/unlock-account', {token: unlockToken});
    }

    private saveUserId(token: string) {
        let decoded = atob(token.split('.')[1])
        let userId = JSON.parse(decoded).sub;
        this.storageService.saveUserId(userId);
    }

    getUserId() {
        return this.storageService.getUserId();
    }

    isAdmin() {
        return this.storageService.getRole() == 'ADMIN';
    }

    saveRole(role: string) {
        this.storageService.saveRole(role);
    }

}
