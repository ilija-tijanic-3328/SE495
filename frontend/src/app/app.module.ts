import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutModule} from './layout/app.layout.module';
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {AuthInterceptor} from "./services/interceptors/auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {ProductService} from "./services/product.service";
import {UserService} from "./services/user.service";
import {NotificationService} from "./services/notification.service";
import {QuizService} from "./services/quiz.service";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ToastModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        AuthService, MessageService, UserService, NotificationService, QuizService, ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
