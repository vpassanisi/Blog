import { v4 as uuid } from "uuid";
import matter from "gray-matter";
import type Koa from "koa";
import type { Post, Request, Data, Article } from "./types";

export async function posts(ctx: Koa.Context) {
  const { slug } = <Request>ctx.request.body;
  let text = "SELECT * FROM posts";

  if (!slug) {
    const res = await ctx.pool.query<Post>(text);

    const articles = res.rows.map(
      (post): Article => {
        const { content, data } = matter(post.markdown);
        const frontMatter = <Data>data;

        const [excerpt, markdown] = content.split("<!-- more -->");

        return {
          ...frontMatter,
          markdown,
          excerpt,
          id: post.id,
          created: post.created,
        };
      }
    );

    return (ctx.body = articles);
  }

  text = text + " WHERE slug = $1";

  const res = await ctx.pool.query<Post>(text, [slug]);

  ctx.body = res.rows;
}

export async function newPost(ctx: Koa.Context) {
  const { md } = <Request>ctx.request.body;
  if (!md) ctx.throw("no markdown");

  const {
    data: { slug },
  } = matter(md);
  if (!slug) ctx.throw("no title");

  const text =
    "INSERT INTO posts(id, slug, markdown, created, updated) VALUES($1, $2 ,$3, $4, $5) RETURNING *";
  const values = [uuid(), slug, md, Math.floor(Date.now() / 1000), null];

  const res = await ctx.pool.query<Post>(text, values);

  ctx.body = { title: res.rows[0].id };
}
