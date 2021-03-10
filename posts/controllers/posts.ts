import type Koa from "koa";

export async function posts(ctx: Koa.BaseContext) {
  const res = await ctx.pool.query(
    "SELECT * FROM posts WHERE created = 123456789"
  );

  ctx.body = res.rows;
}

export async function addPost(ctx: Koa.BaseContext) {}
