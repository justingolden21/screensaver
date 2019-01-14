import Matter from 'matter-js';
import MatterWrap from 'matter-wrap';

Matter.use(MatterWrap);

// module aliases
let Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Body = Matter.Body;

let engine;

let colors = '#f66 #6f6 #66f #ff6 #f6f #6ff'.split(' ');

let WIDTH = 800;
let HEIGHT = 600;

let isFullscreen = false;

window.onload = function() {

	engine = Engine.create();
	engine.world.gravity.y = 0;

	let render = Render.create({
		canvas:  document.getElementById('world'),
		engine: engine,
		options: {
			width: WIDTH,
			height: HEIGHT,
			wireframes: false
		}
	});

	createWorld();

	Engine.run(engine);
	Render.run(render);


	$('input').change(function() {
		createWorld();
	});

	$('#fullscreen').click(function() {
		// todo: make it toggle

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		render.canvas.width = WIDTH;
		render.canvas.height = HEIGHT;

		// createWorld();

		isFullscreen = !isFullscreen;
		toggleFullscreen();
		$('#world').toggleClass('fullscreen');

		if(isFullscreen) {
			$('#fullscreen').css('z-index',99);
		} else {
			$('#fullscreen').css('z-index',1);
		}


	});

	$(window).resize(function() {
		if(!isFullscreen) {
			WIDTH = 800;
			HEIGHT = 600;
		} else {
			WIDTH = window.innerWidth;
			HEIGHT = window.innerHeight;
		}
		render.canvas.width = WIDTH;
		render.canvas.height = HEIGHT;

		//todo: figure out how to change wrap pluggin max x and y

	});

}



function createWorld() {
	World.clear(engine.world);

	let velAvg = parseInt($('#vel-avg').val() );
	let velVar = parseInt($('#vel-var').val() );
	let sizeAvg = parseInt($('#size-avg').val() );
	let sizeVar = parseInt($('#size-var').val() );
	let numColors = parseInt($('#colors').val() );
	let numCircles = parseInt($('#circles').val() );

	let circles = [];
	for(let i=0; i<numCircles; i++) {
		let velocity = random(velAvg-velVar, velAvg+velVar);
		let size = random(sizeAvg-sizeVar, sizeAvg+sizeVar);
		let color = random(0, numColors-1);


		circles.push(getCircle(random(0,WIDTH), random(0,HEIGHT), size, velocity, colors[color]) );
	}

	World.add(engine.world, circles);

	if($('#mouse').is(':checked') ) {
		let mouseConstraint = Matter.MouseConstraint.create(engine, {
			element: document.getElementById('world'),
			constraint: {
				render: {
					visible: false
				},
				stiffness:0.8
			}
		});
		World.add(engine.world, mouseConstraint);
	}

}

function getCircle(x, y, r, v, color) {
	let circle = Bodies.circle(x, y, r, {
		friction: 0,
		frictionAir: 0,
		restitution: 1,
		render: {
			fillStyle: color
		},
		plugin: {
			wrap: {
				min: {
					x: 0,
					y: 0
				},
				max: {
					x: WIDTH,
					y: HEIGHT
				}
			}
		}
	});

	let angle = random(0, 2*Math.PI);
	let vx = v * Math.cos(angle);
	let vy = v * Math.sin(angle);
	Body.setVelocity(circle, {x: vx, y: vy} );

	return circle;
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//https://stackoverflow.com/questions/3900701/onclick-go-full-screen?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function toggleFullscreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) || 
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {  
      document.documentElement.requestFullScreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    }  
  } else {  
    if (document.cancelFullScreen) {  
      document.cancelFullScreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    }  
  }  
}