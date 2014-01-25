#pragma strict
class Tower{
  var TowerObject  : GameObject;
  var camera : Camera;
};

// globals
var towers: Tower[] = [
];

private var currentTower : Tower;

// functions
var switchToTower : Function;
var switchToCamera : Function; var checkInput : Function; var rotateView : Function;

function Start () {
  // put the cameras in the camera object
  // is there a better way to do this and keep the variables unity nice?
  switchToTower(towers[0]);
}

function Update () {
  checkInput();
}

checkInput = function(){
  if (Input.GetKeyDown("space")){
    if (towers[0].camera.enabled){
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
  currentTower.camera.transform.RotateAround(currentTower.TowerObject.transform.position, Vector3.up, degrees * Time.deltaTime);
};

switchToTower = function (tower : Tower){
  // switch to this tower's camera
  switchToCamera(tower.camera);
  currentTower = tower;
};

switchToCamera = function (camera : Camera){
  camera.enabled = true;
  for (var i = 0; i < towers.length; i++){
    var currCamera : Camera = towers[i].camera;
    if (currCamera !== camera){
      currCamera.GetComponent(AudioListener).enabled = false;
      currCamera.enabled = false;
    }
  }
};
