import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ENVIRONMENT } from '../config/environment';

const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url);

const prependBaseUrl = (url: string, baseUrl: string): string =>
  `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(ENVIRONMENT);
  const API_URL = env.get('APP_API_URL') ?? '';

  const updatedReq = isAbsoluteUrl(req.url)
    ? req
    : req.clone({ url: prependBaseUrl(req.url, API_URL) });

  return next(updatedReq);
};
