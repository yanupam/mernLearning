const {
    MONGODB_CONNECTION_STRING,
    USERS_TABLES,
  } = require("../constants/constants");
  const { UserModal } = require("../modals/User");
  const mongoose = require("mongoose");
mongoose.connect(`${MONGODB_CONNECTION_STRING}my-app`);

const User = mongoose.model(USERS_TABLES, UserModal);

module.exports= {
    User
}