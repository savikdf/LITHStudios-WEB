
var container, stats, controls, lineUI, gui;
var camera, scene, Backgroundscene, renderer, clock;
var lightpos, dirLight, angle;
var sphere;

var numberofPoints = 52;

var composer;
var mParticlePass;
var points = [];
var pointRads = [];

var oscValuesX = [];
var oscValuesY = [];

// Custom global variables
var mouse = { x: 0, y: 0 };

var timer = 0;
var timeLimit = .25;
var startTime = Date.now();

var WondererMaterials;
var postprocessing = { enabled: true, ao_only: false, radius: 2.4, lumChange: 2.1 };
var modelList = [];
var index = 0;

init();
animate();

function oscilation(a, b)
{
    this.a = a;
    this.b = b;
}

function particle(size, position)
{
    this.size = size;
    this.position = position;
}

//Yummy Yum Yum
function textParse(glsl, shadow_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    return text;
}

function init() {

    resolution = 1;// (window.devicePixelRatio == 1) ? 3 : 4;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    container = document.getElementById('webGL-container');

    var containerStyle = getComputedStyle(container, null);
    var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
        SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0x00BFFF);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowMapSize = 32;
    renderer.shadowMap.renderReverseSided = false;
    renderer.shadowMap.renderSingleSided = false;
    container.appendChild(renderer.domElement);

    // Create camera.
    camera = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
    camera.position.z = 25;
    camera.position.y = 2;
    clock = new THREE.Clock();


    //controls.addEventListener("change", render);
    var gridHelper = new THREE.GridHelper(1000, 20);
    //scene.add(gridHelper);

    var axisHelper = new THREE.AxisHelper(5);
    //scene.add(axisHelper)

    document.addEventListener('mousemove', onMouseMove, false);

    window.addEventListener("resize", onWindowResize, false);

    for(var i = 0; i < numberofPoints; i++)
    {
        pointRads[i] = randomRange(0.01, 0.1);
        points[i] = new THREE.Vector2(randomRange(-0.9 + pointRads[i], -0.2 - pointRads[i]), randomRange(-1.0, 1.0));
        oscValuesX[i] = new oscilation(randomRange(3, 6), randomRange(0.001, 0.001));
        oscValuesY[i] = new oscilation(randomRange(0.01, 1), randomRange(0.01, 0.1));
    }

    camera.updateProjectionMatrix();


    initPostProcessing() ;
}

function radiusChange(value) {
    ssaoPass.uniforms["radius"].value = value;
}

function applyInvertGravity(point , oscValY, time)
{
    point.y += oscValY.b * time;
    point.x += (oscValY.a / 2.0) * time/2.0;
}

function addWobble(point, oscValX,  time)
{
    point.x += Math.sin(time * oscValX.a) * oscValX.b;
}
// -.55, -0.7

function pointBoundry(point, rads)
{
    if(point.y > 2.0 + rads)
    {
        point.x = -1.0;
        point.y = -1.0;
    }
    else if(point.y < -1.5 - rads)
    {
        point.x = -1.0;
        point.y = -1.0;
    }
    else if(point.x > 2.0 + rads)
    {
        point.x = -1.0;
        point.y = -1.0;
    }
    else if(point.x < -2.0 - rads)
    {
        point.x = -1.0;
        point.y = -1.0;
    }
}

function initPostProcessing() {
    var containerStyle = getComputedStyle(container, null);
    var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
        SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

    //Setup Render Pass
    var renderPass = new THREE.RenderPass(scene, camera);

    // Setup SSAO pass
    mParticlePass = new THREE.ShaderPass(metaBalls);
    mParticlePass.renderToScreen = true;
    mParticlePass.uniforms["points"].value = 
    points;

    //Add pass to effect composer
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(mParticlePass);
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        index++;
    } else if (keyCode == 83) {
        index--;
    } else if (keyCode == 65) {
        index++;
    } else if (keyCode == 68) {
        index--;
    } else if (keyCode == 32) {

    }
};

function onWindowResize() {

    //screenWidth  = window.innerWidth;
    //screenHeight = window.innerHeight;

    var containerStyle = getComputedStyle(container, null);
    var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
        SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);

    var pixelRatio = renderer.getPixelRatio();
    var newWidth = Math.floor(SCREEN_WIDTH / pixelRatio) || 1;
    var newHeight = Math.floor(SCREEN_HEIGHT / pixelRatio) || 1;

    composer.setSize(newWidth, newHeight);
}


function animate() {
    var delta = clock.getDelta();
    timer = timer + delta;

    angle += 0.005;

    mParticlePass.uniforms["_Time"].value = timer; 


    for(var i = 0; i < points.length; i++)
    {
        if(i != 0)
        {
            addWobble(points[i], oscValuesX[i], timer);
            applyInvertGravity(points[i],  oscValuesY[i],  delta);
            pointBoundry(points[i], pointRads[i]);
        }
    }

    //Big Papa
    points[0] = new THREE.Vector2(-.55, -0.7);
    pointRads[0] = 0.5;

    mParticlePass.uniforms["points"].value = points;
    mParticlePass.uniforms["rads"].value = pointRads;
    requestAnimationFrame(animate);

    HandleCursor();
    input();
    render();
}


function showMesh(index) {
    modelList[index].traverse(function (child) {
        child.visible = true;
    });
}

function hideMesh(index) {
    modelList[index].traverse(function (child) {
        child.visible = false;
    });
}

function HandleCursor() {
}

function input() {
}

function render() {


    if (postprocessing.enabled) {

         //Render depth into depthRenderTarget
         renderer.render(scene, camera);

         //Render renderPass and SSAO shaderPass
         scene.overrideMaterial = null;
         composer.render();
    }
    else {
        renderer.render(scene, camera);
        
    }

}

// Follows the mouse event
function onMouseMove(event) {
    // Update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = Math.round((mouse.x + 1) * window.innerWidth / 2);
    mouse.y = Math.round((- mouse.y + 1) * window.innerHeight / 2);
}

function ShaderLoader(vertex_url, fragment_url, onLoad, Custom, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            var shadow_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
            shadow_loader.setResponseType('text');
            shadow_loader.load("./js/Shaders/Shadow.glsl", function (shadow_text) {
                onLoad(Custom, textParse(vertex_text, shadow_text), textParse(fragment_text, shadow_text));
            }

            )
        });
    }, onProgress, onError);
}


//   var dither_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
//   dither_loader.setResponseType('text');
//   dither_loader.load("js/Shaders/Dither.glsl", function (dither_text) 