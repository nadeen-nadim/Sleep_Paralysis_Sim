//Variables for setup

let container;
let camera;
let renderer;
let scene;
let house;
let arms;

let font_loader;
let story;




var mesh ;
let clock;

var keyboard ={};
var player  = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;





// An object to hold all the things needed for our loading screen
var loadingScreen = {
  scene: new THREE.Scene(),
  font_loader: new THREE.FontLoader(),
	camera: camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 )
	
};
var loadingManager = null;
var RESOURCES_LOADED = false;





var mesh = {};

function init() {
  container = document.querySelector(".scene");

  //Create scene
  scene = new THREE.Scene();

  const fov = 90;
  const aspect = 1280 / 720;
  const near = 0.1;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  

  //clock 
  clock = new THREE.Clock();

  // Set up the loading screen's scene.
	// It can be treated just like our main scene.
//loadingScreen.box.position.set(0,0,5);
  loadingScreen.font_loader.load('helvetiker_regular.typeface.json', function ( font ) {

    var geometry = new THREE.TextGeometry( "Welcome to the world of sleep paralysis\n"+"Bewarned you will feel overwhelmed\n"+" and confused \n"+"Continue on your own risk \n" + "Loading..."
    
    , {
      font: font,
      size: 30,
      height: 50,
      curveSegments: 2
    } );
  var textMaterial = new THREE.MultiMaterial( [
    new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
    new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
] );
story = new THREE.Mesh(geometry,textMaterial);
  
  loadingScreen.scene.add(story);
  } );
  loadingScreen.camera.position.set( 0, 150, 500 );

	// Create a loading manager to set RESOURCES_LOADED when appropriate.
	// Pass loadingManager to all resource loaders.
	loadingManager = new THREE.LoadingManager();
	
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	
	loadingManager.onLoad = function(){
    console.log("loaded all resources");
     RESOURCES_LOADED = true;
	};
	
  

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(50, 50, 100);
  light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
  scene.add(light);
  
  //Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(1280, 720);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  camera.position.set(0, player.height, -5);
  camera.lookAt(new THREE.Vector3(0,player.height,0));


  container.appendChild(renderer.domElement);

  // var geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
  // var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
  // var floor = new THREE.Mesh( geometry, material );
  // floor.material.side = THREE.DoubleSide;
  // // floor.rotation.x = de2ra(90);
  // scene.add( floor );

  
//load 3d model
   var loader = new THREE.GLTFLoader(loadingManager);
  loader.load("./arms/scene.gltf", function(gltf) {
    arms = gltf.scene.children[0];
    arms.position.set(-8,-8,-8);
    arms.rotation.set(10,0,0);
    arms.scale.set(0.05,0.05,0.05);
    scene.add(arms);
    animate();
  });

 /* loader.load("./city/scene.gltf", function(gltf) {
    scene.add(gltf.scene);
    city = gltf.scene.children[0];
    city.position.set(-30, 20, 20);
    city.scale.set(3, 3, 3);
    animate();
  });
*/
  loader.load("./buddha/scene.gltf", function(gltf) {
    buddha = gltf.scene.children[0];
    buddha.scale.set(0.02,0.02,0.02);
    buddha.position.set(40, -3, 40);
    scene.add(buddha);
    animate();
  });


 /* loader.load("./school/scene.gltf", function(gltf) {
    school = gltf.scene.children[0];
    school.scale.set(5,5,5);
    school.position.set(60, -5, -10);
    scene.add(school);
    animate();
  });*/

 /* loader.load("./massacre/scene.gltf", function(gltf) {
    mass = gltf.scene.children[0];
    mass.scale.set(10,10,10);
    mass.position.set(-5, 0, 40);
    scene.add(mass);
    animate();
  });*/

 /* loader.load("./electric/scene.gltf", function(gltf) {
    electric = gltf.scene.children[0];
    electric.scale.set(7,7,7);
    electric.position.set(10, 0, -30);
    scene.add(electric);
    animate();
  });*/

 /* loader.load("./med/scene.gltf", function(gltf) {
    med = gltf.scene.children[0];
    med.scale.set(-500,-500,-500);
    med.position.set(10, -5, 30);
    scene.add(med);
    animate();
  });*/

  animate();


}


function animate() {


  // This block runs while resources are loading.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		story.position.x = -350;
    story.position.y = 300;
   story.position.z = 0;

    story.rotation.x = 0;
    story.rotation.y = Math.PI * 2;
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return; // Stop the function here.
  }
  


  requestAnimationFrame(animate);

  var time = Date.now() * 0.0005;
	var delta = clock.getDelta();

  if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
  }
  if(keyboard[38]){ //up arrow key
		camera.position.y += -Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
	}
	if(keyboard[40]){ //down arrow key
		camera.position.y -= -Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
	}

  arms.position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 2,
		camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.02,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 2
	);

  arms.rotation.set(
    camera.rotation.x -Math.PI,
    camera.rotation.y -Math.PI ,
    camera.rotation.z
  );

  renderer.render(scene, camera);
}

//init();


function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.addEventListener("resize", onWindowResize);
window.onload =init;