const Comment=require('../models/comment-model');
//const { findById } = require('../models/post-model');
const Post =require('../models/post-model');


const vote=async(req,res)=>{

    const id=req.body.postId.substring(0,2);
    const dir=req.body.dir;
    let error;
    if(id==='t3'){ //post
        const post=await  Post.findById({ _id: req.body.postId })
           
        let votesCount=post.votesCount;
        let operation;
        if(dir==1||dir==2){
          operation=1;           
        }
        else if(dir==0||dir==-1){
            operation=-1;
        }
        await Post.findOneAndUpdate({ _id: post._id }, { $set: { votesCount: votesCount+operation} }, { new: true },
            (err, doc) => {
                if (err) {
                    console.log("error happened while updating");
                    
                } else {
                    console.log('asd');
                    return res.status(200);
                }
            }
        );

    }
    else if(id==='t1'){//comment or reply

        const comment=await  Comment.findById({ _id: req.body.postId })
           
        let votesCount=comment.votesCount;
        let operation;
        if(dir==1||dir==2){
          operation=1;           
        }
        else if(dir==0||dir==-1){
            operation=-1;
        }
        await Comment.findOneAndUpdate({ _id: comment._id }, { $set: { votesCount: votesCount+operation} }, { new: true },
            (err, doc) => {
                if (err) {
                    console.log("error happened while updating");
                    
                } else {
                    console.log('asd');
                    return res.status(200);
                }
            }
        );


    }
    

}
module.exports={
    vote
}