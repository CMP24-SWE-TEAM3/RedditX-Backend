/**
 * FILE: user-service
 * description: the services related to users only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const mongoose = require('mongoose');
const Service = require('./service');

class UserService extends Service {
    constructor(model) {
        super(model);
    }

    getFilteredSubreddits = (subreddits) => {
        return subreddits.map((el) => {
            if (!el.isBanned) {
                return el.communityId;
            }
        })
    }

    addUserFilter = async (req) => {
        /*step 1,2 :get the categories and friends of the user*/
        const { member, friend, follows } = await this.getOne({ _id: req.username, select: 'member friend follows' });
        const subreddits = this.getFilteredSubreddits(member);

        /* step 3 :add the subreddits to addedFilter*/
        req.addedFilter = {
            $or: [
                {
                    communityID: {
                        $in: subreddits,
                    },
                },
                {
                    userID: {
                        $in: friend,
                    },
                },
                {
                    userID: {
                        $in: follows,
                    },
                },
            ],
        };
        return req;
    }
}

module.exports = UserService;