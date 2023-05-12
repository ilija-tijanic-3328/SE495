import {ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot} from '@angular/router';
import {inject, NgModule} from '@angular/core';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {AuthService} from "./services/auth.service";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'app', component: AppLayoutComponent,
                children: [
                    {
                        path: 'account',
                        title: 'Quick Quiz Ninja - Account',
                        loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule)
                    },
                    {
                        path: 'quizzes',
                        title: 'Quick Quiz Ninja - My Quizzes',
                        loadChildren: () => import('./components/quiz/quiz.module').then(m => m.QuizModule)
                    },
                    {
                        path: 'attempts',
                        title: 'Quick Quiz Ninja - My Attempts',
                        loadChildren: () => import('./components/attempt/attempt.module').then(m => m.AttemptModule)
                    },
                    {
                        path: 'invitations',
                        title: 'Quick Quiz Ninja - My Invitations',
                        loadChildren: () => import('./components/attempt/invitationlist/invitation-list.module').then(m => m.InvitationListModule)
                    },
                    {
                        path: 'quiz',
                        title: 'Quick Quiz Ninja - Quiz Attempt',
                        loadChildren: () => import('./components/attempt/newattempt/new-attempt.module').then(m => m.NewAttemptModule)
                    },
                    {
                        path: '',
                        title: 'Quick Quiz Ninja - My Quizzes',
                        loadChildren: () => import('./components/quiz/quiz.module').then(m => m.QuizModule)
                    }
                ],
                canActivate: [userGuard]
            },
            {
                path: 'admin', component: AppLayoutComponent,
                children: [
                    {
                        path: 'account',
                        title: 'Quick Quiz Ninja - Account',
                        loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule)
                    },
                    {
                        path: 'users',
                        title: 'Quick Quiz Ninja - Users',
                        loadChildren: () => import('./components/admin/userlist/admin-user-list.module').then(m => m.AdminUserListModule)
                    },
                    {
                        path: 'quizzes',
                        title: 'Quick Quiz Ninja - Quizzes',
                        loadChildren: () => import('./components/admin/quizlist/admin-quiz-list.module').then(m => m.AdminQuizListModule)
                    },
                    {
                        path: 'notification',
                        title: 'Quick Quiz Ninja - New Notification',
                        loadChildren: () => import('./components/admin/notification/admin-notification.module').then(m => m.AdminNotificationModule)
                    },
                    {
                        path: '',
                        title: 'Quick Quiz Ninja - Users',
                        loadChildren: () => import('./components/admin/userlist/admin-user-list.module').then(m => m.AdminUserListModule)
                    }
                ],
                canActivate: [adminGuard]
            },
            {
                path: 'quiz',
                title: 'Quick Quiz Ninja - Quiz Attempt',
                loadChildren: () => import('./components/attempt/newattempt/new-attempt.module').then(m => m.NewAttemptModule)
            },
            {path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)},
            {
                path: '**',
                loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule),
                canActivate: [guestGuard]
            },
        ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

export function guestGuard() {
    let loggedIn = inject(AuthService).isLoggedIn();
    let router = inject(Router);
    return loggedIn ? router.navigate(['/app']) : true;
}

export function userGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let router = inject(Router);
    let loggedIn = inject(AuthService).isLoggedIn();
    return loggedIn ? true : router.navigate(['/auth/login'], {queryParams: {forwardUrl: state.url}});
}

export function adminGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let router = inject(Router);
    let authService = inject(AuthService);
    let adminLoggedIn = authService.isLoggedIn() && authService.isAdmin();
    return adminLoggedIn ? true : router.navigate(['/auth/login'], {queryParams: {forwardUrl: state.url}});
}
