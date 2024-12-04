import SchemaBuilder from "npm:@pothos/core@3.41.0";
import casual from "npm:casual";
import { GraphQLError } from "npm:graphql@16.8.1";

// Enums
export enum Stage {
  Idea = "Idea",
  Prototype = "Prototype",
  Seed = "Seed",
  SeriesA = "Series A",
  SeriesB = "Series B",
  SeriesC = "Series C",
}

export enum Sector {
  Fintech = "Fintech",
  IOT = "IOT",
  Roboadvisory = "Roboadvisory",
  Insuretech = "Insuretech",
}

export interface Company {
  id: number;
  name: string;
  stage: Stage;
  sector: Sector;
  investmentSize: number;
}

// Helper functions
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sample data
export const sectors = Object.values(Sector);
export const stages = Object.values(Stage);

export const companies: Company[] = [
  ...Array(getRandomNumber(2, 4)).keys(),
].map((_, id) => ({
  id,
  name: casual.company_name,
  stage: casual.random_element(stages),
  sector: casual.random_element(sectors),
  investmentSize: Math.round(Math.random() * 10000000),
}));

// Pothos Schema Builder
const builder = new SchemaBuilder<{
  Objects: {
    Company: Company;
  };
  Enums: {
    Stage: Stage;
    Sector: Sector;
  };
}>({});

// Define Enums
builder.enumType(Stage, {
  name: "Stage",
});

builder.enumType(Sector, {
  name: "Sector",
});

// Define Company type
builder.objectType("Company", {
  description: "A company entity",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    stage: t.field({
      type: Stage,
      resolve: (company) => company.stage,
    }),
    sector: t.field({
      type: Sector,
      resolve: (company) => company.sector,
    }),
    investmentSize: t.exposeInt("investmentSize"),
  }),
});

// Define Query type
builder.queryType({
  fields: (t) => ({
    companies: t.field({
      type: ["Company"],
      resolve: () => companies,
    }),
    sectors: t.field({
      type: [Sector],
      resolve: () => sectors,
    }),
    stages: t.field({
      type: [Stage],
      resolve: () => stages,
    }),
  }),
});

// Define Mutation type
builder.mutationType({
  fields: (t) => ({
    addCompany: t.field({
      type: "Company",
      args: {
        name: t.arg.string({ required: true }),
        stage: t.arg({ type: Stage, required: true }),
        sector: t.arg({ type: Sector, required: true }),
        investmentSize: t.arg.int({ required: true }),
      },
      resolve: (_, args) => {
        // Validation
        if (args.name.length <= 2) {
          throw new GraphQLError(
            "Company name has to be longer than 2 characters",
          );
        }
        if (args.investmentSize < 0) {
          throw new GraphQLError("Investment size has to be positive number");
        }

        const newCompany: Company = {
          id: companies.length,
          name: args.name,
          stage: args.stage,
          sector: args.sector,
          investmentSize: args.investmentSize,
        };

        companies.push(newCompany);
        return newCompany;
      },
    }),
  }),
});

// Create and export schema
export const schema = builder.toSchema();
