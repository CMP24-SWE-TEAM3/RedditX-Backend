const mongoose = require("mongoose");
const commentSchema=mongoose.Schema({
	authorId: String,
	authorUsername: String,
	isRoot: {

	    type: Boolean,
	    default: true
  	},
	replyingTo:{
		type: commentSchema
	}
	,
	replies:[
        {
		type: commentSchema
        }
	],
	text: String,
	voteCount: {
		type:number,
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
		type: number,
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