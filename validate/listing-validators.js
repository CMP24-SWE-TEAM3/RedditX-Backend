const validateVoteIn = (id, dir, postIdCasted) => {
  if (
    (id === "t3" || id === "t1") &&
    (dir == 1 || dir == 2 || dir == -1 || dir == 0)
  ) {
    if (validateObjectId(postIdCasted)) {
      return true;
    } else {
      return false;
    }
  } else return false;
};
const validateObjectId = (objectId) => {
  if (objectId.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else return false;
};

module.exports = {
  validateVoteIn,
  validateObjectId,
};
