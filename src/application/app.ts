import { randomUUID } from 'crypto';
import express, {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
} from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import { z } from 'zod';
import { RegisterRoutes } from '../../dist/routes';
import { AppError } from '../domain/errors/app.error';
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void {
  const traceId = randomUUID();
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
      traceId,
    });
  }
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: 'error',
      message: err.issues,
      type: 'zod',
      traceId,
    });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      type: 'app',
      traceId,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      traceId,
    });
  }

  next();
});
app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import('../../dist/swagger.json')),
  );
});

export default app;
