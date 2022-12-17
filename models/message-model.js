const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  // _id: {
  //   type: String,
  //   required: [true, "A message must have an id!"],
  // },
  fromID: String,
  toID: String,
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  unread_status: {
    type: Boolean,
    default: 1,
  },
  subject: {
    type: String,
    required: [true, "A message must have a subject!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A subject text must have less than or equal to 100000 characters",
    ],
    minLength: [
      1,
      "A subject text must have more than or equal to 1 character",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
    required: [true, "A messsage must have a text!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A message text must have less than or equal to 100000 characters",
    ],
    minLength: [
      1,
      "A message text must have more than or equal to 1 character",
    ],
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
