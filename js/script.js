
window.onload = function () {
	const container = document.body;
	const tooltip = document.querySelector('.tooltip');
	const settingAuto = document.querySelector('.settingAuto');

	let tooltipActive = false; 
	let spriteActive = false;

	var width = window.innerWidth;
	var height = window.innerHeight; 
	var canvas = document.getElementById('canvas');

	canvas.setAttribute('width', width);
	canvas.setAttribute('height',height);
///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//	Константы для комфортной работы
	const soFar = {
		x: 1000,
		y:0,
		z:0,
	}
	const fov = 75 // Угол обзора 
	const near = 0.1 // Ближайший по отрисовке пиксель (меньше 0.1 не отрисовывать)
	const far = 5000 // Максимальный на отрисовку пиксель
	const proportion = window.innerWidth/window.innerHeight; // Чтобы сохранялась правильная пропорция 

	const loader = new THREE.TextureLoader(); // Загрузчик текстур 

	const black = 0x000000;
	const white = 0xffffff;
	const green = 0x00ff00;
/////////////////////////////////////////////////////////////////////
	var renderer = new THREE.WebGLRenderer({canvas: canvas});
	//renderer.setClearColor(white); // Устанавливаем темный фон 
	document.body.appendChild( renderer.domElement );

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(fov, proportion, near, far);

	var controls = new THREE.OrbitControls(camera,renderer.domElement);  // Для движения камеры
	controls.rotateSpeed = -0.4; 
	controls.autoRotate = true;
	controls.enableZoom = false;
	controls.enableDamping = true; 
	controls.dampingFactor = 0.05;
	controls.update();
	console.log(controls);

/////////////////////////////////////////////////////////////////////
//	Менеджер загрузок 
	manager = new THREE.LoadingManager();
	manager.onProgress = function () {
  	  	console.log(`Progress loading...`);
	};
	manager.onLoad = function () {
   		console.log('loaded');
	};
	manager.onError = function () {
    	console.log('there has been an error');
	};

	const color = white;
  	const intensity = 1;
  	const light = new THREE.DirectionalLight(color, intensity);
  	light.position.set(-1, 2, 4);
  	scene.add(light);
////////////////////////////////////////////////////////////////////
//	Аудио-сопровождение

	var listener = new THREE.AudioListener();
	camera.add( listener );
	var soundCat = new THREE.Audio( listener );
	var audioLoader = new THREE.AudioLoader();

////////////////////////////////////////////////////////////////////
//	Класс создания новой сцены 
	class Scene {
		constructor (image,points) {
			this.image = image;
			this.points = points;
			this.sprites = [];
		}
		createScene (scene) {
			this.scene = scene;
			let textureURL = this.image;
			var textureBackground = new THREE.TextureLoader(manager).load(textureURL);
			textureBackground.wrapS = THREE.RepeatWrapping;
			textureBackground.repeat.x = -1;  
			const geometryScene = new THREE.SphereGeometry(500,40,40);
			this.materialScene = new THREE.MeshBasicMaterial({map: textureBackground, side: THREE.DoubleSide});
			this.ownScene = new THREE.Mesh(geometryScene,this.materialScene);
			this.ownScene.position.set(0,0,0);
			this.scene.add(this.ownScene);
			controls.rotateSpeed = -0.4; 
			camera.fov = 75; 
			camera.zoom = 1;
			camera.updateProjectionMatrix();
		}
	}
////////////////////////////////////////////////////////////////////
//  Создание спрайтов 
	function addTooltip(position) {
		let spriteTexture = new THREE.TextureLoader().load( "img/sprite_yellow.png" );
		let spriteMat = new THREE.SpriteMaterial( { map: spriteTexture } );
		let sprite = new THREE.Sprite( spriteMat );
		scene.add( sprite );
		sprite.position.copy(position.clone().normalize().multiplyScalar(30)); 
	} 

//  Создание статичной сферы с текстурой фотографии комнаты 360 градусов
	let s = new Scene('img/room.jpg',[]);
	s.createScene(scene);
	let currentScene = 'img/room.jpg';
////////////////////////////////////////////////////////////////////
//	Справочные спрайты 
/*
	var spriteMapExit = new THREE.TextureLoader().load( "img/sprite_yellow.png" );
	var spriteMaterialExit = new THREE.SpriteMaterial( { map: spriteMapExit } );
	var spriteExit = new THREE.Sprite( spriteMaterialExit );
	spriteExit.name = 'SpriteExit';
	scene.add( spriteExit );
	spriteExit.position.set(5.4,0,10);*/
/////////////////////////////////////////////////////////////

//  СПРАЙТЫ ДЛЯ РАСКОПОК!!! 
	var spriteMapVector = new THREE.TextureLoader().load( "img/vector.png" );
	var spriteMaterialVector = new THREE.SpriteMaterial( { map: spriteMapVector } );
	let spriteVector2 = new THREE.Sprite( spriteMaterialVector );
	spriteVector2.name = 'SpriteVector2';
	scene.add(spriteVector2 );
	spriteVector2.position.set(1000,0,0);

	let spriteVector4 = new THREE.Sprite( spriteMaterialVector );
	spriteVector4.name = 'SpriteVector4';
	scene.add(spriteVector4 );
	spriteVector4.position.set(1000,0,0);

	let spriteVector7 = new THREE.Sprite( spriteMaterialVector );
	spriteVector7.name = 'SpriteVector7';
	scene.add(spriteVector7 );
	spriteVector7.position.set(1000,0,0);

	let spriteVector8 = new THREE.Sprite( spriteMaterialVector );
	spriteVector8.name = 'SpriteVector8';
	scene.add(spriteVector8 );	
	spriteVector8.position.set(1000,0,0);

	let spriteVector9 = new THREE.Sprite( spriteMaterialVector );
	spriteVector9.name = 'SpriteVector9';
	scene.add(spriteVector9 );	
	spriteVector9.position.set(1000,0,0);

	var spriteMapHome = new THREE.TextureLoader().load( "img/home.png" );
	var spriteMaterialHome = new THREE.SpriteMaterial( { map: spriteMapHome } );
	let spriteHome = new THREE.Sprite( spriteMaterialHome );
	scene.add(spriteHome );
	spriteHome.name = 'SpriteHome';

	let spritesPoints = [spriteVector2,spriteVector4,spriteVector7,spriteVector8,spriteVector9,spriteHome];
	spritesPoints.forEach(spriteAlert => spriteAlert.alert='POINT');
	spriteHome.position.set(1000,0,0);


//////////////////////////////////////////////////////////////
//	Cпрайты "Посмотреть" 
	var spriteMapLupa = new THREE.TextureLoader().load( "img/lupa.png" );
	var spriteMaterialLupa = new THREE.SpriteMaterial( { map: spriteMapLupa } );
	let spriteLupa1 = new THREE.Sprite( spriteMaterialLupa );
	spriteLupa1.name = 'SpriteLupa1';
	spriteLupa1.nameOut = 'Посмотреть';
	scene.add(spriteLupa1 );
	spriteLupa1.position.set(10,-2.2,-0.5);

	let spriteLupa2 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa2.name = 'SpriteLupa2';
	spriteLupa2.nameOut = 'Посмотреть';
	scene.add(spriteLupa2);
	spriteLupa2.position.set(10,-2.4,-3.3);

	let spriteLupa3 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa3.name = 'SpriteLupa3';
	spriteLupa3.nameOut = 'Посмотреть';
	scene.add(spriteLupa3);
	spriteLupa3.position.set(7,-2.6,-8);

	let spriteLupa4 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa4.name = 'SpriteLupa4';
	spriteLupa4.nameOut = 'Посмотреть';
	scene.add(spriteLupa4);
	spriteLupa4.position.set(4.2,-2,-9);

	let spriteLupa5 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa5.name = 'SpriteLupa5';
	spriteLupa5.nameOut = 'Посмотреть';
	scene.add(spriteLupa5);
	spriteLupa5.position.set(-2.5,-3.5,-9);

	let spriteLupa6 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa6.name = 'SpriteLupa6';
	spriteLupa6.nameOut = 'Посмотреть';
	scene.add(spriteLupa6);
	spriteLupa6.position.set(-9,-3.5,-4.1);

	let spriteLupa7 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa7.name = 'SpriteLupa7';
	spriteLupa7.nameOut = 'Посмотреть';
	scene.add(spriteLupa7);
	spriteLupa7.position.set(-9,-3.5,-2.1);

	let spriteLupa8 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa8.name = 'SpriteLupa8';
	spriteLupa8.nameOut = 'Посмотреть';
	scene.add(spriteLupa8);
	spriteLupa8.position.set(-9,-3.9,0.2);

	let spriteLupa9 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa9.name = 'SpriteLupa9';
	spriteLupa9.nameOut = 'Посмотреть';
	scene.add(spriteLupa9);
	spriteLupa9.position.set(-9,-4.2,2.8);

	let spriteLupa10 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa10.name = 'SpriteLupa10';
	spriteLupa10.nameOut = 'Посмотреть';
	scene.add(spriteLupa10);
	spriteLupa10.position.set(-9,-4.5,5.8);

	let spriteLupa11 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa11.name = 'SpriteLupa11';
	spriteLupa11.nameOut = 'Посмотреть';
	scene.add(spriteLupa11);
	spriteLupa11.position.set(-8,-5,9);

	let spriteLupa12 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa12.name = 'SpriteLupa12';
	spriteLupa12.nameOut = 'Посмотреть';
	scene.add(spriteLupa12);
	spriteLupa12.position.set(-2.5,-4,6);

	let spriteLupa13 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa13.name = 'SpriteLupa13';
	spriteLupa13.nameOut = 'Посмотреть';
	scene.add(spriteLupa13);
	spriteLupa13.position.set(2,-3,-11);

	let spriteLupa14 = new THREE.Sprite(spriteMaterialLupa);
	spriteLupa14.name = 'SpriteLupa13';
	spriteLupa14.nameOut = 'Посмотреть';
	scene.add(spriteLupa14);
	spriteLupa14.position.set(-9,-3,-9);

	let spritesInfo = [];
	spritesInfo.push(spriteLupa1);
	spritesInfo.push(spriteLupa2);	
	spritesInfo.push(spriteLupa3);	
	spritesInfo.push(spriteLupa4);
	spritesInfo.push(spriteLupa5);
	spritesInfo.push(spriteLupa6);
	spritesInfo.push(spriteLupa7);
	spritesInfo.push(spriteLupa8);
	spritesInfo.push(spriteLupa9);
	spritesInfo.push(spriteLupa10);
	spritesInfo.push(spriteLupa11);
	spritesInfo.push(spriteLupa12);
	spritesInfo.push(spriteLupa13);
	spritesInfo.push(spriteLupa14);

	previosPositionInfo = [];

	for(let i=0; i<spritesInfo.length;i++){
		previosPositionInfo[i] = Object.assign({},spritesInfo[i].position);
	}
/*
	console.log(spritesInfo);
	console.log(previosPositionInfo);*/
///////////////////////////////////////////////////////////////////
//	Добавление модальных окон 	
	var modal1 = document.getElementById("my_modal1");
	var modal2 = document.getElementById("my_modal2");
	var modal3 = document.getElementById("my_modal3");
	var modal4 = document.getElementById("my_modal4");
	var modal5 = document.getElementById("my_modal5");
	var modal6 = document.getElementById("my_modal6");
	var modal7 = document.getElementById("my_modal7");
	var modal8 = document.getElementById("my_modal8");
	var modal9 = document.getElementById("my_modal9");
	var modal10 = document.getElementById("my_modal10");
	var modal11 = document.getElementById("my_modal11");
	var modal12 = document.getElementById("my_modal12");
	var modal13 = document.getElementById("my_modal13");
	var modal13 = document.getElementById("my_modal14");
 	var p = document.getElementsByClassName("thumb");


	var button360 = document.getElementById("Button360");
 //	var span = document.getElementsByClassName("close_modal_window")[0];

 	var span1 = document.getElementById("span1");
	var span2 = document.getElementById("span2");
	var span3 = document.getElementById("span3");
	var span4 = document.getElementById("span4");
	var span5 = document.getElementById("span5");
	var span6 = document.getElementById("span6");
	var span7 = document.getElementById("span7");
	var span8 = document.getElementById("span8");
	var span9 = document.getElementById("span9");
	var span10 = document.getElementById("span10");
	var span11 = document.getElementById("span11");
	var span12 = document.getElementById("span12");
	var span13 = document.getElementById("span13");
	var span13 = document.getElementById("span14");

//	Спрайт отправки из комнаты 
	var spriteMapTeleport = new THREE.TextureLoader().load( "img/teleport_from_room.png" );
	var spriteMaterialTeleport = new THREE.SpriteMaterial( { map: spriteMapTeleport } );
	let spriteTeleport = new THREE.Sprite( spriteMaterialTeleport );
	spriteTeleport.name = 'SpriteTeleport';
	spriteTeleport.nameOut = 'Отправиться на раскопки';
	scene.add(spriteTeleport );
	spriteTeleport.position.set(5.4,0,10);

//	Спрайт параметра автопрокрутки 
	var spriteSettingsTexture = new THREE.TextureLoader().load( "img/settings.png" );
	var spriteMaterialSettings = new THREE.SpriteMaterial( { map: spriteSettingsTexture } );
	var spriteSettings= new THREE.Sprite( spriteMaterialSettings );
	spriteSettings.name = 'spriteSettings';
	spriteSettings.nameOut = 'Включить автопрокрутку';
//	spriteSettings.position.set(11.5,0,-4);
	scene.add( spriteSettings);

// Спрайт текущей позиции
	var spriteMapCurrent = new THREE.TextureLoader().load( "img/current_sprite.png" );
	var spriteMaterialCurrent = new THREE.SpriteMaterial( { map: spriteMapCurrent } );
	let spriteCurrent = new THREE.Sprite( spriteMaterialCurrent );
	scene.add(spriteCurrent );
	spriteCurrent.type = 'none';
	spriteCurrent.position.set(0,-2,0);


////////////////////////////////////////////////////////////////////

/*	let simpleBoxGeo = new THREE.BoxGeometry(30,30,30); 
	let simpleBoxMat = new THREE.MeshBasicMaterial({map: textureBox});
	let simpleBox = new THREE.Mesh(simpleBoxGeo,simpleBoxMat);
	simpleBox.position.set(0,0,-50);
*/
////////////////////////////////////////////////////////////////////
// //	Вспомогательные координаты
	var axesHelper = new THREE.AxesHelper( 150 );
// 	scene.add( axesHelper );
	const rayCaster = new THREE.Raycaster();

	camera.position.set(0,0,0.1);
	spriteSettings.position.set(1000,5,5);
	
///////////////////////////////////////////////////////////////////
	controls.update();

	function loop(){

			controls.update();
			renderer.render(scene,camera);
		    requestAnimationFrame(() => loop());
	}

	loop();
	function stopAutoRotate () {
			controls.autoRotate = false;
			TweenLite.to(button360,2,{scale: 1, opacity:1});
	}
	window.addEventListener('mousedown', stopAutoRotate);

	function timetoTween () {
		TweenMax.to(s.material, 1, {
					opacity: 0,
				})
		s.materialScene.transparent = true;
	}
//////////////////////////////////////////////////////////////////////////////


	function onClick(e){
		let mouse = new THREE.Vector2(
			(e.clientX/window.innerWidth) * 2 - 1,
			- (e.clientY/window.innerHeight) *2 + 1,
			)
		rayCaster.setFromCamera(mouse, camera);
		let p;
		let intersects = rayCaster.intersectObjects(scene.children);
		intersects.forEach(function (intersect) {
			switch (intersect.object.name) {
				case 'SpriteLupa1': 
					TweenMax.from(modal1, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal1.style.display = "block";
					span1.onclick = function () {
   						modal1.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa2': 
					TweenMax.from(modal2, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal2.style.display = "block";
					span2.onmousedown = function () {
   						modal2.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa3': 
					TweenMax.from(modal3, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal3.style.display = "block";
					span3.onmousedown = function () {
   						modal3.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa4': 
					TweenMax.from(modal4, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal4.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span4.onmousedown = function () {
   						modal4.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa5': 
					TweenMax.from(modal5, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal5.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span5.onmousedown = function () {
   						modal5.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa6': 
					TweenMax.from(modal6, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal6.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span6.onmousedown = function () {
   						modal6.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa7': 
					TweenMax.from(modal7, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal7.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span7.onmousedown = function () {
   						modal7.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa8': 
					TweenMax.from(modal8, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal8.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span8.onmousedown = function () {
   						modal8.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa9': 
					TweenMax.from(modal9, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal9.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span9.onmousedown = function () {
   						modal9.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa10': 
					TweenMax.from(modal10, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal10.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span10.onmousedown = function () {
   						modal10.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa11': 
					TweenMax.from(modal11, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal11.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span11.onmousedown = function () {
   						modal11.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa12': 
					TweenMax.from(modal12, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal12.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span12.onmousedown = function () {
   						modal12.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa13': 
					TweenMax.from(modal13, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal13.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span13.onmousedown = function () {
   						modal13.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteLupa14': 
					TweenMax.from(modal14, 1, {opacity: 0, bottom:"300px"
					})
					controls.rotateSpeed = 0;
  	  				modal14.style.display = "block";
  	  				audioLoader.load( 'audio/audio.mp3', function( buffer ) {
  	  					soundCat.setBuffer( buffer );
  	  					soundCat.setLoop( true );
  	  					soundCat.setVolume( 0.5 );
  	  					soundCat.play();
  	  				});
					span14.onmousedown = function () {
   						modal14.style.display = "none";
   						controls.rotateSpeed = -0.4;
 					}
					break;
				case 'SpriteVector7':
				case 'SpriteTeleport':
					spritesInfo.forEach(item => {
						item.position.set(1000,0,0);
					}) 
					TweenMax.to(intersect.object.scale, 0.5, {
					x: 0,
					y: 0, 
					z: 0,
					})
				//timetoTween();
					p = intersect.object.position.clone().project(camera);
					tooltip.style.top = 0;
					tooltip.style.left = 0;
					s = new Scene('img/excavations/7.png',[]);
					s.createScene(scene);

					spriteTeleport.position.set(1000,0,0);
					spriteVector7.position.set(1000,0,0);

					spriteHome.position.set(-0.5,1,-10);
					spriteVector8.position.set(2,0,5);				
					spriteVector9.position.set(7,0,-5);			
					spriteVector2.position.set(-7,0,-5);				
					spriteVector4.position.set(-10,0,3);
					controls.autoRotate = true;
					break; 	
				case 'SpriteVector8': 
					TweenMax.to(intersect.object.scale, 0.5, {
					x: 0,
					y: 0, 
					z: 0,
					})
				//timetoTween();
					p = intersect.object.position.clone().project(camera);
					tooltip.style.top = 0;
					tooltip.style.left = 0;
					s = new Scene('img/excavations/8.png',[]);
					s.createScene(scene);

					spriteVector8.position.set(soFar);


					spriteHome.position.set(8,0,-3);
					spriteVector9.position.set(7,0,2);				
					spriteVector7.position.set(3,0,-2);	
					spriteVector2.position.set(6,0,-6);					
					spriteVector4.position.set(1,0,-6);
					controls.autoRotate = true;
					break; 	
				case 'SpriteVector2': 
					TweenMax.to(intersect.object.scale, 0.5, {
					x: 0,
					y: 0, 
					z: 0,
					})
				//timetoTween();
					p = intersect.object.position.clone().project(camera);
					tooltip.style.top = 0;
					tooltip.style.left = 0;
					s = new Scene('img/excavations/2.png',[]);
					s.createScene(scene);

					spriteVector2.position.set(soFar);
					spriteHome.position.set(5,1,-1);
					spriteVector8.position.set(5,0,8);				
					spriteVector9.position.set(8,0,2);	
					spriteVector7.position.set(4,0,4);					
					spriteVector4.position.set(0,0,6);
					controls.autoRotate = true;
					break; 	
				case 'SpriteVector4': 
					TweenMax.to(intersect.object.scale, 0.5, {
					x: 0,
					y: 0, 
					z: 0,
					})
				//timetoTween();
					p = intersect.object.position.clone().project(camera);
					tooltip.style.top = 0;
					tooltip.style.left = 0;
					s = new Scene('img/excavations/4.png',[]);
					s.createScene(scene);
					spriteVector4.position.set(soFar);


					spriteHome.position.set(5,0,-5);
					spriteVector2.position.set(2,-1,-7);				
					spriteVector7.position.set(5,-1,0);	
					spriteVector9.position.set(9,-1,-3);					
					spriteVector8.position.set(7,-1,4);
					controls.autoRotate = true;
					break; 
				case 'SpriteVector9': 
					TweenMax.to(intersect.object.scale, 0.5, {
						x: 0,
						y: 0, 
						z: 0,
					})
					p = intersect.object.position.clone().project(camera);
					tooltip.style.top = 0;
					tooltip.style.left = 0;
					s = new Scene('img/excavations/9.png',[]);
					s.createScene(scene);

					spriteVector9.position.set(soFar);


					spriteHome.position.set(7.5,0,-5);
					spriteVector2.position.set(5,0,-6);				
					spriteVector4.position.set(1,0,-7);	
					spriteVector7.position.set(-0.5,0,-3);					
					spriteVector8.position.set(-3,0,-4);
					controls.autoRotate = true;
					break; 
				case 'SpriteHome': 
					for(let i=0; i<spritesInfo.length; i++){
						spritesInfo[i].position.x = previosPositionInfo[i].x;
						spritesInfo[i].position.y = previosPositionInfo[i].y;
						spritesInfo[i].position.z = previosPositionInfo[i].z;
					}
					TweenMax.to(intersect.object.scale, 0.5, {
					x: 0,
					y: 0, 
					z: 0,
					})
					p = intersect.object.position.clone().project(camera);
					tooltip.style.top = 0;
					tooltip.style.left = 0;
					s = new Scene('img/room.jpg',[]);
					s.createScene(scene);
					spriteTeleport.position.set(5.4,0,10);
					spriteHome.position.set(soFar);	

					spriteVector2.position.set(soFar);
					spriteVector4.position.set(soFar);
					spriteVector7.position.set(soFar);
					spriteVector8.position.set(soFar);		
					spriteVector9.position.set(soFar);
					controls.autoRotate = true;
					break; 
			}
			if (intersect.object.name === 'spriteSettings'){
				if (controls.autoRotate === true) {
					controls.autoRotate = false; 
				} else {
					controls.autoRotate = true;
				}
			}

		});
	} 

	function onMouseMove(e){
		let mouse = new THREE.Vector2(
			(e.clientX/window.innerWidth) * 2 - 1,
			- (e.clientY/window.innerHeight) *2 + 1,
			)

		let foundSprite = false; 
		rayCaster.setFromCamera(mouse, camera);	
		let intersects = rayCaster.intersectObjects(scene.children);
		intersects.forEach(function (intersect) {
			if (intersect.object.type === 'Sprite') {
				let p = intersect.object.position.clone().project(camera);
				if (intersect.object.alert === undefined) {
					tooltip.style.top = ((-1 * p.y + 1)* window.innerHeight)/2 + 'px';
					tooltip.style.left = (( p.x + 1 )* window.innerWidth/2) + 'px';
					tooltip.innerHTML = intersect.object.nameOut;
					tooltip.classList.add('is-active');
		
			}
					foundSprite = true;
								spriteActive = intersect.object;
				TweenMax.to(intersect.object.scale, 0.5, {
					x: 1.25,
					y: 1.25, 
					z: 1.25,
				})
			}
		});
		if (foundSprite === false && spriteActive) {
			tooltip.classList.remove('is-active');
			TweenMax.to(spriteActive.scale, 0.5, {
					x: 1,
					y: 1, 
					z: 1,
				})
			spriteActive = false;
		}
	}
	container.addEventListener('click',onClick);
	container.addEventListener('mousemove', onMouseMove);
		function onResize() {
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.aspect = window.innerWidth/window.innerHeight;
		camera.updateProjectionMatrix();
	}

	function onWheel(e){
		e = e || window.event;
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if (controls.rotateSpeed != 0) 
		{
		if (delta>0) {
			if (camera.zoom>1) {
				camera.zoom -=0.15;
				camera.fov +=5;
				controls.rotateSpeed -= 0.05; 
			}
		} else {
			if (camera.zoom<2) {
				camera.zoom +=0.15;
				camera.fov -=5;
				controls.rotateSpeed +=0.05;
			}
		}
		camera.updateProjectionMatrix();
		}
	}
	window.addEventListener('resize',onResize); 
	window.addEventListener('mousewheel',onWheel);

	button360.onclick = handleButtonClick;

	function handleButtonClick() {
		controls.autoRotate = true;
		TweenLite.to(button360,1,{scale: 0, opacity:0.3});
	}
}
