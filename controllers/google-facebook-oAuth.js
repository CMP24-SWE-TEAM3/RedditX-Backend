  
  
  function base64urlDecode(str) {
    return new Buffer(base64urlUnescape(str), 'base64').toString();
  };
  
  function base64urlUnescape(str) {
    str += Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
  }
  const decodeJwt=  (token)=> {
      var segments = token.split('.');
  
      if (segments.length !== 3) {
        // throw new Error('Not enough or too many segments');
        return {
          header: header,
          payload: payload,
          signature: signatureSeg,
          error:"token is not valid"
        }
      }
  
      // All segment should be base64
      var headerSeg = segments[0];
      var payloadSeg = segments[1];
      var signatureSeg = segments[2];
  
      // base64 deco de and parse JSON
    
      var header = JSON.parse(base64urlDecode(headerSeg));
      var payload = JSON.parse(base64urlDecode(payloadSeg));
     
      return {
        header: header,
        payload: payload,
        signature: signatureSeg,
        error:null
      }
      
    }
  //  const ob= decodeJwt('eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ');
  //   console.log(ob.payload.email);
   module.exports={
    decodeJwt
  }