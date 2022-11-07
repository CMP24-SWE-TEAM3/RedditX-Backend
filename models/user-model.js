
const mongoose = require('mongoose');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isemail');

const userPrefsSchema = new mongoose.Schema({
    /*********************************************************************************
     * the attributes
     **********************************************************************************/
    emailPrivateMessage: Boolean, /* determine if the user will be emailed when there is a private message*/
    countryCode: String, /* the country code of the user may be used in validation the phone number and recommendations of the posts*/
    commentsNum: Number, /* the default num of comments of the post will be shown after the post*/
    emailCommentReply: Boolean, /* determines if the user will be emailed when there is a reply on his commment */
    emailUpVoteComment: Boolean,  /* determines if the user will be emailed when there is an UP vote on his comment*/
    emailPostReply: Boolean,  /* determines if the user will be emailed when there is areply on his post */
    emailUpVote: Boolean,     /* determines if the user will be emailed when there is an UP vote in general*/
    emailUnsubscripeAll: Boolean,
    publicVotes: Boolean,   /* determine if the user will allow the public votes on his content or not */
    enableFollowers: Boolean,  /* determine if the user will enable any one to follow him */
    highLightNewcomments: Boolean,  /* determine if the new comments will be highlighted*/
    defaultCommentSort: {  /* determines the criteria of sorting comments*/
        type: String,
        enum: ['top', 'new', 'random', 'best', 'hot'],
        default: 'new',
    },
    labelNSFW: Boolean,  /* determine if the user to label nsfw content in the feed*/
    markMessagesRead: Boolean,  /* indicate the reading of all messages of the user*/
    liveOrangereds: Boolean,  /* determine if the new notifications will be highlighted in red*/
    showLinkFlair: Boolean, /* determine the show of link flair*/
    showLocationBasedRecommendation: Boolean,  /* show recommended content based on location of the user */
    searchIncludeOver18: Boolean, /* determine the availability of searching over18*/
    over18: Boolean,  /* determine if the age over 18*/
    language: String,  /* Interface language (IETF language tag, underscore separated) */
    showPostInNewWindow: Boolean,  /* showing the clicked posts in new window*/
    emailMessages: Boolean, /* determine if the user will be eamiled when there is a new message */
    threadedMessages: Boolean, /* determine the availability of the threaded messages */

});


const tourSchema = new mongoose.Schema({
    /*********************************************************************************
     * the attributes
     **********************************************************************************/
    username: {
        type: String,
        required: true,
        unique: true,
    },
    inboxCount: Number,
    canCreateSubreddit: Boolean,
    friendsCount: Number,
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
    },
    avatar: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    passWordResetToken: {
        type: String,
        validate: [validator.isJWT, 'the only format allowed to this field is JWT'],
    },
    postKarma: Number,
    commentKarma: Number,
    /*the ER diagram has an attribute that is called karma but it is equal to sum of post karma 
    and comment karma */
    karma: Number,
    phoneNumber: {
        type: String,
        validate: {
            validator: function () {
                const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
                return regex.match(input_str);
            }
        }
    },
    birthDate: {
        required: true,
        type: Date,
    },
    phoneNumber: {
        type: String,
        validate: [validator.isMobilePhone, 'please provide a valid phone number'],
    },
    createdAt: {
        type: Date,
        required: [true, 'missing the date of creation of the user'],
    },
    isPasswordSet: {
        type: Boolean,
        required: [true, 'provide the value of isPasswordSet to determine the type of signing of user']
    },
    password: {
        type: String,
        validate: [validator.isStrongPassword, 'provide a strong password'],
        minLength: [8, 'the minimum length of password is 8'],
        maxLength: [40, 'the max length of the password is 40'],
        select: false,
        /*we didn't put required field due to google and facebook signing in*/
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (pas) {
                return pas === this.password
            },
            message: 'the passwords aren\'t the same',
        }
    },
    displayName: {
        type: String,
        required: true,
    },
    passWordResetExpires: {
        type: Date,
        select: false,
    },
    passwordChangedAt: {
        type: Date,
        select: false,
        default: this.createdAt,
    },
    hasVerifiedEmail: Boolean,
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'please provide your gender'],
    },
    about: {
        type: String,
        default: `my name is ${this.displayName}`,
    },
    prefs: userPrefsSchema,
    /*********************************************************************************
     * the relations
     **********************************************************************************/

    /***************************************
     * recursive relations
     ***************************************/
    friendRequest: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    friend: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    blocks: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    follows: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    /***************************************
     * communities relations
     ***************************************/
    member: [
        {
            communityId: {
                type: mongoose.Schema.ObjectId,
                // ref:'Community',  /* this will be un commented when the community schema will be ready*/
            },
            isMuted: Boolean,
            isBanned: Boolean,
        }
    ],
    moderators: [
        {
            communityId: {
                type: mongoose.Schema.ObjectId,
                // ref:'Community',   /* this will be un commented when the community schema will be ready*/
            },
            role: {
                type: String,
                enum: ['creator', 'moderator'],
            }
        }
    ],
    /***************************************
     * category relation
     ***************************************/
    categories: [
        {
            type: mongoose.Schema.ObjectId,
            // ref:'Category'

        }
    ],

    /***************************************
     * posts relations
     ***************************************/
    hasPost: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
        }
    ],
    followPost: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
        }
    ],
    /***************************************
     * notifications relations
     ***************************************/
    notifications: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Notification'
        }
    ]
})