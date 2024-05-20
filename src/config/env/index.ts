/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */

import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  PORT: z.coerce.number().default(3005),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  STATUS_SERVICE_URL: z.string(),
  ORDER_SERVICE_URL: z.string(),
  MERCADO_PAGO_GENERATE_PAYMENT: z.string(),
  MERCADO_PAGO_WEBHOOK_URL: z.string(),
  MERCADO_PAGO_API_HOST: z.string(),
  MERCADO_PAGO_BEARER_TOKEN: z.string(),
  MERCADO_PAGO_USER_ID: z.string(),
  MERCADO_PAGO_EXTERNAL_POS_ID: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
