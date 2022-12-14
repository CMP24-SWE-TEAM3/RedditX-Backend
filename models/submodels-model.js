const mongoose = require("mongoose");
const communityRuleSchema = mongoose.Schema({
  title: String,
  description: String,
  reason: String,
});

const CommunityRule = mongoose.model("CommunityRule", communityRuleSchema);

module.exports = {
  CommunityRule,
};
