import Koa from "koa";

const string = () => (value: any) => typeof value === "string" && !!value;
const boolean = () => (value: any) => typeof value === "boolean";

const newPost: Record<string, Function> = {
  md: string(),
  slug: string(),
  title: string(),
  banner: string(),
  excerpt: string(),
  live: boolean(),
};

const updatePost: Record<string, Function> = {
  id: string(),
  live: boolean(),
};

const schemas = { newPost, updatePost };

export default function validator(schema: Record<string, Function>) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const errs = Object.keys(schema).filter((key) => {
      return !schema[key](ctx.request.body?.[key]);
    });

    errs.forEach((err) => ctx.throw(400, `request did not contain ${err}`));

    await next();
  };
}

export { schemas };
