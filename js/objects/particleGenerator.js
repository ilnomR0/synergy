import * as math3 from "../3dMath.js";
import { Particle } from "./particle.js";

export class ParticleGenerator{
    /** @type {Particle[]}*/
    #particles = [];
    #position = {x:0, y:0, z:0};
    #particleCount = 10;
    #maxLifetime = 10;
    #minLifetime = 20;
    #textures = [];
    #facingObject;
    #particleRate = 1;
    #tint= {r:0, g:0, b:0};
    constructor({tint={r:0, g:0, b:0}, particleRate = 2,position = {x:0, y:0, z:0}, particleCount = 10,maxLifetime =10, minLifetime = 0, textures, facingObject}){
        this.#particleCount = particleCount;
        this.#position = position;
        this.#maxLifetime = maxLifetime;
        this.#minLifetime = minLifetime;
        this.#textures = textures;
        this.#facingObject = facingObject;
        this.#particleRate = particleRate;
        this.#tint= tint;
    }
    render(syn){
        for(let i = 0; i < this.#particleRate; i++){
            if(this.#particles.length < this.#particleCount){
                this.#particles.push(new Particle({
                    position:math3.addVec3(this.#position, {x: (Math.random() * 2)+1, z:(Math.random() * 10)+5, y:0}),
                    lifetime:~~(Math.random()*(this.#maxLifetime-this.#minLifetime)+this.#minLifetime),
                    texture:this.#textures[~~(Math.random()*this.#textures.length-1)],
                    facingObject:this.#facingObject,
                    tint:this.#tint,
                    velocity:{position:{
                    x:((Math.random()*10)-5)/150,
                    y:-0.05,
                    z:((Math.random()*10)-5)/150,
                    },rotation:{
                        x:0,
                        y:0,
                        z:0
                    }}
                }));
            }
        }
        for(const particle of this.#particles){
            if(particle.getLife() > 0){
                particle.tickLife();
                particle.render(syn);
                continue;
            }else{
                this.#particles.splice(this.#particles.indexOf(particle), 1);
            }
        }
    }
}
