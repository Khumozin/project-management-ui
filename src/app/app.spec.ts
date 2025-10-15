import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    // Mock matchMedia for the toaster component
    const mockMatchMedia = jasmine.createSpy('matchMedia').and.returnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent')
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia
    });

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a title signal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('project-management-ui');
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render toaster component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('hlm-toaster')).toBeTruthy();
  });
});
