import * as Joi from 'joi';

export default () => ({
  port: (process.env.PORT ? parseInt(process.env.PORT, 10) : undefined) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port:
      (process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined) ||
      5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
  },
  auth: {
    jwtAccessTokenSecret: process.env.JWT_AT_SECRET,
    jwtAccessTokenExpireTimeInHours:
      (process.env.JWAT_AT_EXPIRE_TIME_HOURS
        ? parseInt(process.env.JWAT_AT_EXPIRE_TIME_HOURS, 10)
        : undefined) || 1,
    jwtRefreshTokenSecret: process.env.JWT_RT_SECRET,
    jwtRefreshTokenExpireTimeInDays:
      (process.env.JWT_RT_EXPIRE_TIME_DAYS
        ? parseInt(process.env.JWT_RT_EXPIRE_TIME_DAYS, 10)
        : undefined) || 7,
    jwtRefreshTokenReuseGracePeriodInSeconds:
      (process.env.JWT_RT_REUSE_GRACE_PERIOD_SECONDS
        ? parseInt(process.env.JWT_RT_REUSE_GRACE_PERIOD_SECONDS, 10)
        : undefined) || 10,
  },
});

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number(),
  DATABASE_NAME: Joi.string(),
  DATABASE_USER: Joi.string(),
  DATABASE_PASSWORD: Joi.string(),
  JWT_AT_SECRET: Joi.string().required(),
  JWT_AT_EXPIRE_TIME_HOURS: Joi.number().required(),
  JWT_RT_SECRET: Joi.string(),
  JWT_RT_EXPIRE_TIME_DAYS: Joi.number(),
  JWT_RT_REUSE_GRACE_PERIOD_SECONDS: Joi.number(),
});
