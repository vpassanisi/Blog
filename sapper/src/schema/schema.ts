import fetch from "node-fetch";
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      posts: {
        type: GraphQLNonNull(
          GraphQLList(
            new GraphQLObjectType({
              name: "postType",
              fields: {
                id: { type: GraphQLString },
                slug: { type: GraphQLString },
                title: { type: GraphQLString },
                banner: { type: GraphQLString },
                excerpt: { type: GraphQLString },
                markdown: { type: GraphQLString },
                created: { type: GraphQLInt },
                updated: { type: GraphQLInt },
              },
            })
          )
        ),
        args: {
          slug: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          const res = await fetch("http://posts:5000", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mutation",
    fields: {
      newPost: {
        type: new GraphQLObjectType({
          name: "newPostReturnType",
          fields: {
            title: { type: GraphQLString },
          },
        }),
        args: {
          md: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, ctx, info) {
          const { id } = ctx.headers;
          const { AUTH_UUID } = process.env;
          if (!AUTH_UUID && !id && id !== AUTH_UUID) {
            throw Error("Unauthorized");
          }

          const res = await fetch("http://posts:5000/newPost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          return await res.json();
        },
      },
    },
  }),
});

export { schema };
