/**
 * Catches async errors and propagates them to global error handler
 * @param {function} fn
 * @returns {function}
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // probagate to error handling middleware
  };
};
