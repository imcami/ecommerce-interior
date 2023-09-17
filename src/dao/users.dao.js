import userModel from "./models/user.model.js";

export default class userModelsDAO {
  get = (params) => {
    return userModel.find(params);
  };

  getBy = (params) => {
    return userModel.findOne(params);
  };

  save = (doc) => {
    return userModel.create(doc);
  };

  update = (id, doc) => {
    return userModel.findByIdAndUpdate(id, { $set: doc });
  };
  delete = (id) => {
    return userModel.findByIdAndDelete(id);
  };
}
