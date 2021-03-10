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
                title: { type: GraphQLString },
                markdown: { type: GraphQLString },
                created: { type: GraphQLInt },
                updated: { type: GraphQLInt },
              },
            })
          )
        ),
        args: {
          title: { type: GraphQLString },
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
});

export { schema };
