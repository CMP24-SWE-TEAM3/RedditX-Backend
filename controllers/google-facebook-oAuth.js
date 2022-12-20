function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), "base64").toString();
}

function base64urlUnescape(str) {
  str += Array(5 - (str.length % 4)).join("=");
  return str.replace(/\-/g, "+").replace(/_/g, "/");
}
const decodeJwt = (token) => {
  var segments = token.split(".");

  if (segments.length !== 3) {
    // throw new Error('Not enough or too many segments');
    return {
      header: header,
      payload: payload,
      signature: signatureSeg,
      error: "token is not valid",
    };
  }

  // All segment should be base64
  var headerSeg = segments[0];
  var payloadSeg = segments[1];
  var signatureSeg = segments[2];

  // base64 deco de and parse JSON
  try {
    var header = JSON.parse(base64urlDecode(headerSeg));
    var payload = JSON.parse(base64urlDecode(payloadSeg));
  } catch (exception) {
    return {
      header: header,
      payload: payload,
      signature: signatureSeg,
      error: "token is not valid",
    };
  }
  return {
    header: header,
    payload: payload,
    signature: signatureSeg,
    error: null,
  };
};
module.exports = {
  decodeJwt,
};
