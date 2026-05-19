import {syngyne} from "./syngyne.js";
import {Character} from "./character.js";
import {Plane} from "./objects/plane.js";
import { Collision } from "./collision.js";
import { ParticleGenerator } from "./objects/particleGenerator.js";
let syn = new syngyne();

let player = new Character();
syn.setCamera(player.getCamera());

const stoneTex = await syngyne.loadTexture("./images/stone.png");
const brickTex = await syngyne.loadTexture("./images/brick.png");
const errTex = await syngyne.loadTexture("./images/err.png");
const torchTex = await syngyne.loadTexture("./images/torch.png");
const develTex = await syngyne.loadTexture("./images/devel0.png");
const fireTex = await syngyne.loadTexture("./images/fire.png");

const wall1= new Plane({
    position:{x:0, y:5, z:0}, 
    scale:{x:100, y:1, z:10}, 
    texture:stoneTex,
    UV:{x:50, y:4}
});

const wall2= new Plane({
    position:{x:0, y:0, z:-5}, 
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
    position:{x:0, y:0, z:5}, 
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
    position:{x:0, y:-5, z:0}, 
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
    position:{x:50, y:0, z:0}, 
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
    position:{x:-50, y:0, z:0}, 
    scale:{x:10, y:1, z:10}, 
    texture:brickTex,
    UV:{x:4, y:4},
    rotation:{
        x:90,
        y:-90,
        z:0
    },
    velocity:{
        rotation:{
            x:0.02,
            y:0,
            z:0
        }
    }
});

const superCoolParticleGenerator = new ParticleGenerator({
    facingObject:player,
    textures:[fireTex],
    particleCount:1000,
    maxLifetime:900,
    particleRate:100,
    position:{x:0, y:4.5, z:-10}
})
// Keep track of the last frame's time globally in your main file
let lastTime = 0;
let pause = false;
syn.loop = async (currentTime) => {
    if(!pause){
        const dt = (currentTime - lastTime) / 1000 || 0; 
        lastTime = currentTime;

        syn.clear();
        wall1.render(syn);
        wall2.render(syn);
        wall3.render(syn);
        wall4.render(syn);
        wall5.render(syn);
        wall6.updateRotation({x:currentTime*0.02, y:90, z:0});
        wall6.render(syn);

        wall6.updateRotation({x:currentTime*0.02, y:90, z:180});
        wall6.render(syn);

        superCoolParticleGenerator.render(syn);

        player.controlCharacter(dt);
        Collision.rigidify(player, dt);
    }else{

    }
    syn.present();

    requestAnimationFrame(syn.loop);
};

syn.initApplication();
