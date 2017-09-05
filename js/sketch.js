/*
Credit: This code is based originally off of a P5.js tutorial from
The Coding Train (https://www.youtube.com/watch?v=S1TQCi9axzg)
*/

var symbolSize = 25;
var streams = [];
var redraw = true;
var redrawInterval = 100;
var name = new Name();
var endRedraw = false;
var japanese = true;

function setup() {
  var parentWidth = document.getElementById('banner').offsetWidth;
  var parentHeight = document.getElementById('banner').offsetHeight;
  var canvas = createCanvas(
    parentWidth,
    parentHeight
  );
  canvas.parent("banner");
  var x = 0;
  for(var i=0; i<=width/symbolSize; i++){
    var stream = new Stream(x, random(-1000, 0));
    stream.generateSymbols();
    streams.push(stream);
    x += symbolSize;
  }
  textSize(symbolSize);
}

function draw() {
  var offset
  if (endRedraw) { offset = (frameCount < redrawInterval + 100) ? (200* frameCount/(redrawInterval+frameCount)) : 100;
  } else {
    offset = 50;
  }
  background(0, 200 - offset);
  streams.forEach(function(stream) {
    stream.render();
  })
  if (endRedraw && redraw && frameCount > redrawInterval) redraw = false;
  //if (!redraw) // Start writing the name;
}

function Symbol(x, y, speed, restartY, lead=false) {
  this.x = x;
  this.y = y;
  this.restarted = false;
  this.restartY = restartY;
  this.lead = lead;
  this.value;
  this.speed = speed;
  this.switchInterval = round(random(30, 50));

  this.setToRandomSymbol = function() {
    if (frameCount % this.switchInterval == 0) {
      if (japanese) {
        this.value = String.fromCharCode(
          0x30A0 + round(random(0,96))
        );
      } else {
        this.value = String.fromCharCode(48 + round(random()));
      }
    }
  }

  this.refill =  function() {
    //this.restarted ? fill(random(0,256), random(0,256), random(0,256)) : fill(0, 255, 70);
    fill(0, 255, 70)
  }

  this.render = function() {
    (this.lead) ? fill(140, 255, 200) : this.refill();
    text(this.value, this.x, this.y);
    this.rain();
    this.setToRandomSymbol();
  }

  this.reset = function() {
    this.restarted = true;
    return this.restartY;
  }

  this.rain = function() {
    this.y = (redraw && this.y >= height) ? this.reset() : this.y+=speed;
    if (endRedraw) speed+= 60/redrawInterval;
  }
}

function Stream(x, y) {
  this.symbols = [];
  this.numSymbols = round(random(5,10));
  this.speed = random(5, 7);
  this.restartY = random(-1000, -300);

  this.generateSymbols = function() {
    for(var i=0; i <= this.numSymbols; i++){
      let symbol = new Symbol(x, y, this.speed, this.restartY, (i==0 && random(0,1) > 0.5) ? true : false);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      symbol.render();
    })
  }
}

function Name() {
  this.string = "Pooneet Thaper"

  this.render = function() {
    if (frameCount > (this.lastReveal + 10)){
      this.visible[this.next] = 1;
      this.next += this.step;
      this.next = this.next % this.chars.length;
      this.lastReveal = frameCount;
    }
    for(var i=0; i<this.chars.length; i++){
      if(this.visible[i] > 0) {
        fill(0, 255, 70);
        text(this.chars[i], width/2 + ((i-7)*symbolSize), height/2);
      }
    }
  }
}
