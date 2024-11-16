import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// if (environment.production === false) {
//   import('../mocks/browser').then(({ worker }) => {
//     worker.start();
//   });
// }

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
