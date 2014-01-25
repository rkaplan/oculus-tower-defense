#pragma strict
class Tower{
  var TowerObject  : GameObject;
  var camera : OVRCameraController;

  private var cameraRotationOffset : Quaternion;

  function setCameraRotationOffset(offset : Quaternion){
    cameraRotationOffset = offset;
  }
  function getCameraRotationOffset(){
    return cameraRotationOffset;
  }
};

// globals
var towers: Tower[] = [
];
var currentRotation : float = 0.0; // keep track of how far we've rotated

private var currentTower : Tower;

// functions
var setupCameraRotations : Function;
var switchToTower : Function;
var switchToCamera : Function; var toggleCameras : Function;
var checkInput : Function; var rotateView : Function;

function Start () {
  setupCameraRotations();
  switchToTower(towers[0]);
}

function Update () {
  checkInput();
}

checkInput = function(){
  if (Input.GetKeyDown("space")){
    if (currentTower == towers[0]){
      switchToTower(towers[1]);
    } else {
      switchToTower(towers[0]);
    }
  }

  if (Input.GetKey("left")){
    rotateView(true);
  } else if (Input.GetKey("right")){
    rotateView(false );
  }
};

rotateView = function(left : boolean){
  var degrees : int = 20;
  if (left){
    degrees *= -1;
  }
  var rotateAmount = degrees * Time.deltaTime;
  currentRotation = (currentRotation + rotateAmount) % 360;
  currentTower.camera.transform.RotateAround(currentTower.TowerObject.transform.position, Vector3.up, rotateAmount);
};

switchToTower = function (tower : Tower){
  // switch to this tower's camera
  switchToCamera(tower.camera, tower.getCameraRotationOffset(), tower.TowerObject);
  currentTower = tower;
};

switchToCamera = function (camera : OVRCameraController, initOffset : Quaternion, towerObject : GameObject){
  // Enable both cameras
  toggleCameras(camera, true);
  // set this camera's rotation such that it won't fuck up the kinect

  camera.transform.rotation = initOffset;
  camera.transform.RotateAround(towerObject.transform.position, Vector3.up, currentRotation);
  // disable the other camera's
  for (var i = 0; i < towers.length; i++){
    var currCamera : OVRCameraController = towers[i].camera;
    if (currCamera !== camera){
      // disable both of its cameras
      toggleCameras(currCamera, false);
    }
  }
};

// saves the initial y rotation of each of the tower's cameras for use later
setupCameraRotations = function(){
  for (var i : int = 0; i < towers.length; i++){
    var currTower : Tower = towers[i];
    currTower.setCameraRotationOffset(currTower.camera.transform.rotation);
  }
};

// enables (or disables) the children cameras in this camera controller
toggleCameras = function(camera : OVRCameraController, enable : boolean){
  var cameras : Component[] = camera.gameObject.GetComponentsInChildren(Camera);
  var cameraLeft : Camera   = cameras[0];
  var cameraRight : Camera  = cameras[1];
  cameraLeft.enabled  = enable;
  cameraRight.enabled = enable;
  cameraRight.GetComponent(AudioListener).enabled = enable;
};
