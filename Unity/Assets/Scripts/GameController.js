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
var Laser_prefab : GameObject;

private var currentTower : Tower;
private var viewingTower : Tower;

private var leftLaser : GameObject;
private var rightLaser : GameObject;

// functions
var setupCameraRotations : Function;
var switchToTower : Function; var checkLookingAt : Function; var checkRayTowerCollide : Function;
var switchToCamera : Function; var toggleCameras : Function; var rotateCameras : Function;
var highlightTower : Function; var unHighlightTower : Function;
var checkInput : Function;
// attacks
var fireLaser : Function; var removeLaser : Function;
var resetAttacks : Function;

function Start () {
  setupCameraRotations();
  switchToTower(towers[0]);
}

function Update () {
  checkInput();
  checkLookingAt();
}

removeLaser = function(left : boolean){
  if (left && leftLaser){
    Destroy(leftLaser);
    leftLaser = null;
  } else if (!left && rightLaser){
    Destroy(rightLaser);
    rightLaser = null;
  }
};

fireLaser = function(shoulder : Vector3, dir : Vector3, left : boolean){
  var rotationDifference : Quaternion;
  rotationDifference  = currentTower.camera.gameObject.GetComponentInChildren(Camera).transform.rotation;
  Debug.Log("Starting with " + currentTower.camera.gameObject.transform.rotation);
  Debug.Log("Difference " + rotationDifference);
  var origin : Vector3 = currentTower.camera.gameObject.transform.position;
  var currLaser : GameObject;
  var offsetVector : Vector3;
  if (left){
    if (leftLaser){
      currLaser = leftLaser;
    }
    //origin.x -= 0.5;
    offsetVector = rotationDifference * Vector3(-0.5, 0, 0);
  } else if (!left){
    if (rightLaser){
      currLaser = rightLaser;
    }
    offsetVector = rotationDifference * Vector3(0.5, 0, 0);
  }
  origin += offsetVector;
  if (!currLaser){
    currLaser = Instantiate(Laser_prefab, origin, Quaternion.identity);
  }
  origin                       = rotationDifference * origin;
  currLaser.transform.rotation = currLaser.transform.rotation * rotationDifference;
  var line : LineRenderer = currLaser.GetComponent(LineRenderer);
  line.SetVertexCount(2);
  line.SetPosition(1, dir * 200);
  line.SetPosition(0, dir * -100);
  if (left){
    leftLaser = currLaser;
  } else {
    rightLaser = currLaser;
  }
};

checkLookingAt = function(){
  for (var i : float = 0; i < 10; i++){
    // shoot out a ray from both the left and right eye at this y value in the viewport
    var cameras : Component[]   = currentTower.camera.gameObject.GetComponentsInChildren(Camera);
    var cameraLeft : Camera     = cameras[0];
    var cameraRight : Camera    = cameras[1];
    var ray : Ray               = cameraLeft.ViewportPointToRay(Vector3(0.5, i / 10,0));
    if (checkRayTowerCollide(ray)){
      break;
    }
    ray = cameraRight.ViewportPointToRay(Vector3(0.5, 1 / 10, 0));
    if (checkRayTowerCollide(ray)){
      break;
    }
  }
};
checkRayTowerCollide = function(ray : Ray){
  Debug.DrawRay(ray.origin, ray.direction * 1000, Color.red);
  var hit : RaycastHit;
  if (Physics.Raycast(ray, hit)){
    if (hit.transform.gameObject.tag == "Tower"){
      // find the tower that we're hitting
      var viewing : Tower  = null;
      for (var j = 0; j < towers.length; j++){
        if (towers[j] !== currentTower && towers[j].TowerObject == hit.transform.gameObject){
          viewing = towers[j];
          break;
        }
      }
      if (viewing){
        if (viewingTower){
          unHighlightTower(viewingTower);
        }
        viewingTower = viewing;
        highlightTower(viewingTower);
        return true;
      }
    } else {
      if (viewingTower){
        unHighlightTower(viewingTower);
        viewingTower = null;
      }
    }
  }
  return false;
};

checkInput = function(){
  var dir : Vector3; var shoulder : Vector3;
  if (viewingTower && Input.GetKeyDown("space")){
    unHighlightTower(viewingTower);
    switchToTower(viewingTower);
  }
  if (Input.GetKeyDown("a")){
    //fireLaser(Vector3(0.2, 0.2 * -1, 0.5), true);
    dir      = Vector3(0.2, -0.2, 0.5);
    shoulder = Vector3(0.5, 0, 0);
    fireLaser(shoulder, dir, true);
  } else if (Input.GetKeyUp("a")){
    removeLaser(true);
  }
  if (Input.GetKeyDown("b")){
    dir      = Vector3(0.2, -0.2, 0.5);
    shoulder = Vector3(0.5, 0, 0);
    fireLaser(shoulder, dir, false);
  } else if (Input.GetKeyUp("b")){
    removeLaser(false);
  }
  if (Input.GetKey("left")){
    rotateCameras(true);
  } else if (Input.GetKey("right")){
    rotateCameras(false);
  }
};

switchToTower = function (tower : Tower){
  resetAttacks();
  var rotationDifference : Quaternion;
  if (currentTower){
    rotationDifference  = currentTower.camera.gameObject.transform.rotation *
                                        Quaternion.Inverse(currentTower.getCameraRotationOffset());
  } else {
    rotationDifference = Quaternion.identity;
  }

  // switch to this tower's camera
  currentTower = tower;
  switchToCamera(tower.camera, tower.getCameraRotationOffset() * rotationDifference, tower.TowerObject);
};

// destroys all attacks
resetAttacks = function(){
  removeLaser(true);
  removeLaser(false);
};

switchToCamera = function (camera : OVRCameraController, rotation : Quaternion, towerObject : GameObject){
  // Enable both cameras
  toggleCameras(camera, true);
  // set this camera's rotation such that it won't fuck up the kinect

  camera.gameObject.transform.rotation = rotation;
  // disable the other camera's
  for (var i = 0; i < towers.length; i++){
    var currCamera : OVRCameraController = towers[i].camera;
    if (currCamera !== camera){
      // disable both of its cameras
      toggleCameras(currCamera, false);
    }
  }
};

// saves the initial rotation Quaternion of each of the tower's cameras for use later
setupCameraRotations = function(){
  for (var i : int = 0; i < towers.length; i++){
    var currTower : Tower = towers[i];
    currTower.setCameraRotationOffset(currTower.camera.gameObject.transform.rotation);
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

// helper function for moving the world with no rift
rotateCameras = function(left : boolean){
  Debug.Log("Turning");
  var cameras : Component[] = currentTower.camera.gameObject.GetComponentsInChildren(Camera);
  var cameraLeft : Camera   = cameras[0];
  var cameraRight : Camera  = cameras[1];
  var degrees : float = 40;
  if (left){
    degrees *= -1;
  }
  var angle : Vector3 = Vector3.up;
  cameraLeft.gameObject.transform.RotateAround(currentTower.TowerObject.transform.position, Vector3.up, degrees * Time.deltaTime);
  cameraRight.gameObject.transform.RotateAround(currentTower.TowerObject.transform.position, Vector3.up, degrees * Time.deltaTime);
  //currentTower.camera.gameObject.transform.Rotate(Vector3.up, degrees);
  /*cameraLeft.gameObject.transform.Rotate(Vector3.up, degrees * Time.deltaTime);
  cameraRight.gameObject.transform.Rotate(Vector3.up, degrees * Time.deltaTime);*/
};
