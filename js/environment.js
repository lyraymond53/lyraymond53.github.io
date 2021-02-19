var Colors = {
    black: 0x14051C,
    purple: 0x351245,
    lightPurple: 0xB373D1,
    lightBlue: 0x83CBE6
};

window.addEventListener('load', init, false);

function init() {
	// Initialize the scene, the camera and the renderer
	createScene();
	createPoint();
	createSea();

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
	camera.position.z = 200;
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
	//renderer.shadowMap.enabled = true;

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

function createPoint() {
	var pointGeometry = new THREE.SphereGeometry(2, 16, 16);
	var pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	var point3D = new THREE.Mesh(pointGeometry, pointMaterial);

	scene.add(point3D);
}

function createSea() {
	sea = new Sea();

	// push it a little bit at the bottom of the scene
	sea.mesh.position.y = -600;

	// add the mesh of the sea to the scene
	scene.add(sea.mesh);
}


Sea = function () {
	var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	// important: by merging vertices we ensure the continuity of the waves
	geom.mergeVertices();

	// get the vertices
	var l = geom.vertices.length;

	// create an array to store new data associated to each vertex
	this.waves = [];

	for (var i = 0; i < l; i++) {
		// get each vertex
		var v = geom.vertices[i];

		// store some data associated to it
		this.waves.push({
			y: v.y,
			x: v.x,
			z: v.z,
			// a random angle
			ang: Math.random() * Math.PI * 2,
			// a random distance
			amp: 5 + Math.random() * 15,
			// a random speed between 0.016 and 0.048 radians / frame
			speed: 0.016 + Math.random() * 0.032
		});
	};
	var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: .8,
		shading: THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;

}

function animate() {
	sea.mesh.rotation.z += .005;

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

