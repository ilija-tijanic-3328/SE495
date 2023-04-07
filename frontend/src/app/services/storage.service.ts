import {Injectable} from '@angular/core';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';
const TWO_FACTOR_TOKEN_KEY = '2-factor-token';

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

}
