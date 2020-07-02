import GroupRsesolver from "./GroupsResolver";
import UserResolver from "./UserResolver";
<<<<<<< HEAD
import AreaResolver from "./AreaResolver";
import PublicationResolver from "./PublicationResolver";
=======
import NotesResolver from "./NotesResolver";
>>>>>>> 3b2f80b31be10a3570e1a438b34ce7e973533b5f

export const resolvers = {
  Query: {},

  Mutation: {},
};
// Querys
Object.assign(resolvers.Query, UserResolver.Query);
Object.assign(resolvers.Query, GroupRsesolver.Query);
Object.assign(resolvers.Query, NotesResolver.Query);
//  Mutations

Object.assign(resolvers.Mutation, UserResolver.Mutation);
Object.assign(resolvers.Mutation, GroupRsesolver.Mutation);
<<<<<<< HEAD
Object.assign(resolvers.Mutation, AreaResolver.Mutation);
Object.assign(resolvers.Mutation, PublicationResolver.Mutation);
=======
Object.assign(resolvers.Mutation, NotesResolver.Mutation);
>>>>>>> 3b2f80b31be10a3570e1a438b34ce7e973533b5f
