import { createYoga } from "npm:graphql-yoga@4.0.4";
import { schema } from "./schema.ts";

// Create Yoga server
const yoga = createYoga({
  schema,
  graphiql: true,
  cors: {
    origin: "*",
    credentials: true,
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
});

// Start server using Deno
Deno.serve(
  {
    port: 8000,
  },
  yoga,
);

console.log(`🚀 Server running at http://localhost:8000/graphql`);
