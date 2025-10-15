import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ENVIRONMENT, provideEnvironmentConfig } from './core/config/environment';
import { baseUrlInterceptor } from './core/interceptors/base-url-interceptor';

import { withDevtools } from '@tanstack/angular-query-experimental/devtools';

function initApp() {
  const env = inject(ENVIRONMENT);
  return env.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(initApp),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideEnvironmentConfig(),
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    provideTanStackQuery(
      new QueryClient(),
      withDevtools(() => ({ loadDevtools: 'auto' })),
    ),
  ],
};
