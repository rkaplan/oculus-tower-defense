#pragma strict
var camera0 : Camera;
var camera1 : Camera;

private var cameras : Camera[];

// functions
var switchToCamera : Function; var checkInput : Function, var rotateView : Function;

function Start () {
  // put the cameras in the camera object
  // is there a better way to do this and keep the variables unity nice?
  
  cameras = [
    camera0, camera1
  ];
  switchToCamera(camera0);
}

function Update () {
  checkInput();
}

checkInput = function(){
  if (Input.GetKeyDown("space")){
    if (camera0.enabled){
      switchToCamera(camera1);
    } else {
      switchToCamera(camera0);
    }
  }

  /*if (Input.GetKeyDown("left")){
    rotateView(true);
  } else if (Input.GetKeyDown("right")){
    rotateView(false );
  }*/
};

rotateView = function(camera : Camera){
  Camera.current.transform.RotateAround(currentTower, 
};

switchToCamera = function (camera : Camera){
  camera.enabled = true;
  for (var i = 0; i < cameras.length; i++){
    var currCamera : Camera = cameras[i];;
    if (currCamera !== camera){
      currCamera.GetComponent(AudioListener).enabled = false;
      currCamera.enabled = false;
    }
  }
};
