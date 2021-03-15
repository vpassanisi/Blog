import { v4 as uuid } from "uuid";
import matter from "gray-matter";
import fetch from "node-fetch";
import sharp from "sharp";
import svgToDataURI from "mini-svg-data-uri";
import type Koa from "koa";
import type { Post, Request } from "./types";

export async function posts(ctx: Koa.Context) {
  const { slug } = <Request>ctx.request.body;
  let text = "SELECT * FROM posts";
  let res;

  if (!slug) {
    res = await ctx.pool.query<Post>(text);
  } else {
    text = text + " WHERE slug = $1";
    res = await ctx.pool.query<Post>(text, [slug]);
  }

  ctx.body = res.rows;
}

export async function newPost(ctx: Koa.Context) {
  const { md, slug, title, banner, excerpt } = <Request>ctx.request.body;
  if (!md) ctx.throw("no markdown");
  if (!slug) ctx.throw("no slug");
  if (!title) ctx.throw("no title");
  if (!banner) ctx.throw("no banner");
  if (!excerpt) ctx.throw("no excerpt");

  const res = await fetch(banner);
  const buffer = await res.buffer();

  const test = await sharp(buffer).resize({ height: 20 }).blur(2).toBuffer();

  const base64 = test.toString("base64");

  const text =
    "INSERT INTO posts(id, slug, title, banner, tiny, excerpt, markdown, created, updated, live) VALUES($1, $2 ,$3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
  const values = [
    uuid(),
    slug,
    title,
    banner,
    "data:image/jpeg;base64," + base64,
    excerpt,
    md,
    Math.floor(Date.now() / 1000),
    null,
    true,
  ];

  const result = await ctx.pool.query<Post>(text, values);

  ctx.body = { slug: result.rows[0].slug };
}
