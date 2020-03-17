import p5 from 'p5';
import store from '@/store/index';
import { sendMessage } from '@/ts/socket';

let canvas: p5.Renderer;

const brushStrokes: p5.Vector[][] = [];

const brushSize = 15;

export default function(p: p5) {
  // NOTE: Set up is here
  p.setup = () => {
    console.log(store.state);
    p.angleMode(p.DEGREES);
    p.frameRate(30);
    p.noiseDetail(2, 0.5);

    // p.noStroke();
    p.stroke(0);
    p.background(255, 255, 255);

    // p.noCursor();
    p.cursor(p.CROSS);
    // size = 110;
    // p.pixelDensity(0.1);
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.mousePressed(() => {
      console.log('adding a new brushStroke');
      const brushStroke = [p.createVector(p.mouseX, p.mouseY)];
      brushStrokes.push(brushStroke);
    });
  };

  // NOTE: Draw is here
  p.draw = () => {
    p.background(255);
    p.fill(0);
    p.noStroke();
    // console.log(brushSize);
    p.circle(p.mouseX, p.mouseY, brushSize);

    if (p.mouseIsPressed) {
      // console.log(brushStrokes);
      if (brushStrokes.length) {
        brushStrokes[brushStrokes.length - 1].push(
          p.createVector(p.mouseX, p.mouseY)
        );
      }
      // p.circle(p.mouseX, p.mouseY, 20);
      store.commit('setBrushStrokes', brushStrokes);
      // sendMessage({ strokes: brushStrokes });
      sendMessage('teeest');
    }

    for (const brushStroke of brushStrokes) {
      p.stroke(0);
      p.strokeWeight(brushSize);
      if (brushStroke.length > 1) {
        p.beginShape(p.LINES);
        for (let i = 1; i < brushStroke.length; i++) {
          p.vertex(brushStroke[i - 1].x, brushStroke[i - 1].y);
          p.vertex(brushStroke[i].x, brushStroke[i].y);
        }
        p.endShape();
      }
    }
  };

  // p.keyPressed = () => {
  //   if (p.key == "x") {
  //     eraserActive = !eraserActive;
  //   } else if (p.key == "a") {
  //     animationMode++;
  //     animationMode %= nrOfAnimationModes;
  //   }
  // };

  p.windowResized = () => {
    console.log('window resized!!');
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
