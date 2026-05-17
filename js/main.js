import {drlib} from "./drawlib.js";
import {Character} from "./character.js";
import {Plane} from "./objects/objects.js";
import { Collision } from "./collision.js";
import * as math3 from "./3dMath.js";
let drw = new drlib();


let player = new Character();
drw.setCamera(player.getCamera());
const stoneTex = await drlib.loadTexture("./images/stone.png");
const brickTex = await drlib.loadTexture("./images/brick.png");
const errTex = await drlib.loadTexture("./images/err.png");
const torchTex = await drlib.loadTexture("./images/torch.png");
const develTex = await drlib.loadTexture("./images/devel0.png");

const wall1= new Plane({
    position:{x:0, y:2, z:0}, 
    scale:{x:100, y:1, z:10}, 
    texture:stoneTex,
    UV:{x:50, y:4}
});

const wall2= new Plane({
    position:{x:0, y:5, z:-3}, 
    scale:{x:100, y:1, z:10}, 
    texture:brickTex,
    UV:{x:50, y:4},
    rotation:{
        x:90,
        y:0,
        z:0
    }
});
const wall3= new Plane({
    position:{x:0, y:5, z:-3}, 
    scale:{x:100, y:1, z:10}, 
    texture:brickTex,
    UV:{x:50, y:4},
    rotation:{
        x:-90,
        y:0,
        z:180
    }
});
const wall4= new Plane({
    position:{x:0, y:8, z:0}, 
    scale:{x:100, y:1, z:10}, 
    texture:stoneTex,
    UV:{x:50, y:4},
    rotation:{
        x:180,
        y:0,
        z:0
    }
});
const wall5= new Plane({
    position:{x:0, y:50, z:-3}, 
    scale:{x:10, y:1, z:10}, 
    texture:brickTex,
    UV:{x:4, y:4},
    rotation:{
        x:90,
        y:90,
        z:0
    }
});
const wall6= new Plane({
    position:{x:0, y:50, z:-3}, 
    scale:{x:10, y:1, z:10}, 
    texture:brickTex,
    UV:{x:4, y:4},
    rotation:{
        x:90,
        y:-90,
        z:0
    }
});
// Keep track of the last frame's time globally in your main file
let lastTime = 0;
let pause = false;
drw.loop = async (currentTime) => {
    if(!pause){
        const dt = (currentTime - lastTime) / 1000 || 0; 
        lastTime = currentTime;


    drw.clear();
        wall1.render(drw);
        wall2.render(drw);
        wall3.render(drw);
        wall4.render(drw);
        wall5.render(drw);
        wall6.render(drw);
        // 2. Pass dt into your controller
        player.controlCharacter(dt);
        Collision.rigidify(player, dt);
    }else{

    }
    drw.present();

    requestAnimationFrame(drw.loop);
};

drw.initApplication();
