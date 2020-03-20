import p5 from 'p5';
import store from '@/store/index';
import { emit } from '@/ts/socket';

let canvas: p5.Renderer;

let brushStrokes: any[][] = store.state.brushStrokes;

const brushSize = 15;

let previousBrushPos;

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
    if (store.state.isSessionOwner) {
      p.cursor(p.CROSS);
    }
    // size = 110;
    // p.pixelDensity(0.1);
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.mousePressed(() => {
      previousBrushPos = { x: p.mouseX, y: p.mouseY };
      console.log('adding a new brushStroke');
      console.log('brushStrokes: ', brushStrokes);
      const brushStroke = [{ x: p.mouseX, y: p.mouseY }];
      brushStrokes.push(brushStroke);
    });
  };

  p.mouseReleased = (evt: any) => {
    console.log(brushStrokes);
    // emit('brushUpdate', JSON.stringify(brushStrokes));
  };

  // NOTE: Draw is here
  p.draw = () => {
    brushStrokes = store.state.brushStrokes;
    p.background(255);
    p.fill(0);
    p.noStroke();

    if (store.state.isSessionOwner) {
      p.circle(p.mouseX, p.mouseY, brushSize);
    }

    if (p.mouseIsPressed) {
      if (
        p.dist(previousBrushPos.x, previousBrushPos.y, p.mouseX, p.mouseY) > 2
      ) {
        previousBrushPos = { x: p.mouseX, y: p.mouseY };
        brushStrokes[brushStrokes.length - 1].push({
          x: p.mouseX,
          y: p.mouseY
        });
        store.commit('setBrushStrokes', brushStrokes);
        emit('brushUpdate', brushStrokes);
      }
    }

    if (brushStrokes.length)
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
