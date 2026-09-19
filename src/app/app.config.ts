import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    provideHttpClient(withXhr(), withInterceptors([httpErrorInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        useHttpBackend: true,
        failOnError: true,
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
  ],
};
