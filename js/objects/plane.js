import * as math3 from "../3dMath.js";
import { Object } from "./object.js";

export class Plane extends Object{
    #UV = {x:1, y:1};
    #texture;

    #vertexPositions;
    #triangles;
    #tint; 
    constructor({velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}},tint={r:0, g:0, b:0}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, texture, UV={x:1,y:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        super({position, scale, rotation, velocity, rotFormat})
        this.#texture = texture;
        this.#UV = UV;
        this.#tint = tint;
        this.#updateVertexPositions();
        this.lockedAxis={
            x:false,
            y:false,
            z:false
        }
    
    }
    render(drw){
        drw.triangleTex(this.#triangles[0], this.#texture);
        drw.triangleTex(this.#triangles[1], this.#texture);
    }

    #updateVertexPositions(){
        const scale = this.getScale();
        const rotation = this.getRotation();
        const rotFormat = this.getRotFormat();
        const position = this.getPosition();


        //i'm lay z ok?
       
        this.#vertexPositions = [
            math3.addVec3(math3.gimbal({x:0.5*scale.x+0, y:0, z:0.5*scale.z+0}, rotation, rotFormat), position),
            math3.addVec3(math3.gimbal({x:-0.5*scale.x+0, y:0, z:-0.5*scale.z+0}, rotation, rotFormat), position),
            math3.addVec3(math3.gimbal({x:-0.5*scale.x+0, y:0, z:0.5*scale.z+0}, rotation, rotFormat), position),
            math3.addVec3(math3.gimbal({x:0.5*scale.x+0, y:0, z:-0.5*scale.z+0}, rotation, rotFormat), position),
        ]; 
        this.#triangles = [
            [
                //1, 2, 3
                //2, 1, 4
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
                {x:this.#vertexPositions[2].x, y:this.#vertexPositions[2].y, z:this.#vertexPositions[2].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
            ],[
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:this.#tint, uv:{x:0, y:0}},
            ]
        ]
    }
    /**
     * @param {Vec3} position 
     */
    updatePosition(position){
        super.updatePosition(position);
        this.#updateVertexPositions();
    }
    /**
     * @param {Vec3} rotation 
     */
    updateRotation(rotation){
        super.updateRotation(rotation);
        this.#updateVertexPositions();
    }
    /**
     * @param {Vec3} scale 
     */
    updateScale(scale){
        super.updateScale(scale);
        this.#updateVertexPositions();
    }
    /**
     * @param {ImageData} texture 
     */
    updateTexture(texture){
        this.#texture = texture;
        this.#updateVertexPositions();
    }
    applyVelocity(){
        super.applyVelocity();
        this.#updateVertexPositions();
    }
    setTriangles(){

    }
    getTriangles(){return this.#triangles};
    getVertexPositions(){return this.#vertexPositions};
    getTexture(){return this.#texture};
}


