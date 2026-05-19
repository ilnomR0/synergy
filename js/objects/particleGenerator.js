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
    constructor({particleRate = 1,position = {x:0, y:0, z:0}, particleCount = 10,maxLifetime =10, minLifetime = 0, textures, facingObject}){
        this.#particleCount = particleCount;
        this.#position = position;
        this.#maxLifetime = maxLifetime;
        this.#minLifetime = minLifetime;
        this.#textures = textures;
        this.#facingObject = facingObject;
        this.#particleRate = particleRate;
    }
    render(syn){
        for(let i = 0; i < this.#particleRate; i++){
            if(this.#particles.length < this.#particleCount){
                this.#particles.push(new Particle({
                    position:math3.addVec3(this.#position, {x: (Math.random() * 2)+1, z:(Math.random() * 10)+5, y:0}),
                    lifetime:~~(Math.random()*(this.#maxLifetime-this.#minLifetime)+this.#minLifetime),
                    texture:this.#textures[~~(Math.random()*this.#textures.length-1)],
                    facingObject:this.#facingObject
                }));
            }
        }
        console.log(this.#particles) 
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
