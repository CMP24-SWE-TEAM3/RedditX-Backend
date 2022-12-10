var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount= require("../config/push-notification-key.json");
const certPath= admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

sendPushNotification = (req,res,next)=>{
    try{
        let message = {
            notification:{
                title:"I will be 22 at 15 DEC",
                body:" test body"
            },
            data:{
                orderId:"123456",
                orderDate:"2022-12-15"
            },
            token:req.body.fcm_token
        };
        FCM.send(message,function(err,resp){
            if(err){
                return res.status(500).send({
                    message:err
                });
            }
            else{
                return res.status(200).send({
                    message:"notification sent"
                });
            }
        })
    }
    catch(err){
        console.log(err);
    }
}












// const {ONE_SIGNAL_CONFIG}=require("../config/app.config");
// const pushNotificationService=require("../services/push-notifications-service");


// const sendNotification=async(req,res,next)=>{
//     var message={
//         app_id:ONE_SIGNAL_CONFIG.APP_ID,
//         contents:{en:"TEST"},
//         included_segments:["All"],
//         content_available : true,
//         small_icon :"ic_notification_icon",
//         data:{
//             PushTitle:"CUSTOM NOTIFICATION"
//         }
//     };
//     pushNotificationService.SendNotification(message,(error,result)=>{
//         if(error){
//             console.log("err");
//             return next(error);
//         }
//         return res.status(200).send({
//             message:"Success",
//             data:result
//         })
//     })   
// }
// module.exports={
//     sendNotification
// }