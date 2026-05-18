import * as math3 from "../3dMath.js";

export class Plane{
    #position;
    #scale;
    #texture;
    #rotation;
    #rotFormat;
    #vertexPositions;
    #triangles;
    #UV;
    constructor({position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, texture, UV={x:1,y:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        this.#position = position;
        this.#scale = scale;
        this.#texture = texture;
        this.#rotation = rotation;
        this.#rotFormat= rotFormat;
        this.#UV = UV;
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
        this.#vertexPositions = [
            math3.addVec3(math3.gimbal({x:0.5*this.#scale.x+0, y:0, z:0.5*this.#scale.z+0}, this.#rotation, this.#rotFormat), this.#position),
            math3.addVec3(math3.gimbal({x:-0.5*this.#scale.x+0, y:0, z:-0.5*this.#scale.z+0}, this.#rotation, this.#rotFormat), this.#position),
            math3.addVec3(math3.gimbal({x:-0.5*this.#scale.x+0, y:0, z:0.5*this.#scale.z+0}, this.#rotation, this.#rotFormat), this.#position),
            math3.addVec3(math3.gimbal({x:0.5*this.#scale.x+0, y:0, z:-0.5*this.#scale.z+0}, this.#rotation, this.#rotFormat), this.#position),
        ]; 
        this.#triangles = [
            [
                //1, 2, 3
                //2, 1, 4
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:{r:0, g:0, b:255}, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:{r:0, g:255, b:0}, uv:{x:this.#UV.x, y:0}},
                {x:this.#vertexPositions[2].x, y:this.#vertexPositions[2].y, z:this.#vertexPositions[2].z, color:{r:255, g:0, b:0}, uv:{x:this.#UV.x, y:this.#UV.y}},
            ],[
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:{r:0, g:150, b:0}, uv:{x:this.#UV.x, y:0}},
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:{r:0, g:0, b:150}, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:{r:150, g:150, b:150}, uv:{x:0, y:0}},
            ]
        ]
    }

    updatePosition(position){
        this.#position = position;
        this.#updateVertexPositions();
    }
    updateRotation(rotation){
        this.#rotation.x = this.lockedAxis.x ? this.#rotation.x : rotation.x;
        this.#rotation.y = this.lockedAxis.y ? this.#rotation.y : rotation.y;
        this.#rotation.z = this.lockedAxis.z ? this.#rotation.z : rotation.z;
        this.#updateVertexPositions();
    }
    updateScale(scale){
        this.#scale = scale;
        this.#updateVertexPositions();
    }
    getRotation(){return this.#rotation};
    getPosition(){return this.#position};
    getScale(){return this.#scale};
    getTriangles(){return this.#triangles};
    getVertexPositions(){return this.#vertexPositions};
    getTexture(){return this.#texture};
    
}


