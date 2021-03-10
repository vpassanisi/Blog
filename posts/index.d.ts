import * as Koa from "koa";
import { Pool } from "pg";

declare module "koa" {
  interface BaseContext {
    pool: Pool;
  }
}
