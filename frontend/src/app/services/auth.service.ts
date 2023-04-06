import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LoginRequest} from "../models/request/login-request";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private storageService: StorageService) {
    }

    login(request: LoginRequest) {
        return this.http.post<any>(environment.apiBaseUrl + '/auth/login', request)
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
        this.storageService.saveToken(token)
    }

}
