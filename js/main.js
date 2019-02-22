let scene, camera, renderer, mesh, controls;
let width, height, T;
let cameraRotX, cameraRotY, cameraPitch, cameraYaw;

let raycaster, cursor, leftClick, rightClick;
let blocks = [];

let crate, crateTexture, crateNormalMap, crateBumpMap;
let velocity;

let keys = {};
let player = {
	height: 1.8,
	speed: 0.2,
	turnSpeed: Math.PI * 0.02
};

function init() {
    T = THREE;
    height = window.innerHeight;
    width = window.innerWidth;
    scene = new T.Scene();
    camera = new T.PerspectiveCamera(60, width / height, 0.1, 1000);

    cameraPitch = new T.Object3D();
    cameraPitch.add(camera);

    cameraYaw = new T.Object3D();
    cameraYaw.position.set(0, player.height, -5);
    cameraYaw.add(cameraPitch);
    camera.lookAt(new T.Vector3(0, player.height, 0));
    scene.add(cameraYaw);

    cursor = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

    velocity = new T.Vector3();  

    ambientLight = new T.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    light = new T.PointLight(0xffffff, 1, 20);
    light.position.set(-4, 15, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
    
    for (let i = -5; i < 5; i++) {
        for (let j = -5; j < 5; j++) {
            let block = new Block(i, -0.5, j, "dirt");
            scene.add(block.mesh);
            blocks.push(block.mesh);
        }
    }

    renderer = new T.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.BasicsShadowMap;
    document.body.appendChild(renderer.domElement);

    document.addEventListener('pointerlockchange', lockChange, false);
    renderer.domElement.addEventListener("click", canvasFocus, false);

    animate();
}

function animate() {
	requestAnimationFrame(animate);

    height = window.innerHeight;
    width = window.innerWidth;

    if (keys[87]) {
        velocity.z += 0.02;
    }
    if (keys[83]) {
        velocity.z -= 0.02;
    }
    if (keys[65]) {
        velocity.x += 0.02;
    }
    if (keys[68]) {
        velocity.x -= 0.02;
    }
    if (keys[32]) {
        velocity.y += 0.02;
    }
    if (keys[16]) {
        velocity.y -= 0.02;
    }
    
    cameraYaw.translateX(velocity.x);
    cameraYaw.translateY(velocity.y);
    cameraYaw.translateZ(velocity.z);

    velocity.multiply(new T.Vector3(0.8, 0.8, 0.8));

    findBlock();

	renderer.render(scene, camera);
    rightClick = false;
    leftClick = false;
}

function findBlock() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].children = [];
    }
    raycaster.setFromCamera(cursor, camera);
    let intersects = raycaster.intersectObjects(blocks);

    if (intersects.length > 0) {
        if (intersects[0].distance <= 5.5) {
            let outline = new T.Mesh(
                new T.BoxGeometry(1, 1, 1),
                new T.MeshBasicMaterial({
                    color:0xffffff,
                    wireframe: true
                })
            );
            intersects[0].object.add(outline);
            if (leftClick) {
                scene.children.splice(scene.children.indexOf(intersects[0].object), 1);
                blocks.splice(blocks.indexOf(intersects[0].object), 1);
            } else 
            if (rightClick) {
                if (intersects[0].faceIndex === 5 || intersects[0].faceIndex === 4) {
                    let block = new Block(intersects[0].object.position.x, intersects[0].object.position.y + 1, intersects[0].object.position.z, "dirt");
                    scene.add(block.mesh);
                    blocks.push(block.mesh);
                } else
                if (intersects[0].faceIndex === 11 || intersects[0].faceIndex === 10) {
                    let block = new Block(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z - 1, "dirt");
                    scene.add(block.mesh);
                    blocks.push(block.mesh);
                } else
                if (intersects[0].faceIndex === 3 || intersects[0].faceIndex === 2) {
                    let block = new Block(intersects[0].object.position.x - 1, intersects[0].object.position.y, intersects[0].object.position.z, "dirt");
                    scene.add(block.mesh);
                    blocks.push(block.mesh);
                } else
                if (intersects[0].faceIndex === 0 || intersects[0].faceIndex === 1) {
                    let block = new Block(intersects[0].object.position.x + 1, intersects[0].object.position.y, intersects[0].object.position.z, "dirt");
                    scene.add(block.mesh);
                    blocks.push(block.mesh);
                } else
                if (intersects[0].faceIndex === 6 || intersects[0].faceIndex === 7) {
                    let block = new Block(intersects[0].object.position.x, intersects[0].object.position.y - 1, intersects[0].object.position.z, "dirt");
                    scene.add(block.mesh);
                    blocks.push(block.mesh);
                } else
                if (intersects[0].faceIndex === 8 || intersects[0].faceIndex === 9) {
                    let block = new Block(intersects[0].object.position.x, intersects[0].object.position.y - 1, intersects[0].object.position.z, "dirt");
                    scene.add(block.mesh);
                    blocks.push(block.mesh);
                }
            }
        }
    }
}

function lockChange(e) {
    if (document.pointerLockElement === renderer.domElement || document.mozPointerLockElement === renderer.domElement) {
        renderer.domElement.addEventListener("mousemove", mouseMove, false);
        renderer.domElement.removeEventListener("click", canvasFocus, false);
        renderer.domElement.addEventListener("click", canvasClick, false);
    } else {
        renderer.domElement.removeEventListener("mousemove", mouseMove, false);
        renderer.domElement.removeEventListener("click", canvasClick, false);
        renderer.domElement.addEventListener("click", canvasFocus, false);
    }
}

function canvasFocus(e) {
    renderer.domElement.requestPointerLock();
}

function canvasClick(e) {
    if (e.button === 0) {
        renderer.domElement.requestPointerLock();
        leftClick = true;
    } else if (e.button === 2) {
        rightClick = true;
    }
}

function mouseMove(e) {
    cameraYaw.rotation.y -= e.movementX * 0.002;
    cameraPitch.rotation.x += e.movementY * 0.002;
}

function keyDown(e) {
	keys[e.keyCode] = true;
}

function keyUp(e) {
	keys[e.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;
