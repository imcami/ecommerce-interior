import mongoose from "mongoose";
import bcrypt from "bcrypt";

const collection = "userModel";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Validación simple de email
    },
    password: {
      type: String,
      required: true,
    },
    //indicar la última conexión del usuario mediante un last_connection
    last_connection: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    //array para indicar el nombre y path de los documentos para los usuarios
    documents: {
      name: String,
      reference: String,
    },
    clients: [
      {
        _id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Client",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash de contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Campo virtual para el nombre completo
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
