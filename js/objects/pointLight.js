import { Object } from "./object.js";

//i gotta have a Z buffer for these lights...
//I don't wanna z buffer for these lights tho.....
export class PointLight extends Object{
    /** @type {Color} */
    #glowColor;
    #radius = 1;
    
    constructor({radius=1, glowColor={r:255, g:200, b:150}, velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        super({velocity, position, scale, rotation, rotFormat});
        this.#glowColor = glowColor;
        this.#radius = radius;
        this.zBuffer;
        
    }
    render(syn){
        syn.renderLightSplat(this);
    }
    setRadius(intensity){this.#radius=intensity}
    getRadius(){return this.#radius}
    getColor(){return this.#glowColor}

}
