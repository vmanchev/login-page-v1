import { HttpErrorResponse } from '@angular/common/http';
import { http, HttpResponse } from 'msw';

interface LoginPayload {
  username: string;
  password: string;
}

const user = {
  email: 'hello@edited.com',
  password: 'hello123',
};

export const handlers = [
  http.post('/api/login', async (req) => {
    const payload = (await req.request.json()) as LoginPayload;

    if (
      !payload ||
      payload.username !== user.email ||
      payload.password !== user.password
    ) {
      return HttpResponse.json(
        {
          code: 400,
          message: 'Invalid credentials',
        },
        {
          status: 400,
        }
      );
    }

    return HttpResponse.json({
      email: user.email,
    });
  }),
];
