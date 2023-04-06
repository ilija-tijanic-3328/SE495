import {Injectable} from '@angular/core';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private storage = window.localStorage;

    constructor() {
    }

    clear(): void {
        this.storage.clear();
    }

    public saveToken(token: any): void {
        this.storage.setItem(TOKEN_KEY, token);
    }

    getToken() {
        return this.storage.getItem(TOKEN_KEY);
    }

    public getUser(): any {
        const user = this.storage.getItem(USER_KEY);

        if (user) {
            return JSON.parse(user);
        }

        return {};
    }

}
