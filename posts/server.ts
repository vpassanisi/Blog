import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import { Pool } from "pg";
import { env } from "./util/envValidator";
import * as controller from "./controllers/posts";

const pool = new Pool({
  user: "vpassanisi",
  host: "postgres",
  password: "tele.831",
  database: "blogDB",
  port: 5432,
  ssl: false,
});

const app = new Koa();
const router = new KoaRouter();

app.use(async (ctx, next) => {
  ctx.pool = pool;
  await next();
});

app.use(bodyParser());

router.post("/", controller.posts);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.PORT, () =>
  console.log(
    "\x1b[35m%s\x1b[0m",
    `posts service is running on port ${env.PORT}`
  )
);
