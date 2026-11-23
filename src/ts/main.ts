globalThis.jsObject = Object;
import { syngyne } from "@syngyne/syngyne.ts";
import { Character } from "@objects/character.ts";
import { Plane } from "@objects/plane.ts";
import { Collision } from "@syngyne/collision.ts";
import { ParticleGenerator } from "@objects/particleGenerator.ts";
import { PointLight } from "@objects/pointLight.ts";

//some image imports, because vite :p
import stoneURL from "@assets/images/stone.png";
import brickURL from "@assets/images/brick.png";
import errURL from "@assets/images/err.png";
import torchURL from "@assets/images/torch.png";
import develURL from "@assets/images/devel0.png";
import fireURL from "@assets/images/fire.png";
import { Vec3Z } from "@syngyne/3dMath.ts";
import { Cube } from "@objects/cube.ts";

globalThis.syn = new syngyne();

const player = new Character({});
syn.camera = player.camera;

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
    texture: errTex,
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
const cube = new Cube({
    texture:brickTex,
    position:{x:20, y:1.25, z:0},
    scale:{x:2, y:2, z:2},
    UV:{x:4, y:4}
})
console.dir(wall6)
console.dir(player)
const superCoolParticleGenerator = new ParticleGenerator({
    facingObject: player.camera,
    textures: [fireTex],
    particleCount: 1,
    maxLifetime: 200,
    particleRate: 1000,
    position: { x: 0, y: 4.5, z: -10 },
});

const light = new PointLight({
    radius: 10,
    pwrFactor: 2,
    glowColor: { r: 255, g: 60, b: 5 }
});
const light2 = new PointLight({
    radius: 50,
    pwrFactor:2,
    glowColor: { r: 255, g: 255, b: 255 }
});

Collision.addCollider(wall1, wall2, wall3, wall4, wall5, wall6);

let lastTime = 0;

syn.loop = async (currentTime: number) => {
    const dt = (currentTime - lastTime) / 1000 || 0;
    lastTime = currentTime;
    syn.clearZBuffer();
    if (!syn.isPaused()) {
    syn.clearPixBuffer(); 
    syn.clearLightBuffer();

        light.updatePosition(player.position);
        wall6.updateRotation({ x: currentTime * 0.02, y: 90, z: 0 });
        wall6.render();
        wall6.updateRotation({ x: currentTime * 0.02, y: 90, z: 180 });
        wall6.render();
        
        wall1.render();
        wall2.render();
        wall3.render();
        wall4.render();
        wall5.render();
        

        wall6.render();
        cube.render();
        superCoolParticleGenerator.render();
        
        light.render();
        light2.render();
        syn.compositeLights();
        Collision.rigidify(player, dt);


    } else {

    }
        syn.present();
        player.controlCharacter(dt);

    requestAnimationFrame(syn.loop);
};

syn.initApplication();
