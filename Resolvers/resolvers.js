import GroupRsesolver from "./GroupsResolver";
import UserResolver from "./UserResolver";

export const resolvers = {
  Query: {},

  Mutation: {},
};
// Querys
Object.assign(resolvers.Query, UserResolver.Query);
Object.assign(resolvers.Query, GroupRsesolver.Query);

//  Mutations

Object.assign(resolvers.Mutation, UserResolver.Mutation);
Object.assign(resolvers.Mutation, GroupRsesolver.Mutation);
