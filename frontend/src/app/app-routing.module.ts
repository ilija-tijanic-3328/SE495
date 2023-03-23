import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AppLayoutComponent} from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule)
            },
            {
                path: 'landing',
                loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule)
            },
            {
                path: 'app', component: AppLayoutComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
                    },
                    {
                        path: 'uikit',
                        loadChildren: () => import('./components/uikit/uikit.module').then(m => m.UIkitModule)
                    },
                    {
                        path: 'utilities',
                        loadChildren: () => import('./components/utilities/utilities.module').then(m => m.UtilitiesModule)
                    },
                    {
                        path: 'documentation',
                        loadChildren: () => import('./components/documentation/documentation.module').then(m => m.DocumentationModule)
                    },
                    {
                        path: 'pages',
                        loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'account',
                        loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule)
                    },
                ]
            },
            {path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)},
            {path: 'notfound', component: NotfoundComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
