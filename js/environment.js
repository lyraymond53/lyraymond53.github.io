var Colors = {
    black: 0x14051C,
    purple: 0x351245,
    lightPurple: 0xB373D1,
	lightBlue: 0x68c3c0
};

window.addEventListener('load', init, false);

function init() {
	// Initialize the scene, the camera and the renderer
	createScene();

	createPlane();
	createLights();

	animate();
}

var scene,
	camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
	renderer, container;

function createScene() {
	// Screen dimensions
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	// Create the scene
	scene = new THREE.Scene();

	// Add a fog effect to the scene; same color as the
	// background color used in the style sheet
	//scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 1000;
	camera.position.y = 0;

	// Create the renderer
	renderer = new THREE.WebGLRenderer({
		// Allow transparency to show the gradient background defined in the CSS
		alpha: true,

		// Activate the anti-aliasing; this is less performant, but, as our project is low-poly based, it should be fine
		antialias: true
	});

	// Define the size of the renderer to be full screen
	renderer.setSize(WIDTH, HEIGHT);

	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the container we created in the HTML
	container = document.getElementById('space');
	container.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

function createPlane() {
	plane = new Plane();
	scene.add(plane.mesh);
}

Plane = function () {
	var PlaneGeom = new THREE.PlaneGeometry(1200, 800, 10, 10);

	// Keep the mesh continuous	
	PlaneGeom.mergeVertices();

	// Get number of vertices
	var vertices = PlaneGeom.vertices.length;

	// Make an array to store new vertex data
	this.waves = [];

	// Iterate through and modify each vertex
	for (var i = 0; i < vertices; i++) {
		var v = PlaneGeom.vertices[i];

		this.waves.push({
			y: v.y,
			x: v.x,
			z: v.z,
			// a random angle
			ang: Math.random() * Math.PI * 2,
			// a random distance
			amp: 5 + Math.random() * 15,
			// a random speed between 0.016 and 0.048 radians / frame
			speed: 0.016 + Math.random()/2 * 0.032
		});
	};

	// Skew the plane
	PlaneGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 9));
	//PlaneGeom.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 6));
	//PlaneGeom.applyMatrix(new THREE.Matrix4().makeRotationZ());

	var PlaneMat = new THREE.MeshPhongMaterial({
		color: Colors.lightBlue,
		transparent: true,
		opacity: 1,
		shading: THREE.FlatShading
	});

	this.mesh = new THREE.Mesh(PlaneGeom, PlaneMat);
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;

}

Plane.prototype.planeWave = function () {
	var vertices = this.mesh.geometry.vertices;
	var numVertices = vertices.length;

	for (var i = 0; i < numVertices; i++) {
		var v = vertices[i];
		var planeV = this.waves[i];

		// update the position of the vertex
		v.x = planeV.x + Math.cos(-planeV.ang) * planeV.amp;
		v.y = planeV.y + Math.sin(-planeV.ang) * planeV.amp;

		// increment the angle for the next frame
		planeV.ang += planeV.speed;
	}
	this.mesh.geometry.verticesNeedUpdate = true;
}

var hemiLight, directionLight;

function createLights() {


	directionLight = new THREE.DirectionalLight(0xffffff, 1);
	//hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .9);

	directionLight.position.set(50, 120, 150);

	directionLight.castShadow = true;

	// Shadow projection boundaries
	directionLight.shadow.camera.left = -400;
	directionLight.shadow.camera.right = 400;
	directionLight.shadow.camera.top = 400;
	directionLight.shadow.camera.bottom = -400;


	directionLight.shadow.camera.near = 1;
	directionLight.shadow.camera.far = 1000;

	// Shadow resolution
	directionLight.shadow.mapSize.width = 2048;
	directionLight.shadow.mapSize.height = 2048;

	scene.add(directionLight);
	//scene.add(hemiLight);
}




function animate() {
	plane.planeWave();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

