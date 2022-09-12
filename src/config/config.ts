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
    jwtSecret: process.env.JWT_SECRET,
  },
});
