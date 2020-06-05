var holder;
var incense_down;
var incense_down_short;
var incense_down_long;
var arm_empty;
var arm_with_match;
var arm_with_incense_long;
var arm_with_incense_short;

var y;

var shortSpan = 20000;
var longSpan = 40000;

var p_texture;
var p_grey_texture;
var fire;
var smoke;

var longTip = {x:289, y:156};
var shortTip = {x:276, y:218};
var centerTip = {x:254, y:338};

var startTime;
var timeSpan;

var mouseIsPressedBefore = false;

var cnv;

function setup() {
  cnv = createCanvas(500, 600);
  cnv.position(windowWidth/2, windowHeight/2 - height/2, 'fixed');
  cnv.style('z-index', '-1');

  y = windowHeight/2 - height/2;

  frameRate(15);
  smooth();
  textAlign(CENTER);

  holder = loadImage('assets/incense/holder.png');
  incense_down = loadImage('assets/incense/incense_down.png');
  incense_down_short = loadImage('assets/incense/incense_down_short.png');
  incense_down_long = loadImage('assets/incense/incense_down_long.png');
  
  arm_empty = loadImage('assets/incense/arm_empty.png');
  arm_with_match = loadImage('assets/incense/arm_with_match.png');
  arm_with_incense_long = loadImage('assets/incense/arm_with_incense_long.png');
  arm_with_incense_short = loadImage('assets/incense/arm_with_incense_short.png');
  
  p_texture = loadImage('assets/incense/particle.png');
  p_grey_texture = loadImage('assets/incense/particle_grey.png');
  
  state = "none";
}

function draw() {
  if (windowWidth < 800) {
    cnv.hide();
    return;
  } else {
    cnv.show();
  }

  clear();
  cnv.position(windowWidth/2, y);
  cnv.elt.style.position = 'fixed';
  cnv.style('z-index', '-1');

  background(255, 0);
  drawShadow();
  drawHolder();
  switch(state) {
    case "none":
      // start up
      drawIncenseDown();
      drawEmptyHand();
      if (!mouseIsPressedBefore){
				mouseIsPressedBefore = true;
        if (onLongIncense(mouseX, mouseY)) {
          state = "holdingLong";
        } else if (onShortIncense(mouseX, mouseY)) {
          state = "holdingShort";
        }
      } else {
				mouseIsPressedBefore = false;
			}
      break;
    case "holdingLong":
      drawShortIncenseDown();
      drawHandWithLongIncense();
      // if (mouseIsPressed) {
        if (onHolder(mouseX, mouseY)) {
          state = "lightingLong";
          fire = new ParticleSystem(0,createVector(0, 0), p_texture);
        } else {
          // state = "none";
        }
      // }
      break;
    case "holdingShort":
      drawLongIncenseDown();
      drawHandWithShortIncense();
      // if (mouseIsPressed) {
        if (onHolder(mouseX, mouseY)) {
          state = "lightingShort";
          fire = new ParticleSystem(0,createVector(0, 0), p_texture);
        } else {
          state = "none";
        }
      // }
      break;
    case "lightingLong":
      drawShortIncenseDown();
      drawLongIncense(0, false);
      drawHolder();
      drawHandWithMatch();
      updateFire();
      if (abs(mouseX-longTip.x) < 3 && abs(mouseY-longTip.y) < 3) {
        state = "timingLong";
        startTime = millis();
        timeSpan = random(shortSpan, longSpan);
        smoke = new ParticleSystem(0,createVector(0, 0), p_grey_texture);
      }
      break;
    case "lightingShort":
      drawLongIncenseDown();
      drawShortIncense(0, false);
      drawHolder();
      drawHandWithMatch();
      updateFire();
      if (abs(mouseX-shortTip.x) < 3 && abs(mouseY-shortTip.y) < 3) {
        state = "timingShort";
        startTime = millis();
        timeSpan = random(10000, shortSpan);
        smoke = new ParticleSystem(0,createVector(0, 0), p_grey_texture);
      }
      break;
    case "timingLong":
      drawShortIncenseDown();
      drawLongIncense((map(millis() - startTime, 0, timeSpan+1, 0, 1)), true);
      if (millis() - startTime > timeSpan) {
        state = "none";
      }
      drawHolder();
      break;
    case "timingShort":
      drawLongIncenseDown();
      drawShortIncense((map(millis() - startTime, 0, timeSpan+1, 0, 1)), true);
      if (millis() - startTime > timeSpan) {
        state = "none";
      }
      drawHolder();
      break;
    default:
      break;
  }
}

function updateFire() {
  var dx = map(mouseX,0,width,-0.2,0.2);
  var wind = createVector(dx,0);

  fire.applyForce(wind);
  fire.run(max(mouseX-5, width/2), mouseY);
  for (var i = 0; i < 2; i++) {
      fire.addParticle();
  }
}


function onLongIncense(x, y) {
  if (x > 215 && x < 494 && y > 400 && y < 501) {
    return true;
  } else {
    return false;
  }
}

function onShortIncense(x, y) {
  if (abs(x * -0.287	+ 579 - y) < 10 && x > 317 && x < 500) {
    return true;
  } else {
    return false;
  }
}

function onHolder(x, y) {
  if (abs(x - 250) < 30 && abs(y - 330) < 50) {
    return true;
  } else {
    return false;
  }
}

function mouseWheel(event) {
  // print(event.delta);
  // y += event.delta;
}

//========= RENDERING ===========

function drawShadow() {
  noStroke();
  fill(255, 232, 245, 200);
  ellipse(width/2, height/2 + 115, 180, 40);
  fill(255, 244, 244, 100);
  ellipse(width/2-30, height/2 + 135, 300, 100);
}

function drawHolder() {
  image(holder, width/2-holder.width/6, height/2-40, holder.width/3, holder.height/3);
}

function drawIncenseDown() {
  image(incense_down, width/2-30, height/2+110, incense_down.width/1.5, incense_down.height/1.2);
}


function drawLongIncense(n, isSmoking) {
  var x = map(n, 1, 0, centerTip.x, longTip.x);
  var y = map(n, 1, 0, centerTip.y, longTip.y);
  strokeWeight(3.5);
  stroke(0);
  line(x, y, centerTip.x, centerTip.y);
  stroke(255, 71, 71);
  point(x, y);
  
  if (isSmoking) {
    var dx = map(mouseX,0,width,-0.2,0.2);
    var wind = createVector(dx,0);
  
    smoke.applyForce(wind);
    smoke.run(x, y);
    for (var i = 0; i < 2; i++) {
        smoke.addParticle();
    }
  }
}

function drawShortIncense(n, isSmoking) {
  var x = map(n, 1, 0, centerTip.x, shortTip.x);
  var y = map(n, 1, 0, centerTip.y, shortTip.y);
  strokeWeight(3.5);
  stroke(0);
  line(x, y, centerTip.x, centerTip.y);
  stroke(255, 71, 71);
  point(x, y);
  
  if (isSmoking) {
    var dx = map(mouseX,0,width,-0.2,0.2);
    var wind = createVector(dx,0);
  
    smoke.applyForce(wind);
    smoke.run(x, y);
    for (var i = 0; i < 2; i++) {
        smoke.addParticle();
    }
  }
}

function drawEmptyHand() {
  if (mouseX < 0 || mouseX > width) return;
  var x = constrain(mouseX, width/2, width);
  image(arm_empty, x-50, mouseY-50, arm_empty.width/4, arm_empty.height/4);
}

function drawHandWithLongIncense() {
  if (mouseX < 0 || mouseX > width) return;
  var x = constrain(mouseX, width/2, width);
  image(arm_with_incense_long, x-50, mouseY-210, arm_with_incense_long.width/4, arm_with_incense_long.height/4);
}

function drawHandWithShortIncense() {
  if (mouseX < 0 || mouseX > width) return;
  var x = constrain(mouseX, width/2, width);
  image(arm_with_incense_short, x-50, mouseY-210, arm_with_incense_short.width/4, arm_with_incense_short.height/4);
}

function drawHandWithMatch() {
  if (mouseX < 0 || mouseX > width) return;
  var x = constrain(mouseX, width/2, width);
  image(arm_with_match, x-10, mouseY-65, arm_empty.width/4, arm_empty.height/4);
}

function drawLongIncenseDown() {
  image(incense_down_long, width/2-30, height/2+110, incense_down_long.width/1.5, incense_down_long.height/1.2);
}

function drawShortIncenseDown() {
  image(incense_down_short, width/2-30, height/2+110, incense_down_short.width/1.5, incense_down_short.height/1.2);

}




// *** the code below is adapted from https://p5js.org/examples/simulate-smokeparticles.html *** //

//========= PARTICLE SYSTEM ===========

/**
 * A basic particle system class
 * @param num the number of particles
 * @param v the origin of the particle system
 * @param img_ a texture for each particle in the system
 * @constructor
 */
var ParticleSystem = function(num,v,img_) {

    this.particles = [];
    this.origin = v.copy(); // we make sure to copy the vector value in case we accidentally mutate the original by accident
    this.img = img_
    for(var i = 0; i < num; ++i){
        this.particles.push(new Particle(this.origin,this.img));
    }
};

/**
 * This function runs the entire particle system.
 */
ParticleSystem.prototype.run = function(x, y) {

    // cache length of the array we're going to loop into a variable
    // You may see <variable>.length in a for loop, from time to time but
    // we cache it here because otherwise the length is re-calculated for each iteration of a loop
    var len = this.particles.length;

    //loop through and run particles
    for (var i = len - 1; i >= 0; i--) {
        var particle = this.particles[i];
        particle.run(x, y);

        // if the particle is dead, we remove it.
        // javascript arrays don't have a "remove" function but "splice" works just as well.
        // we feed it an index to start at, then how many numbers from that point to remove.
        if (particle.isDead()) {
            this.particles.splice(i,1);
        }
    }
}

/**
 * Method to add a force vector to all particles currently in the system
 * @param dir a p5.Vector describing the direction of the force.
 */
ParticleSystem.prototype.applyForce = function(dir) {
    var len = this.particles.length;
    for(var i = 0; i < len; ++i){
        this.particles[i].applyForce(dir);
    }
}

/**
 * Adds a new particle to the system at the origin of the system and with
 * the originally set texture.
 */
ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin,this.img));
}

//========= PARTICLE  ===========
/**
 *  A simple Particle class, renders the particle as an image
 */
var Particle = function (pos, img_) {
    this.loc = pos.copy();

    var vx = randomGaussian() * 0.3;
    var vy = randomGaussian() * 0.3 - 1.0;

    this.vel = createVector(vx,vy);
    this.acc = createVector();
    this.lifespan = 100.0;
    this.texture = img_;
}

/**
 *  Simulataneously updates and displays a particle.
 */
Particle.prototype.run = function(x, y) {
    this.update();
    if (mouseX < 0 || mouseX > width) return;

    this.render(x, y);
}

/**
 *  A function to display a particle
 */
Particle.prototype.render = function(x, y) {
    //print(x + ":" + y);
    imageMode(CENTER);
    tint(255,this.lifespan);
    image(this.texture, x+this.loc.x, y+this.loc.y, this.texture.width, this.texture.height);
    tint(255,255);
    imageMode(CORNER);
}

/**
 *  A method to apply a force vector to a particle.
 */
Particle.prototype.applyForce = function(f) {
    this.acc.add(f);
}

/**
 *  This method checks to see if the particle has reached the end of it's lifespan,
 *  if it has, return true, otherwise return false.
 */
Particle.prototype.isDead = function () {
    if (this.lifespan <= 0.0) {
        return true;
    } else {
        return false;
    }
}

/**
 *  This method updates the position of the particle.
 */
Particle.prototype.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.lifespan -= 2.5;
    this.acc.mult(0);
}