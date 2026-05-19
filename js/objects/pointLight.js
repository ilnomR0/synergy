import { Object } from "./object";

export class PointLight extends Object{
    /** @type {Color} */
    #glowColor;
    #radius = 0;
    constructor({radius = 10, glowColor={r:0, g:0, b:0}, velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        super({velocity, position, scale, rotation, rotFormat});
        this.#glowColor = glowColor;
        this.#radius = radius;
        //we got 2 paths
        
    }
}
