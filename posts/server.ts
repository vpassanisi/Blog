import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import { Pool } from "pg";
import { env } from "./util/envValidator";
import * as controller from "./controllers/posts";

const pool = new Pool({
  user: env.POSTGRES_USER,
  host: "postgres",
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  port: 5432,
  ssl: false,
});

const app = new Koa();
const router = new KoaRouter();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    // ctx.app.emit('error', err, ctx);
  }
});

app.use(async (ctx, next) => {
  ctx.pool = pool;
  await next();
});

app.use(bodyParser());

router.post("/", controller.posts);
router.post("/newPost", controller.newPost);
router.post("/updatePost", controller.updatePost);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.PORT, () =>
  console.log(
    "\x1b[35m%s\x1b[0m",
    `posts service is running on port ${env.PORT}`
  )
);
