import sirv from "sirv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import compression from "compression";
import * as sapper from "@sapper/server";
import { schema } from "./schema/schema";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();

app.use(compression({ threshold: 0 }));
app.use(sirv("static", { dev }));
app.post("/gql", graphqlHTTP({ schema }));
app.use(sapper.middleware());

app.listen(PORT);
