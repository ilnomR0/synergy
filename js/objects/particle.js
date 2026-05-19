//this is for individual particles. Very rarely will you use this, if anything you'll be using the 
//particle generator. But who am I to tell you what you won't or will use, i'm just some dum text...

import { Billboard } from "./billboard.js";

export class Particle extends Billboard{
    #lifetime;

    constructor({velocity = {position:{x:0, y:-0.01, z:0},rotation:{x:0, y:0, z:0}}, position={x:0,y:0,z:0}, scale = {x:0.3, y:0.3, z:0.3}, texture, UV={x:1,y:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz", facingObject, lifetime = 100}){
        super({velocity, position, scale, texture, UV, rotation, rotFormat, facingObject})
        this.#lifetime = lifetime;
    }
    render(syn){
        this.applyVelocity();
        super.render(syn);
    }

    tickLife(){this.#lifetime--;}
    getLife(){return this.#lifetime}

}
