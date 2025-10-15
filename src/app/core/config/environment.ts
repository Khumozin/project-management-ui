import { inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';

export interface Environment {
  APP_API_URL: string;
}

export interface EnvironmentToken {
  load(): Promise<Environment>;
  get(key: keyof Environment): string | undefined;
}

export const ENVIRONMENT = new InjectionToken<EnvironmentToken>('App Environment Config');

/**
 * Service for loading and managing application environment configuration.
 * Loads configuration from a JSON file at application startup.
 */
@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  #config?: Environment;

  /**
   * Loads the environment configuration from the config.json file.
   *
   * @returns A promise that resolves to the loaded environment configuration
   * @throws Error if the configuration file cannot be loaded or is invalid
   */
  async load(): Promise<Environment> {
    try {
      const res = await fetch('./config.json');

      if (!res.ok) {
        throw new Error(`Failed to load config.json: ${res.status} ${res.statusText}`);
      }

      const data: unknown = await res.json();
      this.#validateConfig(data);
      this.#config = data as Environment;
      return this.#config;
    } catch (error) {
      console.error('Error loading environment configuration:', error);
      throw new Error(
        `Failed to load environment configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Validates that the loaded configuration contains all required keys.
   *
   * @param data - The configuration data to validate
   * @throws Error if required configuration keys are missing or invalid
   */
  #validateConfig(data: unknown): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Configuration must be a valid object');
    }

    const config = data as Record<string, unknown>;
    const requiredKeys: (keyof Environment)[] = ['APP_API_URL'];

    const missingKeys = requiredKeys.filter((key) => {
      const value = config[key];
      return value === undefined || value === null || value === '';
    });

    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required configuration keys: ${missingKeys.join(', ')}`,
      );
    }

    // Validate that APP_API_URL is a non-empty string
    if (typeof config['APP_API_URL'] !== 'string') {
      throw new Error('APP_API_URL must be a string');
    }
  }

  /**
   * Retrieves a configuration value by key.
   *
   * @param key - The configuration key to retrieve
   * @returns The configuration value, or undefined if not loaded or not found
   */
  get(key: keyof Environment): string | undefined {
    return this.#config?.[key];
  }
}

export function provideEnvironmentConfig() {
  return {
    provide: ENVIRONMENT,
    useFactory: () => inject(EnvironmentService),
  };
}
