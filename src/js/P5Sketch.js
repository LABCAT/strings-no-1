import React, { useEffect } from "react";
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/strings-no-1.mp3'
//import audio from '../audio/donuts-no-1.mp3'


const P5Sketch = () => {

    const Sketch = p5 => {

        p5.canvasWidth = window.innerWidth;

        p5.canvasHeight = window.innerHeight;

        p5.canvas = null;
        
        p5.song = null;

        p5.tempo = 106;

        p5.nextSemiQuaver = 5;

        p5.melodyIndex = 0;

        p5.melodyArray = [5,3,4,4,5,3,4,4];

        p5.numOfStringLoops = 300;

        p5.nx = p5.random(100);
        p5.ny = p5.random(100);
        p5.nz = 0;

        p5.h = p5.random(360);

        p5.ox = p5.random(p5.canvasWidth);
        p5.oy = p5.random(p5.canvasHeight);
        
        p5.semiQuaversArray = [];


        p5.setup = () => {
            p5.song = p5.loadSound(audio);
            p5.colorMode(p5.HSB, 360, 100, 100, 100);
            p5.canvas = p5.createCanvas(p5.canvasWidth, p5.canvasHeight); 
            p5.background(0);
            p5.strokeWeight(0.1);
            p5.noFill();
        };

        //https://www.openprocessing.org/sketch/988880
        p5.draw = () => {
            let currentBar = p5.getSongBar();
            
            p5.blendMode(p5.SCREEN);

            //console.log('currentBar', currentBar);
            if (p5.song._lastPos > 0 && currentBar >= 0) {

                if (currentBar > 95) {
                    currentBar = 95;
                    p5.canvas.addClass('fade-out');
                }
                p5.playStrings();
                console.log('currentBar');
                console.log(currentBar);
                if (currentBar === p5.nextSemiQuaver) {
                    p5.melodyIndex++;
                    if (p5.melodyIndex === p5.melodyArray.length){
                        p5.melodyIndex = 0;
                    }
                    p5.nextSemiQuaver = p5.nextSemiQuaver + p5.melodyArray[p5.melodyIndex]; 
                    p5.numOfStringLoops = p5.numOfStringLoops + 10;
                    p5.nz = 0;
                    p5.nx = p5.random(100);
                    p5.ny = p5.random(100);
                    p5.ox = p5.random(p5.canvasWidth);
                    p5.oy = p5.random(p5.canvasHeight);
                    p5.h = p5.random(360);
                    p5.h++;
                }
                
            }
            
        };

        p5.playStrings = () => {
            console.log('newStrings');
            p5.stroke(p5.h % 360, 100, 100, 50);

            p5.beginShape();
            const numOfLoops = p5.numOfStringLoops;
            //const numOfLoops = p5.random(400, 800);
            
            const circleSize = p5.canvasHeight / 256;
            for (let i = 0; i < numOfLoops; i++) {
                let x = p5.map(p5.noise(i * 0.01, p5.nx, p5.nz), 0, 1, p5.ox - numOfLoops, p5.ox + numOfLoops);
                let y = p5.map(p5.noise(i * 0.01, p5.ny, p5.nz), 0, 1, p5.oy - numOfLoops, p5.oy + numOfLoops);
                p5.curveVertex(x, y);
                //p5.ellipse(x, y, circleSize, circleSize);
            }

            p5.endShape();
            console.log('ednShape');

            p5.nz += 0.005;
            

            // if (p5.nz > 0.5) {
            //     p5.nz = 0;
            //     p5.nx = p5.random(100);
            //     p5.ny = p5.random(100);
            //     p5.ox = p5.random(p5.canvasWidth);
            //     p5.oy = p5.random(p5.canvasHeight);
            //     p5.h = p5.random(360);
            // }
            // p5.h++;
        }

        p5.getSongBar = () => {
            if (p5.song && p5.song.buffer){
                const beatPerBar = 0.5;
                const barAsBufferLength = (p5.song.buffer.sampleRate * 60 / p5.tempo) * beatPerBar;
                return Math.floor(p5.song._lastPos / barAsBufferLength);
            }
            return -1;
        }


        p5.mousePressed = () => {
            if (p5.song.isPlaying()) {
                p5.song.pause();
            } else {
                p5.song.play();
            }
        };

        p5.updateCanvasDimensions = () => {
            p5.canvasWidth = window.innerWidth;
            p5.canvasHeight = window.innerHeight;
            p5.createCanvas(p5.canvasWidth, p5.canvasHeight);
            p5.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p5.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p5.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <></>
    );
};

export default P5Sketch;
