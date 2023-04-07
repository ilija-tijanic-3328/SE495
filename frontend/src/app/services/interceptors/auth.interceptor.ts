import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken: string | null = this.authService.getToken();
        if (authToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: "Bearer " + authToken
                }
            });
        }
        return next.handle(request)
            .pipe(catchError(error => {
                if (error.status == 401 && this.authService.isLoggedIn()) {
                    this.authService.logout();
                    this.router.navigate(['/auth/login']);
                }
                return throwError(() => error);
            }));
    }

}
