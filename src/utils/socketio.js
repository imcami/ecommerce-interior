import { create, findAll } from "../services/messages.service.js";
import {
  createOne,
  deleteOne,
  findAll as findAllProducts,
  findById,
  updateOne,
} from "../services/products.service.js";
import { v4 as uuidv4 } from "uuid"; // genera un codigo random

let ownerEmail;
let image;
let users;

export const upload = (url) => {
  image = url;
};

export const userPremium = (user) => {
  ownerEmail = user;
};

export const usersOnline = (userOn) => {
  users = userOn.first_name;
};

export default (io) => {
  io.on("connection", async (socket) => {
    console.log("Client connected");
    //const user = socket.request.session.user

    // C H A T

    const messagesList = async () => {
      const messages = await findAll();
      socket.emit("server:loadMessages", messages);
    };
    messagesList(); // envío mi arreglo de mensajes

    socket.on("client:sendMessage", async (data) => {
      await create({ user: users, message: data.msg });
      io.sockets.emit("server:newMessage", {
        msg: data.msg,
        user: users,
      });
    });

    // P R O D U C T S

    const productsList = async () => {
      const products = await findAllProducts();
      //envío el listado de mis productos
      io.sockets.emit("server:loadProducts", products.docs);
    };

    productsList(); //envío mi arreglo de productos

    socket.on("client:newProduct", async (data) => {
      const newProduct = await createOne({
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnail: image,
        code: uuidv4(),
        owner: ownerEmail,
        stock: data.stock,
        category: data.category,
      });
      console.log(newProduct);
      io.sockets.emit("server:newProduct", newProduct); // envío los datos del nuevo producto creado
    });

    socket.on("client:deleteProduct", async (pid) => {
      // elimino el producto seleccionado y actualizo el front
      await deleteOne(pid);
      productsList();
    });

    socket.on("client:getProduct", async (pid) => {
      const product = await findById(pid);
      socket.emit("server:selectedProduct", product);
    });

    socket.on("client:updateProduct", async (updateProd) => {
      await updateOne(updateProd._id, {
        title: updateProd.title,
        description: updateProd.description,
        price: updateProd.price,
        thumbnail: image,
        code: uuidv4(),
        owner: ownerEmail,
        category: updateProd.category,
        stock: updateProd.stock,
      });
      productsList();
    });

    socket.emit("prueba", "probando");
    //process.on('warning', e => console.warn('-----+------',e.stack))
    socket.on("disconnect", async () => {
      console.log(socket.id, "disconnected");
    });
  });
};
