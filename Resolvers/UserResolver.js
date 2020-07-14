const { neo4jgraphql } = require("neo4j-graphql-js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
import tokenService from "../services/token";
import auth from "../Middleware/Auth";

require("dotenv").config({ path: "variables.env" });

const crearToken = (user, secret, expiresIn) => {
    const { userId, email, name } = user;
    return jwt.sign({ userId, email, name }, secret, { expiresIn });
};

export default {
    Query: {
        allUser: async(obj, args, context, info) => {
            try {
                const resp = await neo4jgraphql(obj, args, context, info);
                return resp;
            } catch (e) {
                console.log("Error");
            }
        },
        obtenerUsuario: async(_, { token }) => {
            try {
                const userId = await jwt.verify(token, process.env.SECRETWORD);
                console.log(JSON.stringify(userId));
                return userId;
            } catch (error) {
                console.log(error);
                return new Error("No se pudo obtener el usuario");
            }
        },
        getUser: async(_, {}, ctx) => {
            try {
                console.log(ctx.user);
                return ctx.user;
            } catch (error) {
                throw new Error("No se pudo obtener el usuario");
            }
        },
    },

    Mutation: {
        updateUser: async(obj, { input }, context) => {
            try {
                console.log("update user");
                // console.log(": "+JSON.stringify(input));
                const session = context.driver.session();
                const res = await session.run("MATCH(n:User {email:$email}) RETURN n", {
                    email: input.email,
                });
                if (!res.records.length) {
                    return new Error("El correo no existe!");
                }
                input.password = await bcryptjs.hash(input.password, 10);
                const mutation = await session.run(
                    "MATCH(n:User {email:$email}) SET n.password = $password RETURN n", {
                        email: input.email,
                        password: input.password,
                    }
                );
                // console.log("mutation: "+mutation);
                console.log("ok");
                session.close();
                const data = mutation.records[0]._fields[0].properties;
                delete data.password;
                console.log(data);
                return data;
            } catch (error) {
                console.log(error);
                return new Error("No se pudo actualizar!");
            }
        },

        newUser: async(obj, { input }, context) => {
            try {
                console.log("entra");
                console.log(input);
                const session = context.driver.session();
                // const salt = await bcryptjs.getSalt(10);
                input.password = await bcryptjs.hash(input.password, 10);
                console.log(input.password);
                const res = await session.run(
                    "CREATE (n:User {userId:$userId, name:$name,email:$email,password:$password,active:$active,employeeNumber:$employeeNumber,rol:$rol}) RETURN n", {
                        userId: input.userId,
                        name: input.name,
                        email: input.email,
                        password: input.password,
                        active: input.active,
                        employeeNumber: input.employeeNumber,
                        rol: input.rol,
                    }
                );

                session.close();
                const data = res.records[0]._fields[0].properties;
                delete data.password;
                console.log(data);
                return data;
            } catch (e) {
                console.log(e);
                return new Error(e);
            }
        },

        authUser: async(obj, { input }, context, info) => {
            try {
                const { email, password } = input;
                const session = context.driver.session();
                const usuario = await session.run(
                    "MATCH(n:User {email:$email}) RETURN n", {
                        email: input.email,
                    }
                );
                session.close();

                if (!usuario.records.length) {
                    return new Error("El correo no existe!");
                }
                // validar contraseña
                const user = usuario.records[0]._fields[0].properties;
                const passwordCorret = await bcryptjs.compare(
                    input.password,
                    user.password
                );
                if (!passwordCorret) {
                    return new Error("el password no es correcto");
                }
                return {
                    token: crearToken(user, process.env.SECRETWORD, "24h"),
                };
            } catch (error) {
                return new Error(error);
            }
        },



        DeleteUser: async(obj, { input }, context) => {
            try {
                console.log("Delete User");
                console.log(input);
                const session = context.driver.session();
                const user = await session.run(
                    "MATCH(u:User {userId:$userId}) SET u.active=$active  RETURN u", {
                        userId: input.userId,
                        active: false,
                    }
                );
                session.close();
                const data = user.records[0]._fields[0].properties;
                console.log(data);
                return data;
            } catch (error) {
                console.log(error);
                return new Error(error);
            }
        },



        CreateUserAndAddtoArea: async(obj, { input }, context, info) => {
            try {
                console.log("entra");
                const session = context.driver.session();
                // const salt = await bcryptjs.getSalt(10);
                input.password = await bcryptjs.hash(input.password, 10);
                const res = await session.run(
                    'MATCH (a:Area) WHERE a.areaId=$areaId CREATE (u:User {userId:$userId, name:$name,email:$email,password:$password,active:$active,employeeNumber:$employeeNumber,rol:$rol}) MERGE (u)-[:WORKS{role:"Back Developer"}]->(a) RETURN u', {
                        userId: input.userId,
                        name: input.name,
                        email: input.email,
                        password: input.password,
                        active: input.active,
                        employeeNumber: input.employeeNumber,
                        rol: input.rol,
                        areaId: input.areaId,
                    }
                );

                session.close();
                const data = res.records[0]._fields[0].properties;
                delete data.password;
                console.log(data);
                return data;
            } catch (e) {
                console.log(e);
                return new Error(e);
            }
        },
    },
};