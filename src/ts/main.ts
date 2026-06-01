import { syngyne } from "./syngyne.ts";
import { Character } from "./character.ts";
import { Plane } from "./objects/plane.ts";
import { Collision } from "./collision.ts";
import { ParticleGenerator } from "./objects/particleGenerator.ts";
import { PointLight } from "./objects/pointLight.ts";

//some image imports, because vite :p
import stoneURL from "/src/assets/images/stone.png";
import brickURL from "/src/assets/images/brick.png";
import errURL from "/src/assets/images/err.png";
import torchURL from "/src/assets/images/torch.png";
import develURL from "/src/assets/images/devel0.png";
import fireURL from "/src/assets/images/fire.png";
const syn = new syngyne();

const player = new Character({ syn });
syn.setCamera(player.getCamera());

//@ts-ignore
const stoneTex = await syngyne.loadTexture(stoneURL);
//@ts-ignore
const brickTex = await syngyne.loadTexture(brickURL);
//@ts-ignore
const errTex = await syngyne.loadTexture(errURL);
//@ts-ignore
const torchTex = await syngyne.loadTexture(torchURL);
//@ts-ignore
const develTex = await syngyne.loadTexture(develURL);
//@ts-ignore
const fireTex = await syngyne.loadTexture(fireURL);

const wall1 = new Plane({
    position: { x: 0, y: 5, z: 0 },
    scale: { x: 100, y: 0.1, z: 10 },
    texture: stoneTex,
    UV: { x: 50, y: 4 },
});

const wall2 = new Plane({
    position: { x: 0, y: 0, z: -5 },
    scale: { x: 100, y: 0.1, z: 10 },
    texture: brickTex,
    UV: { x: 50, y: 4 },
    rotation: {
        x: 90,
        y: 0,
        z: 0
    },

});
const wall3 = new Plane({
    position: { x: 0, y: 0, z: 5 },
    scale: { x: 100, y: 0.1, z: 10 },
    texture: brickTex,
    UV: { x: 50, y: 4 },
    rotation: {
        x: 270,
        y: 0,
        z: 180
    },

});
//not fine
const wall4 = new Plane({
    position: { x: 0, y: -5, z: 0 },
    scale: { x: 100, y: 0.1, z: 10 },
    texture: stoneTex,
    UV: { x: 50, y: 4 },
    rotation: {
        x: 180,
        y: 0,
        z: 0
    },

});

const wall5 = new Plane({
    position: { x: 50, y: 0, z: 0 },
    scale: { x: 10, y: 0.1, z: 10 },
    texture: brickTex,
    UV: { x: 4, y: 4 },
    rotation: {
        x: 90,
        y: 90,
        z: 0
    },

});
const wall6 = new Plane({
    position: { x: -50, y: 0, z: 0 },
    scale: { x: 10, y: 0.1, z: 10 },
    texture: brickTex,
    UV: { x: 4, y: 4 },
    rotation: {
        x: 90,
        y: 270,
        z: 0
    },
    velocity: {
        position: { x: 0, y: 0, z: 0 },
        rotation: {
            x: 0.02,
            y: 0,
            z: 0
        }
    },
});

const superCoolParticleGenerator = new ParticleGenerator({
    facingObject: player.getCamera(),
    textures: [fireTex],
    particleCount: 1000,
    maxLifetime: 200,
    particleRate: 1000,
    position: { x: 0, y: 4.5, z: -10 },
});

const light = new PointLight({
    radius: 500, velocity:
    {
        position: { x: 0, y: -5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    glowColor: { r: 100, g: 80, b: 60 }
});
const light2 = new PointLight({
    radius: 100, velocity:
    {
        position: { x: 100, y: 100, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    glowColor: { r: 255, g: 100, b: 0 }
});
syn.addLight(light);
syn.addLight(light2);

Collision.addCollider(wall1, wall2, wall3, wall4, wall5);

let lastTime = 0;
syn.loop = async (currentTime: number) => {
    const dt = (currentTime - lastTime) / 1000 || 0;
    lastTime = currentTime;
    syn.clear();
    if (!syn.isPaused()) {

        light.updatePosition(player.getPosition());
        light.setRadius((Math.random() * (50 - 40)) + 50);
        wall6.updateRotation({ x: currentTime * 0.02, y: 90, z: 0 });
        wall6.render(syn);
        wall6.updateRotation({ x: currentTime * 0.02, y: 90, z: 180 });
        wall6.render(syn);
        
        wall1.render(syn);
        wall2.render(syn);
        wall3.render(syn);
        wall4.render(syn);
        wall5.render(syn);
        

        wall6.render(syn);
        superCoolParticleGenerator.render(syn);
        
        light.render(syn);
        light2.render(syn);
        syn.compositeLights();
        
        syn.present();
        Collision.rigidify(player, dt);


    } else {

    }
        player.controlCharacter(dt, syn);

    requestAnimationFrame(syn.loop);
};

syn.initApplication();
