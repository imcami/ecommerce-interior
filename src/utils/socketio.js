import { Logger } from "winston";
import { create } from "../services/message.service.js";
import productService from "../services/products.service.js";

import { v4 as uuidv4 } from "uuid";

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
  io.on("Conexión", async (socket) => {
    Logger("Cliente conectado");
    //const user = socket.request.session.user

    //Mensajes del chat
    const messagesList = async () => {
      await productService.findAll(); // Fix: Remove unused variable
      const messages = await productService.findAll();
      socket.emit("server:loadMessages", messages);
    };
    messagesList(); // envío arreglo de mensajes

    socket.on("client:sendMessage", async (data) => {
      await create({ user: users, message: data.msg });
      io.sockets.emit("server:newMessage", {
        msg: data.msg,
        user: users,
      });
    });

    // Productos

    const productsList = async () => {
      const products = await productService.findAll();
      //envío el listado de mis productos
      io.sockets.emit("server:loadProducts", products.docs);
    };

    productsList(); //envío mi arreglo de productos

    socket.on("client:newProduct", async (data) => {
      const newProduct = await productService.createOne({
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
      await productService.deleteOne(pid);
      productsList();
    });

    socket.on("client:getProduct", async (pid) => {
      const product = await productService.findById(pid);
      socket.emit("server:selectedProduct", product);
    });

    socket.on("client:updateProduct", async (updateOne) => {
      await updateOne(updateOne._id, {
        title: updateOne.title,
        description: updateOne.description,
        price: updateOne.price,
        thumbnail: image,
        code: uuidv4(),
        owner: ownerEmail,
        category: updateProd.category,
        stock: updateProd.stock,
      });
      productsList();
    });

    socket.emit("prueba", "probando");
    socket.on("disconnect", async () => {
      console.log(socket.id, "disconnected");
    });
  });
};
