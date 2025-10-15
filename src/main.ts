import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const MINIMUM_SPLASH_DURATION = 1000; // Minimum time to show splash screen (ms)
const splashStartTime = Date.now();

bootstrapApplication(App, appConfig)
  .then(() => {
    // Calculate remaining time to show splash screen
    const elapsedTime = Date.now() - splashStartTime;
    const remainingTime = Math.max(0, MINIMUM_SPLASH_DURATION - elapsedTime);

    // Hide splash screen after minimum duration
    setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      if (splashScreen) {
        splashScreen.classList.add('fade-out');
        setTimeout(() => splashScreen.remove(), 500);
      }
    }, remainingTime);
  })
  .catch((err) => console.error(err));
