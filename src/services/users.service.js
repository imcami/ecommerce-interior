import UsersManager from "../dao/users.dao.js";

const usersManager = new UsersManager();

export const findUserByEmail = async (email) => {
  try {
    const userEmail = await usersManager.findByEmail(email);
    return userEmail;
  } catch (error) {
    return error;
  }
};

export const findUserById = async (id) => {
  try {
    const userId = await usersManager.findUserById(id);
    return userId;
  } catch (error) {
    return error;
  }
};

export const generateToken = async (user) => {
  try {
    const token = await usersManager.generateToken(user);
    return token;
  } catch (error) {
    return error;
  }
};
export const findUserByToken = async (tokenPass) => {
  try {
    const userToken = await usersManager.findByToken(tokenPass);
    return userToken;
  } catch (error) {
    return error;
  }
};
// MockUsers es un metodo que genera usuarios falsos
export const mockUsers = async (quantity) => {
  try {
    const users = [];
    for (let i = 0; i < quantity; i++) {
      const user = generateUser();
      users.push(user);
    }
    return users;
  } catch (error) {
    return error;
  }
};

export const findUserToUpdate = async (tokenPass, timeToExpiredPass) => {
  try {
    const userValid = await usersManager.findByExpired(
      tokenPass,
      timeToExpiredPass
    );
    return userValid;
  } catch (error) {
    return error;
  }
};

export const createUser = async () => {
  try {
    const user = await usersManager.mockUsers();
    return user;
  } catch (error) {
    return error;
  }
};

export const resetPass = async (id, pass) => {
  try {
    const user = await usersManager.resetPass(id, pass);
    return user;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (id, change, state) => {
  try {
    const user = await usersManager.updateUser(id, change, state);
    return user;
  } catch (error) {
    return error;
  }
};

export const deleteUser = async (id) => {
  try {
    const user = await usersManager.deleteUser(id);
    return user;
  } catch (error) {
    return error;
  }
};

export const updateLastConnection = async (id) => {
  try {
    const user = await usersManager.updateLastConnection(id);
    return user;
  } catch (error) {
    return error;
  }
};
