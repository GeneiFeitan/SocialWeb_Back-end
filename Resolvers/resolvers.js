import GroupRsesolver from "./GroupsResolver";
import UserResolver from "./UserResolver";
import AreaResolver from "./AreaResolver";
import PublicationResolver from "./PublicationResolver";

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
Object.assign(resolvers.Mutation, AreaResolver.Mutation);
Object.assign(resolvers.Mutation, PublicationResolver.Mutation);
