import { GraphQLHTTP } from "jsr:@deno-libs/gql";

import schema from "./schema.ts";

function setCORS(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const handler = async (req: Request) => {
  if (req.method === "OPTIONS") {
    return setCORS(new Response(null));
  }

  const { pathname } = new URL(req.url);

  const response =
    pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema,
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });

  return setCORS(response);
};

Deno.serve(
  {
    port: 8000,
  },
  handler,
);
