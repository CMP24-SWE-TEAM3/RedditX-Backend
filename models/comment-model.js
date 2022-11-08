const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema=new Schema({
    _id: {
        type: String,
        minLength: [5, "the minimum length is 5 characters"],
        maxLength: [20, "the maximum length is 20"],
        required: [true, "this name isn't unique"],
        unique: [true, "the comment must have an id"],
    },
	authorId: String,
	authorUsername: String,
	isRoot: {

	    type: Boolean,
	    default: true
  	},
	replyingTo:{
		type: String
	}
	,
	replies:[
        {
		type: String
        }
	],
	text: String,
	votesCount: {
		type:Number ,
		default:1
	},
	creationDate:{
		type:Date,
		default: Date.now
	
	},
	
	isDeleted: Boolean,
	isLocked: Boolean,
	editedAt:{
		type:Date,
		
	
	},
	spamCount: {
		type: Number,
default: 0
	},
	isCollapsed: Boolean,
	//spams:[
	 // type: spamSchema
	//]
	
	


});

const spamSchema= mongoose.Schema({
  text: String,
  type: String,
});

const Comment= mongoose.model("Comment", commentSchema);
module.exports = Comment;