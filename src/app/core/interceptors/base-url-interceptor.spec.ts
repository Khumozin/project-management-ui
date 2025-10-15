import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './base-url-interceptor';
import { ENVIRONMENT } from '../config/environment';

describe('baseUrlInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const mockBaseUrl = 'https://api.example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        {
          provide: ENVIRONMENT,
          useValue: {
            get: jasmine.createSpy('get').and.returnValue(mockBaseUrl)
          }
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should prepend base URL to relative URLs', () => {
    httpClient.get('/projects').subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects`);
    expect(req.request.url).toBe(`${mockBaseUrl}/projects`);
    req.flush({});
  });

  it('should handle relative URLs without leading slash', () => {
    httpClient.get('projects').subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects`);
    expect(req.request.url).toBe(`${mockBaseUrl}/projects`);
    req.flush({});
  });

  it('should handle base URL with trailing slash', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        {
          provide: ENVIRONMENT,
          useValue: {
            get: jasmine.createSpy('get').and.returnValue('https://api.example.com/')
          }
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    httpClient.get('/projects').subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects`);
    expect(req.request.url).toBe(`${mockBaseUrl}/projects`);
    req.flush({});
  });

  it('should not modify absolute HTTP URLs', () => {
    const absoluteUrl = 'http://other-api.com/data';
    httpClient.get(absoluteUrl).subscribe();

    const req = httpMock.expectOne(absoluteUrl);
    expect(req.request.url).toBe(absoluteUrl);
    req.flush({});
  });

  it('should not modify absolute HTTPS URLs', () => {
    const absoluteUrl = 'https://other-api.com/data';
    httpClient.get(absoluteUrl).subscribe();

    const req = httpMock.expectOne(absoluteUrl);
    expect(req.request.url).toBe(absoluteUrl);
    req.flush({});
  });

  it('should handle empty base URL', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        {
          provide: ENVIRONMENT,
          useValue: {
            get: jasmine.createSpy('get').and.returnValue('')
          }
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    httpClient.get('/projects').subscribe();

    const req = httpMock.expectOne('/projects');
    expect(req.request.url).toBe('/projects');
    req.flush({});
  });

  it('should handle null base URL', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        {
          provide: ENVIRONMENT,
          useValue: {
            get: jasmine.createSpy('get').and.returnValue(null)
          }
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    httpClient.get('/projects').subscribe();

    const req = httpMock.expectOne('/projects');
    expect(req.request.url).toBe('/projects');
    req.flush({});
  });

  it('should work with POST requests', () => {
    const data = { name: 'Test Project' };
    httpClient.post('/projects', data).subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.url).toBe(`${mockBaseUrl}/projects`);
    expect(req.request.body).toEqual(data);
    req.flush({});
  });

  it('should work with PUT requests', () => {
    const data = { name: 'Updated Project' };
    httpClient.put('/projects/1', data).subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.url).toBe(`${mockBaseUrl}/projects/1`);
    expect(req.request.body).toEqual(data);
    req.flush({});
  });

  it('should work with DELETE requests', () => {
    httpClient.delete('/projects/1').subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.url).toBe(`${mockBaseUrl}/projects/1`);
    req.flush({});
  });

  it('should preserve query parameters', () => {
    httpClient.get('/projects?status=active').subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects?status=active`);
    expect(req.request.url).toBe(`${mockBaseUrl}/projects?status=active`);
    req.flush({});
  });

  it('should preserve URL fragments', () => {
    httpClient.get('/projects#section').subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/projects#section`);
    expect(req.request.url).toBe(`${mockBaseUrl}/projects#section`);
    req.flush({});
  });
});
