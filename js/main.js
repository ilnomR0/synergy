import {drlib} from "./drawlib.js";
import {Character} from "./character.js";
import {Plane} from "./objects/objects.js";
import { Collision } from "./collision.js";
import * as math3 from "./3dMath.js";
let drw = new drlib();

let triangleA = [
    {x:10, y:1, z:0, color:{r:0, g:0, b:255}, uv:{x:0, y:4}},

    {x:0, y:1, z:-10, color:{r:0, g:255, b:0}, uv:{x:4, y:0}},
    {x:0, y:1, z:0, color:{r:255, g:0, b:0}, uv:{x:4, y:4}},

]
let triangleB = [
    {x:0, y:1, z:-10, color:{r:0, g:150, b:0}, uv:{x:4, y:0}},

    {x:10, y:1, z:0, color:{r:0, g:0, b:150}, uv:{x:0, y:4}},
    {x:10, y:1, z:-10, color:{r:150, g:150, b:150}, uv:{x:0, y:0}},
]

let player = new Character();
drw.setCamera(player.getCamera());
const stoneTex = await drlib.loadTexture("./images/stone.png");
const brickTex = await drlib.loadTexture("./images/brick.png");
const errTex = await drlib.loadTexture("./images/err.png");

const plane = new Plane({
    position:{x:0, y:4, z:0}, 
    scale:{x:100, y:1, z:10}, 
    texture:errTex,
    UV:{x:1, y:4}});

// Keep track of the last frame's time globally in your main file
let lastTime = 0;
let pause = false;
drw.loop = async (currentTime) => {
    if(!pause){
        // 1. Calculate Delta Time (in seconds)
        // We divide by 1000 to convert milliseconds to seconds.
        // The '|| 0' prevents NaN errors on the very first frame.
        const dt = (currentTime - lastTime) / 1000 || 0; 
        lastTime = currentTime;

        drw.clear();

        drw.triangleTex(triangleA, brickTex);
        drw.triangleTex(triangleB, brickTex);
        plane.render(drw);
        // 2. Pass dt into your controller
        player.controlCharacter(dt);
        Collision.rigidify(player, dt);
    }else{

    }
    drw.present();

    requestAnimationFrame(drw.loop);
};

drw.initApplication();
