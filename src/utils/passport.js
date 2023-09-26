import passport from "passport";
import config from "../config/index.js";
import localStrategy from "passport-local";
import googleStrategy from "passport-google-oauth20";
import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { options } from "../utils/commander.js";
import { hashData, compareData } from "./bcrypt.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const enviorment = config.node_env;
const env = options.mode;

const domain =
  enviorment === "production"
    ? config.production_domain
    : "http://localhost:8080";

// jwt
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.jwt_secret;

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Token no válido" });
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
export const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        userNamefield: "email",
        passwordField: "password",
      },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          //Comprueba si el usario ya existe
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }
          const hash = await hashData(password);
          const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: hash,
          });
          const createdUser = await userModel.create(newUser);
          // Si el usuario se crea correctamente, continua con el siguiente middleware
          const newCart = new cartModel.create({ products: [] });
          await cartModel.create(newCart);
          const updateUser = await userModel.findOneAndUpdate(
            { _id: createdUser._id },
            { cart: newCart._id },
            { new: true }
          );
          return done(null, updateUser);
        } catch (error) {
          return done("Error al crear el usuario" + error);
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      { userNamefield: "email" },
      async (user, password, done) => {
        try {
          if (!user.password) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!compareData(password, user.password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          if (compareData(password, user.password)) {
            return done(null, user, {
              message: "Ha iniciado sessión correctamente!",
            });
          }
        } catch (error) {
          return done("Error al iniciar sesión" + error);
        }
      }
    )
  );

  passport.use(
    "google",
    new googleStrategy(
      {
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: `${domain}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          //Crear el usario si este no existe
          if (!user) {
            const newUser = new userModel({
              first_name: profile._json.given_name,
              last_name: profile._json.family_name,
              email: profile.emails[0].value,
              age: 0,
              password: "Google", //Contraseña por defecto para identificar que el usuario se registro con google
            });

            const createdUser = await userModel.create(newUser);
            // Si el usuario se crea correctamente, continua con el siguiente middleware
            const newCart = new cartModel.create({ products: [] });
            await cartModel.create(newCart);
            const updateUser = await userModel.findOneAndUpdate(
              { _id: createdUser._id },
              { cart: newCart._id },
              { new: true }
            );
            return cb(null, updateUser);
          } else {
            //Si el usuario ya existe, retorna el usuario
            return cb(null, user);
          }
        } catch (error) {
          return cb(
            "No se pudo crear el usario con tu cuenta de Google " + error
          );
        }
      }
    )
  );
};

//Inicializamos la session del usuario con Serialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});
//Obtener la session del usuario  Deserialize
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});
