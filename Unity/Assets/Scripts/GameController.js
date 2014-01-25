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
private var viewingTower : Tower;

// functions
var setupCameraRotations : Function;
var switchToTower : Function; var checkLookingAt : Function;
var switchToCamera : Function; var toggleCameras : Function;
var highlightTower : Function; var unHighlightTower : Function;
var checkInput : Function;

function Start () {
  setupCameraRotations();
  switchToTower(towers[0]);
}

function Update () {
  checkInput();
  checkLookingAt();
}

checkLookingAt = function(){
  var ray : Ray = currentTower.camera.GetComponentInChildren(Camera).ViewportPointToRay(Vector3(0.5,0.5,0));
  var hit : RaycastHit;
  Debug.DrawRay(ray.origin, ray.direction, Color.red);
  if (Physics.Raycast(ray, hit)){
    if (hit.transform.gameObject.tag == "Tower"){
      // find the tower that we're hitting
      for (var i = 0; i < towers.length; i++){
        if (towers[i] !== currentTower && towers[i].TowerObject == hit.transform.gameObject){
          viewingTower = towers[i];
          break;
        }
      }
      if (viewingTower){
        highlightTower(viewingTower);
      }
    } else {
      if (viewingTower){
        unHighlightTower(viewingTower);
        viewingTower = null;
      }
    }
  }
};

checkInput = function(){
  if (viewingTower && Input.GetKeyDown("space")){
    switchToTower(viewingTower);
    unHighlightTower(viewingTower);
  }
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

highlightTower = function(tower : Tower){
  tower.TowerObject.renderer.material.color = Color.green;
};

unHighlightTower = function(tower: Tower){
  tower.TowerObject.renderer.material.color = Color.grey;
};
