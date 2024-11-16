import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (!environment.production) {
  import('./mocks/browser').then(({ worker }) => {
    worker
      .start({
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
      .then(() => {
        bootstrapApplication(AppComponent, appConfig).catch((err) =>
          console.error(err)
        );
      });
  });
} else {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
}
