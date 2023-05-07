import {Router, RouterModule} from '@angular/router';
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
                        path: '',
                        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
                    },
                    {
                        path: 'pages',
                        loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'account',
                        title: 'QuickQuiz.Ninja - Account',
                        loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule)
                    },
                    {
                        path: 'quizzes',
                        title: 'QuickQuiz.Ninja - My Quizzes',
                        loadChildren: () => import('./components/quiz/quiz.module').then(m => m.QuizModule)
                    },
                    {
                        path: 'attempts',
                        title: 'QuickQuiz.Ninja - My Attempts',
                        loadChildren: () => import('./components/attempt/attempt.module').then(m => m.AttemptModule)
                    },
                    {
                        path: 'invitations',
                        title: 'QuickQuiz.Ninja - My Invitations',
                        loadChildren: () => import('./components/attempt/invitationlist/invitation-list.module').then(m => m.InvitationListModule)
                    },
                    {
                        path: 'quiz',
                        title: 'QuickQuiz.Ninja - Quiz Attempt',
                        loadChildren: () => import('./components/attempt/newattempt/new-attempt.module').then(m => m.NewAttemptModule)
                    }
                ],
                canActivate: [userGuard]
            },
            {
                path: 'quiz',
                title: 'QuickQuiz.Ninja - Quiz Attempt',
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

export function userGuard() {
    let loggedIn = inject(AuthService).isLoggedIn();
    let router = inject(Router);
    return loggedIn ? true : router.navigate(['/auth/login']);
}
