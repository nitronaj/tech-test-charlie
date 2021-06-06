import { timingSafeEqual } from 'crypto';
import express from 'express';
import { IncomingHttpHeaders } from 'http';
import { userAuthorizer } from './userAuthorizer';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/status', (req, res) => {
  res.status(200).end();
});
app.head('/status', (req, res) => {
  res.status(200).end();
});

const CREDENTIALS_REGEXP =
  /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

const basicAuthHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req) {
      throw new TypeError('argument req is required');
    }
    const { authorization = '' }: IncomingHttpHeaders = req.headers;
    const [type, credentials] = authorization.split(' ');

    if (!credentials) {
      throw new TypeError('no credentials sent');
    }

    if (credentials) {
      const userPass = Buffer.from(credentials, 'base64').toString('ascii');

      const [reqUsername, reqPassword] = userPass.split(':');

      if (!userAuthorizer(reqUsername, reqPassword)) {
        res.set('WWW-Authenticate', 'Basic realm="tech-test-3"');
        res.status(401).send('Authentication required');
      }
    }
  } catch (e) {
    res.set('WWW-Authenticate', 'Basic realm="tech-test-3"');
    res.status(401).send('Authentication required');
  }

  next();
};

app.get(
  '/basic-auth',
  basicAuthHandler,
  (req: express.Request, res: express.Response) => {
    res.status(200).end();
  }
);

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
