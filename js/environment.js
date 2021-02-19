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
	makePoint();
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
	camera.position.y = 100;

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

function makePoint() {
	var dotGeometry = new THREE.Geometry();
	dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
	var dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
	var dot = new THREE.Points(dotGeometry, dotMaterial);
	scene.add(dot);
}



function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

