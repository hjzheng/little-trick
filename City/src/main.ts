import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TweenMax, Power1 } from 'gsap';

window.onload = () => {
  var renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias: 抗锯齿，使画面更加平滑
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerWidth > 800) {
    renderer.shadowMap.enabled = true; // 开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 阴影的软化
    // 代表 Percentage - Closer Filtering(PCF) 软阴影贴图。这种阴影贴图技术通过对阴影边缘进行模糊处理，使得阴影看起来更加柔和和自然
    renderer.shadowMap.needsUpdate = true; // 阴影的更新
    //renderer.toneMapping = THREE.ReinhardToneMapping;
    //console.log(window.innerWidth);
  };

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);

  camera.position.set(0, 10, 12);

  const controls = new OrbitControls(camera, renderer.domElement);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var scene = new THREE.Scene(); // 场景
  var city = new THREE.Object3D(); // 城市
  var smoke = new THREE.Object3D(); // 烟雾
  var town = new THREE.Object3D(); // 小镇

  var createCarPos = true;
  var uSpeed = 0.001;

  // forg background
  var setcolor = 0xF02050;
  //var setcolor = 0xF2F111;
  //var setcolor = 0xFF6347;

  scene.background = new THREE.Color(setcolor);
  scene.fog = new THREE.Fog(setcolor, 10, 16); // 雾效果 10-16 的深度
  //scene.fog = new THREE.FogExp2(setcolor, 0.05);

  function mathRandom(num = 10) {
    var numValue = - Math.random() * num + Math.random() * num;
    return numValue;
  };

  //----------------------------------------------------------------- CHANGE bluilding colors
  var setTintNum = true;
  function setTintColor() {
    if (setTintNum) {
      setTintNum = false;
      var setColor = 0x000000;
    } else {
      setTintNum = true;
      var setColor = 0x000000;
    };
    //setColor = 0x222222;
    return setColor;
  };

  function init() {
    var segments = 2;
    for (var i = 1; i < 100; i++) {
      var geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);
      var material = new THREE.MeshStandardMaterial({
        color: setTintColor(),
        wireframe: false,
        //opacity:0.9,
        //transparent:true,
        //roughness: 0.3,
        //metalness: 1,
        fog: true,
        side: THREE.DoubleSide
      });

      var wmaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide
      });

      var cube = new THREE.Mesh(geometry, material);
      var floor = new THREE.Mesh(geometry, material);
      var wfloor = new THREE.Mesh(geometry, wmaterial);

      cube.add(wfloor);
      cube.castShadow = true;
      cube.receiveShadow = true;

      // cube.rotation.y = 0.1 + Math.abs(mathRandom(8));

      floor.scale.y = 0.05;
      cube.scale.y = 0.1 + Math.abs(mathRandom());

      var cubeWidth = 0.9;
      cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
      cube.position.x = Math.round(mathRandom());
      cube.position.z = Math.round(mathRandom());

      floor.position.set(cube.position.x, 0, cube.position.z)

      town.add(floor);
      town.add(cube);
    };
    //----------------------------------------------------------------- Particular

    var gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
    var gparticular = new THREE.CircleGeometry(0.01, 3);
    var aparticular = 5;

    for (var h = 1; h < 300; h++) {
      var particular = new THREE.Mesh(gparticular, gmaterial);
      particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
      particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
      smoke.add(particular);
    };

    var pmaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 0.9,
      transparent: true
    });

    var pgeometry = new THREE.PlaneGeometry(60, 60);
    var pelement = new THREE.Mesh(pgeometry, pmaterial);
    pelement.rotation.x = -90 * Math.PI / 180;
    pelement.position.y = -0.001;
    pelement.receiveShadow = true;

    city.add(pelement);
  };

  var mouse = new THREE.Vector2();
  function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  function onDocumentTouchStart(event: TouchEvent) {
    if (event.touches.length == 1) {
      event.preventDefault();
      mouse.x = event.touches[0].pageX - window.innerWidth / 2;
      mouse.y = event.touches[0].pageY - window.innerHeight / 2;
    };
  };
  function onDocumentTouchMove(event: TouchEvent) {
    if (event.touches.length == 1) {
      event.preventDefault();
      mouse.x = event.touches[0].pageX - window.innerWidth / 2;
      mouse.y = event.touches[0].pageY - window.innerHeight / 2;
    }
  }
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('touchstart', onDocumentTouchStart, false);
  window.addEventListener('touchmove', onDocumentTouchMove, false);

  //----------------------------------------------------------------- Lights
  var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
  var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
  var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

  // var spotLightHelper = new THREE.SpotLightHelper(lightFront);
  // scene.add( spotLightHelper );

  lightFront.rotation.x = 45 * Math.PI / 180;
  lightFront.rotation.z = -45 * Math.PI / 180;
  lightFront.position.set(5, 5, 5);
  lightFront.castShadow = true;
  lightFront.shadow.mapSize.width = 6000;
  lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
  lightFront.penumbra = 0.1;
  lightBack.position.set(0, 6, 0);

  smoke.position.y = 2;

  scene.add(ambientLight);
  city.add(lightFront);
  scene.add(lightBack);
  scene.add(city);
  city.add(smoke);
  city.add(town);

  //----------------------------------------------------------------- GRID Helper
  var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
  city.add(gridHelper);

  //----------------------------------------------------------------- LINES world

  var createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) {
    var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
    var cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
    var cElem = new THREE.Mesh(cGeo, cMat);
    var cAmp = 3;

    if (createCarPos) {
      createCarPos = false;
      cElem.position.x = -cPos;
      cElem.position.z = (mathRandom(cAmp));
      TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
    } else {
      createCarPos = true;
      cElem.position.x = (mathRandom(cAmp));
      cElem.position.z = -cPos;
      cElem.rotation.y = 90 * Math.PI / 180;
      TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut });
    };
    cElem.receiveShadow = true;
    cElem.castShadow = true;
    cElem.position.y = Math.abs(mathRandom(5));
    city.add(cElem);
  };

  var generateLines = function () {
    for (var i = 0; i < 60; i++) {
      createCars(0.1, 20);
    };
  };

  //----------------------------------------------------------------- ANIMATE

  var animate = function () {
    requestAnimationFrame(animate);

    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
    city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
    if (city.rotation.x < -0.05) city.rotation.x = -0.05;
    else if (city.rotation.x > 1) city.rotation.x = 1;

    smoke.rotation.y += 0.01;
    smoke.rotation.x += 0.01;

    camera.lookAt(city.position);
    controls.update();
    renderer.render(scene, camera);
  }

  //----------------------------------------------------------------- START functions
  generateLines();
  init();
  animate();
}
