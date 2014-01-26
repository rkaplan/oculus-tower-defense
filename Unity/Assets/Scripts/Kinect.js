#pragma strict

// var functions
var makeRequest : Function;
var handleEvent : Function;

class RequestInfo {
  var www : WWW;
  var cb : Function;

  function RequestInfo(www : WWW, cb : Function){
    this.www = www;
    this.cb  = cb;
  };
};

makeRequest = function(cb : Function){
  Debug.Log("called");
  var www : WWW = new WWW("http://127.0.0.1:3000");
  Debug.Log("Sending request");

  StartCoroutine("waitForRequest", RequestInfo(www, cb));

  /*yield www;

  Debug.Log("got it");
  if (www.error == null){
    Debug.Log("Got " + www.text);
  } else {
    Debug.Log("SHIIT");
  }*/ 
};

handleEvent = function(err : String, text : String){
  if (err){
    Debug.Log("SHIIIT " + err);
  } else {
    Debug.Log("Got " + text);
  }
};

function waitForRequest (request_obj : RequestInfo){
  var www = request_obj.www;

  while (true){
    if (www.isDone){
      if (www.error){
        request_obj.cb(www.error, null);
        return;
      }
      request_obj.cb(null, www.text);
    }
    yield;
  }
};

function Update(){
  makeRequest(handleEvent);
  /*makeRequest("http://localhost:1337", function(err, data){
    if (err){
      Debug.Log("SHIIT");
      return;
    }
    Debug.Log(data);
  });*/
}

