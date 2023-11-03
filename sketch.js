
function preload() {
    sound = loadSound('audio/Walking on a dream.mp3')
  }
  
  // array to store all circle objects
  let circles = [];
  let smallCircles = [];
  const maxRadius = 60; // maximum radius for smaller circles
  const bigCircleRadius = 120; // radius of big circle
  
  
  let splitCircle = 8;
  let curveBase;
  let r = maxRadius * 0.9;
  
  
  // add new variable angle
  let angle = 0;
  // add a new array for color, for store the bigest small circle's color
  let colorList = [];
  
  let bigIndex =0;
  
  function setup() {
    createCanvas(windowWidth, windowHeight); //create a canvas that covers the entire browser
    colorMode(HSB); // set color mode to Hue Saturation Brightness
    makeCircles(); // call function to create circle objects
  
    //fft analyze
    fft = new p5.FFT();
    fft.setInput(sound);
    spectrum = fft.analyze();
    curveBase = (2 * PI) / splitCircle;
  }
  
  function mousePressed() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.loop();
    }
  
  }
  
  
  // function to create and store circle objects
  function makeCircles() {
    circles = []; // clear the array
    // calculate number of columns and rows for big circles based on the canvas width and height
    let cols = 4;
    let rows = 2;
  
    // nested loops to create circle objects for each column and row
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            
            // calculate position for the big circle
            let x = width / 6 + (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5 + 100);
            let y;
            if (row == 1) {
                y = -height / 10 + (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5 + height / 5);
            } else {
                y = height / 24 + (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5 + height / 5);
            }
  
            let hue = random(360); // random hue for big circle color
  
            //to calculate which cirlce the line is belonging push the bigcircle's id
            circles.push(new BigCircle(x, y, bigCircleRadius, color(hue, 5, 90),bigIndex)); // create big circle object and add to array
            //add a new big cirlce，id+1；
            bigIndex+=1;
  
            // loop to create 6 small circles inside each big circle
            for (let j = 0; j < 6; j++) {
                let hueSmall = random(360); // random hue for small circle color
                let shade = color(hueSmall, 80, 70, 0.7); // create color with the random hue
                let radius = maxRadius * (1.0) * (1 - j * 0.2) * 0.9; // calculate radius for small circle
                //innner circle
  
                //if is the small circle outer circle, then store the color
                if(j==0){
                    colorList.push(shade);
                
                }
                smallCircles.push(new SmallCircle(x, y, radius, shade, j)); // create small circle object and add to array
            }
  
            let hueCenter = random(360); // random hue for center dot color
            //center cirlce
            circles.push(new CircleCenter(x, y, maxRadius * 0.2, color(hueCenter, 100, 50, 0.7))); // create circle center object and add to array
        }
    }
  }
  
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // resize canvas to fit the window
    makeCircles(); // recreate circle objects to fit new window size
  }
  
  
  function draw() {
    background(44, 61, 100); // set background color
  
    spectrum = fft.analyze();
  
    for (let j = 0; j < spectrum.length; j += 4) {
  
      //if j is 0, 
        //scale the inner circle by j
      //if j is 12
        // transform the whole circle
      // if j is 24
        //rotate the bubbles
  
        let addAngle = map(spectrum[j], 0, 255, 1, 10);
        
        angle += addAngle * 0.1;
     
    }
  
    translate(-width / 4, 0)
    scale(1.5);
    // loop through all circle objects and call their show method
    for (let circle of circles) {
        circle.show();
    }
  
    for (let circle of smallCircles) {
        circle.show();
    
  
    }
  
  }
  
  class BigCircle {
    // constructor for creating big circle object
    constructor(x, y, radius, base,index) {
        this.pos = createVector(x, y); // store position as a vector
        this.base = base; // store color
        this.radius = radius; // store radius
        this.index =index;
    }
  
  
    // method to display the big circle
    show() {
        fill(this.base); // set fill color
        stroke(color(hue(this.base), 90, brightness(this.base) - 60)); // set stroke color
        strokeWeight(1.5); // set stroke weight
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draw the big circle
  
        /////////////////////////visalize lines
  
        //save all the rotate style
        push();
        //set the shape mode to center
        rectMode(CENTER);
        //translate to big circle's center
        translate(this.pos.x, this.pos.y);
        //rotate the line
        rotate(radians(angle));
  
  
        for (let k = 0; k < 10; k++) {
  
            beginShape();
  
            //set the color of the line, let it be same with the ouer small circle
            stroke(colorList[this.index]);
            // stroke(34, 100, 100); // set color for lines
  
            noFill()
  
            let zero_removed = spectrum.filter(e => e !== 0)
            for (let j = 0; j < spectrum.length; j += 4) {
                let x = map(j, 0, spectrum.length - 1, 0, curveBase);
                let y = map(spectrum[j], 0, 255, 0, bigCircleRadius);
  
                let y_r = map(spectrum[spectrum.length - j - 1], 0, 255, 0, bigCircleRadius);
                vertex(
                    (y + y_r + r) * cos(x + curveBase * k),
                    (y + y_r + r) * sin(x + curveBase * k)
                );
            }
            endShape();
  
        }
        rectMode(CORNER);
        pop();

    }
  }
  
  // class for the small circle
  class SmallCircle {
    // constructor for creating small circle object
    constructor(x, y, radius, base, index) {
        this.pos = createVector(x, y); // store position as a vector
        this.base = base; // store color
        this.radius = radius; // store radius
        this.index = index;
  
        let img;
    }
  
    // method to display the small circle
    show() {
        fill(this.base); // set fill color
        stroke(255); // set stroke color to white
        strokeWeight(0.5); // set stroke weight
  
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draw the small circle
  
  
        let innerRadius = this.radius * 0.5; // calculate inner radius for smaller circle inside
        ellipse(this.pos.x, this.pos.y, innerRadius * 2); // draw smaller circle inside
  
        // for (let j = 0; j < spectrum.length; j+=4) {
        //
        //     let mapSize = map (spectrum[j],0,200,10,200);
        //     this.radius = mapSize;
        //     // nested loops to draw dots around the small circle
        //
        // }
  
        //彩色圆
        for (let j = 0; j < 6; j++) {
            for (let i = 0; i < 24; i++) {
                let angle = TWO_PI / 24 * i + j * PI / 12; // calculate angle for each dot
                let xOffset = cos(angle) * this.radius * 0.7; // calculate x offset for dot position
                let yOffset = sin(angle) * this.radius * 0.7; // calculate y offset for dot position
                // ellipse(this.pos.x + xOffset, this.pos.y + yOffset, mapSize); // draw the dot
                ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.15); // draw the dot
            }
        }
  
  
        // loop to draw 5 dots around the small circle
        //小圆外面的圆
        for (let i = 0; i < 5; i++) {
            let angle = TWO_PI / 5 * i; // calculate angle for each dot
            let xOffset = cos(angle) * (this.radius * 2.5); // calculate x offset for dot position
            let yOffset = sin(angle) * (this.radius * 2.5); // calculate y offset for dot position
            ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.2); // draw the dot
        }
  
  
    }
  }
  
  // class for the cirlce center of the small circle
  class CircleCenter {
    // constructor for creating center dot object
    constructor(x, y, radius, base) {
        this.pos = createVector(x, y); // store position as a vector
        this.base = base; // store color
        this.radius = radius; // store radius
    }
  
    show() {
        fill(this.base); // set fill color
        stroke(255); // set stroke color to white
        strokeWeight(0.5); // set stroke weight
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draw the circle center
  
  
    }
  }
  