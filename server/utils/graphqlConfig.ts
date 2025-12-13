import { GraphQLClient } from "graphql-request";

const config = useRuntimeConfig()

const client = new GraphQLClient(`${config.strapiUrl}/graphql`, {
  headers: {
    "Authorization": `Bearer ${config.strapiToken}`
  }
});

export default client;