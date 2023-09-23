import userModel from "./models/user.model.js";

export default class userModelsDAO {
  findUserById = async (id) => {
    return await userModel.findById(id);
  };

  findByEmail = async (email) => {
    return userModel.findOne({ email: email });
  };

  updateUser = async (id) => {
    return await userModel.findByIdAndUpdate({ email: id });
  };
  getUserTokenFrom = (user) => {
    return {
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      documents: user.documents,
      last_connection: user.last_connection,
    };
  };
  findByToken = async (token) => {
    return await userModel.find({ token: token });
  };
  findByExpired = async (token, timeToExpired) => {
    return await userModel.find({ token: token, expired: timeToExpired });
  };
  createOne = async (obj) => {
    return await userModel.create(obj);
  };
  delete;
}
