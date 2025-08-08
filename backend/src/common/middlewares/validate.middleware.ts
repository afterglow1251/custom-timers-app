import { Context, Next } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validate as classValidate } from 'class-validator';

export function validate<T extends object>(type: new () => T) {
  return async (ctx: Context, next: Next) => {
    const dtoObject = plainToInstance(type, ctx.request.body);

    const errors = await classValidate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      };
      return;
    }

    ctx.request.body = dtoObject;

    await next();
  };
}
