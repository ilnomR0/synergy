import * as math3 from "../3dMath.js";

export class Plane{
    constructor({position, scale, texture, UV, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        this.position = position;
        this.scale = scale;
        this.texture = texture;
        this.rotation = rotation;
        this.rotFormat= rotFormat;
        this.vertexPositions = [
            math3.gimbal({x:0.5*this.scale.x+this.position.x, y:this.position.y, z:0.5*this.scale.z+this.position.z}, this.rotation, rotFormat),
            math3.gimbal({x:-0.5*this.scale.x+this.position.x, y:this.position.y, z:-0.5*this.scale.z+this.position.z}, this.rotation, rotFormat),
            math3.gimbal({x:-0.5*this.scale.x+this.position.x, y:this.position.y, z:0.5*this.scale.z+this.position.z}, this.rotation, rotFormat),
            math3.gimbal({x:0.5*this.scale.x+this.position.x, y:this.position.y, z:-0.5*this.scale.z+this.position.z}, this.rotation, rotFormat),
        ]; 
        this.triangles = [
            [
                //1, 2, 3
                //2, 1, 4
                {x:this.vertexPositions[0].x, y:this.vertexPositions[0].y, z:this.vertexPositions[0].z, color:{r:0, g:0, b:255}, uv:{x:0, y:UV.y}},
                {x:this.vertexPositions[1].x, y:this.vertexPositions[1].y, z:this.vertexPositions[1].z, color:{r:0, g:255, b:0}, uv:{x:UV.x, y:0}},
                {x:this.vertexPositions[2].x, y:this.vertexPositions[2].y, z:this.vertexPositions[2].z, color:{r:255, g:0, b:0}, uv:{x:UV.x, y:UV.y}},
            ],[
                {x:this.vertexPositions[1].x, y:this.vertexPositions[1].y, z:this.vertexPositions[1].z, color:{r:0, g:150, b:0}, uv:{x:UV.x, y:0}},
                {x:this.vertexPositions[0].x, y:this.vertexPositions[0].y, z:this.vertexPositions[0].z, color:{r:0, g:0, b:150}, uv:{x:0, y:UV.y}},
                {x:this.vertexPositions[3].x, y:this.vertexPositions[3].y, z:this.vertexPositions[3].z, color:{r:150, g:150, b:150}, uv:{x:0, y:0}},
            ]
        ]
    }

    render(drw){
        drw.triangleTex(this.triangles[0], this.texture);
        drw.triangleTex(this.triangles[1], this.texture);
    }

}
