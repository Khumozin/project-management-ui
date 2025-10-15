import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: { [key: string]: string };
  let mockMatchMedia: jasmine.Spy;

  beforeEach(() => {
    mockLocalStorage = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    mockMatchMedia = jasmine.createSpy('matchMedia').and.returnValue({
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    } as any);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia
    });

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    mockLocalStorage = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should default to system theme when no stored preference exists', () => {
      expect(service.theme()).toBe('system');
    });

    it('should load stored theme from localStorage', () => {
      mockLocalStorage['theme'] = 'dark';
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection()
        ]
      });
      const newService = TestBed.inject(ThemeService);
      expect(newService.theme()).toBe('dark');
    });

    it('should resolve system theme to light when prefers-color-scheme is light', () => {
      mockMatchMedia.and.returnValue({
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener')
      });
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection()
        ]
      });
      const newService = TestBed.inject(ThemeService);
      expect(newService.resolvedTheme()).toBe('light');
    });

    it('should resolve system theme to dark when prefers-color-scheme is dark', () => {
      mockMatchMedia.and.returnValue({
        matches: true,
        addEventListener: jasmine.createSpy('addEventListener')
      });
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection()
        ]
      });
      const newService = TestBed.inject(ThemeService);
      expect(newService.resolvedTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should set theme to light', () => {
      service.setTheme('light');
      expect(service.theme()).toBe('light');
      expect(service.resolvedTheme()).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should set theme to dark', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
      expect(service.resolvedTheme()).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should set theme to system', () => {
      service.setTheme('system');
      expect(service.theme()).toBe('system');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'system');
    });

    it('should persist theme preference to localStorage', () => {
      service.setTheme('dark');
      expect(mockLocalStorage['theme']).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      service.setTheme('light');
      service.toggleTheme();
      expect(service.theme()).toBe('dark');
      expect(service.resolvedTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.setTheme('dark');
      service.toggleTheme();
      expect(service.theme()).toBe('light');
      expect(service.resolvedTheme()).toBe('light');
    });

    it('should toggle system theme based on resolved value', () => {
      mockMatchMedia.and.returnValue({
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener')
      });
      service.setTheme('system');
      expect(service.resolvedTheme()).toBe('light');

      service.toggleTheme();
      expect(service.theme()).toBe('dark');
    });
  });

  describe('server-side rendering', () => {
    it('should handle server-side rendering gracefully', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' },
          provideZonelessChangeDetection()
        ]
      });
      const serverService = TestBed.inject(ThemeService);

      expect(serverService.theme()).toBe('system');
      expect(serverService.resolvedTheme()).toBe('light');
    });

    it('should not call localStorage on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' },
          provideZonelessChangeDetection()
        ]
      });
      const serverService = TestBed.inject(ThemeService);

      (localStorage.getItem as jasmine.Spy).calls.reset();
      serverService.setTheme('dark');

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('media query listener', () => {
    it('should setup media query listener for system theme changes', () => {
      const addEventListenerSpy = jasmine.createSpy('addEventListener');
      mockMatchMedia.and.returnValue({
        matches: false,
        addEventListener: addEventListenerSpy
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection()
        ]
      });
      TestBed.inject(ThemeService);

      expect(addEventListenerSpy).toHaveBeenCalledWith('change', jasmine.any(Function));
    });

    it('should update resolved theme when system preference changes and theme is system', () => {
      const callbacks: Function[] = [];
      const addEventListenerSpy = jasmine.createSpy('addEventListener').and.callFake(
        (_event: string, callback: Function) => {
          callbacks.push(callback);
        }
      );

      mockMatchMedia.and.returnValue({
        matches: false,
        addEventListener: addEventListenerSpy
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection()
        ]
      });
      const newService = TestBed.inject(ThemeService);
      newService.setTheme('system');

      expect(newService.resolvedTheme()).toBe('light');

      callbacks[0]({ matches: true });

      expect(newService.resolvedTheme()).toBe('dark');
    });

    it('should not update resolved theme when system changes but theme is not system', () => {
      const callbacks: Function[] = [];
      const addEventListenerSpy = jasmine.createSpy('addEventListener').and.callFake(
        (_event: string, callback: Function) => {
          callbacks.push(callback);
        }
      );

      mockMatchMedia.and.returnValue({
        matches: false,
        addEventListener: addEventListenerSpy
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection()
        ]
      });
      const newService = TestBed.inject(ThemeService);
      newService.setTheme('dark');

      expect(newService.resolvedTheme()).toBe('dark');

      callbacks[0]({ matches: false });

      expect(newService.resolvedTheme()).toBe('dark');
    });
  });
});
