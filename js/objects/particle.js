//this is for individual particles. Very rarely will you use this, if anything you'll be using the 
//particle generator. But who am I to tell you what you won't or will use, i'm just some dum text...

import { Billboard } from "./billboard";


export class Particle{
    #lifetime;
    #velocity;
    #position;
    #texture;
    
    #billboard;
    constructor({lifetime = 3000, velocity = {x:0, y:1, z:0}, position={x:0, y:0, z:0},scale={x:1, y:1, z:1}, texture}){
        this.#billboard = new Billboard({
            position:position,
            scale:scale,
            
        });
    }
    render(syn){
    
    }
}
