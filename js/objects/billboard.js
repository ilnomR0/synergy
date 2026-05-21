import { Plane } from "./plane.js";

export class Billboard extends Plane{

    #facingObject;
    constructor({tint={r:0, g:0, b:0},velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, texture, UV={x:1,y:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz", facingObject}){
        super({position, scale, texture, UV, rotation, rotFormat, velocity, tint});
        this.#facingObject = facingObject;
    }
    render(syn){
        const ourPos = this.getPosition();
        const theirPos = this.#facingObject.getPosition();
        const distX = ourPos.x - theirPos.x;
        const distY = ourPos.y - theirPos.y;
        const distZ = ourPos.z - theirPos.z;
        //ik I should use quaternions but no thank you not today
        
        this.updateRotation({
            z:0,
            x:-Math.atan2(distY, Math.sqrt(distX*distX + distZ*distZ)) * (180/Math.PI)+90,
            y:(Math.atan2(distZ,distX)*(180/Math.PI))+90
        });

        super.render(syn);
    }
    getFacingObject(){ return this.#facingObject;}
}
