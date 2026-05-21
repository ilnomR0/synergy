import { Plane } from "./plane";

export class Cube extends Plane{

    constructor({velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}},tint={r:0, g:0, b:0}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, texture, UV={x:1,y:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        super({velocity, tint, position, scale, texture, UV, rotation, rotFormat})
    }

    #updateVertexPositions() {
        const scale = this.getScale();
        const rotation = this.getRotation();
        const rotFormat = this.getRotFormat();
        const position = this.getPosition();

        // 8 Corners of the cube
        vertexPositions = [
            math3.addVec3(math3.gimbal({x:  0.5*scale.x, y:  0.5*scale.y, z:  0.5*scale.z}, rotation, rotFormat), position), // 0: Top-Right-Front
            math3.addVec3(math3.gimbal({x: -0.5*scale.x, y:  0.5*scale.y, z:  0.5*scale.z}, rotation, rotFormat), position), // 1: Top-Left-Front
            math3.addVec3(math3.gimbal({x: -0.5*scale.x, y: -0.5*scale.y, z:  0.5*scale.z}, rotation, rotFormat), position), // 2: Bottom-Left-Front
            math3.addVec3(math3.gimbal({x:  0.5*scale.x, y: -0.5*scale.y, z:  0.5*scale.z}, rotation, rotFormat), position), // 3: Bottom-Right-Front
            math3.addVec3(math3.gimbal({x:  0.5*scale.x, y:  0.5*scale.y, z: -0.5*scale.z}, rotation, rotFormat), position), // 4: Top-Right-Back
            math3.addVec3(math3.gimbal({x: -0.5*scale.x, y:  0.5*scale.y, z: -0.5*scale.z}, rotation, rotFormat), position), // 5: Top-Left-Back
            math3.addVec3(math3.gimbal({x: -0.5*scale.x, y: -0.5*scale.y, z: -0.5*scale.z}, rotation, rotFormat), position), // 6: Bottom-Left-Back
            math3.addVec3(math3.gimbal({x:  0.5*scale.x, y: -0.5*scale.y, z: -0.5*scale.z}, rotation, rotFormat), position), // 7: Bottom-Right-Back
        ]; 

        // 12 Triangles (6 faces * 2 triangles), fully written out
        triangles = [
            // --- FRONT FACE (+z) ---
            [
                {x:vertexPositions[0].x, y:vertexPositions[0].y, z:vertexPositions[0].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[1].x, y:vertexPositions[1].y, z:vertexPositions[1].z, color:tint, uv:{x:0, y:UV.y}},
                {x:vertexPositions[2].x, y:vertexPositions[2].y, z:vertexPositions[2].z, color:tint, uv:{x:0, y:0}},
            ],[
                {x:vertexPositions[0].x, y:vertexPositions[0].y, z:vertexPositions[0].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[2].x, y:vertexPositions[2].y, z:vertexPositions[2].z, color:tint, uv:{x:0, y:0}},
                {x:vertexPositions[3].x, y:vertexPositions[3].y, z:vertexPositions[3].z, color:tint, uv:{x:UV.x, y:0}},
            ],
            // --- BACK FACE (-z) ---
            [
                {x:vertexPositions[5].x, y:vertexPositions[5].y, z:vertexPositions[5].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[4].x, y:vertexPositions[4].y, z:vertexPositions[4].z, color:tint, uv:{x:0, y:UV.y}},
                {x:vertexPositions[7].x, y:vertexPositions[7].y, z:vertexPositions[7].z, color:tint, uv:{x:0, y:0}},
            ],[
                {x:vertexPositions[5].x, y:vertexPositions[5].y, z:vertexPositions[5].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[7].x, y:vertexPositions[7].y, z:vertexPositions[7].z, color:tint, uv:{x:0, y:0}},
                {x:vertexPositions[6].x, y:vertexPositions[6].y, z:vertexPositions[6].z, color:tint, uv:{x:UV.x, y:0}},
            ],
            // --- TOP FACE (+y) ---
            [
                {x:vertexPositions[4].x, y:vertexPositions[4].y, z:vertexPositions[4].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[5].x, y:vertexPositions[5].y, z:vertexPositions[5].z, color:tint, uv:{x:0, y:UV.y}},
                {x:vertexPositions[1].x, y:vertexPositions[1].y, z:vertexPositions[1].z, color:tint, uv:{x:0, y:0}},
            ],[
                {x:vertexPositions[4].x, y:vertexPositions[4].y, z:vertexPositions[4].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[1].x, y:vertexPositions[1].y, z:vertexPositions[1].z, color:tint, uv:{x:0, y:0}},
                {x:vertexPositions[0].x, y:vertexPositions[0].y, z:vertexPositions[0].z, color:tint, uv:{x:UV.x, y:0}},
            ],
            // --- BOTTOM FACE (-y) ---
            [
                {x:vertexPositions[3].x, y:vertexPositions[3].y, z:vertexPositions[3].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[2].x, y:vertexPositions[2].y, z:vertexPositions[2].z, color:tint, uv:{x:0, y:UV.y}},
                {x:vertexPositions[6].x, y:vertexPositions[6].y, z:vertexPositions[6].z, color:tint, uv:{x:0, y:0}},
            ],[
                {x:vertexPositions[3].x, y:vertexPositions[3].y, z:vertexPositions[3].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[6].x, y:vertexPositions[6].y, z:vertexPositions[6].z, color:tint, uv:{x:0, y:0}},
                {x:vertexPositions[7].x, y:vertexPositions[7].y, z:vertexPositions[7].z, color:tint, uv:{x:UV.x, y:0}},
            ],
            // --- RIGHT FACE (+x) ---
            [
                {x:vertexPositions[4].x, y:vertexPositions[4].y, z:vertexPositions[4].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[0].x, y:vertexPositions[0].y, z:vertexPositions[0].z, color:tint, uv:{x:0, y:UV.y}},
                {x:vertexPositions[3].x, y:vertexPositions[3].y, z:vertexPositions[3].z, color:tint, uv:{x:0, y:0}},
            ],[
                {x:vertexPositions[4].x, y:vertexPositions[4].y, z:vertexPositions[4].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[3].x, y:vertexPositions[3].y, z:vertexPositions[3].z, color:tint, uv:{x:0, y:0}},
                {x:vertexPositions[7].x, y:vertexPositions[7].y, z:vertexPositions[7].z, color:tint, uv:{x:UV.x, y:0}},
            ],
            // --- LEFT FACE (-x) ---
            [
                {x:vertexPositions[1].x, y:vertexPositions[1].y, z:vertexPositions[1].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[5].x, y:vertexPositions[5].y, z:vertexPositions[5].z, color:tint, uv:{x:0, y:UV.y}},
                {x:vertexPositions[6].x, y:vertexPositions[6].y, z:vertexPositions[6].z, color:tint, uv:{x:0, y:0}},
            ],[
                {x:vertexPositions[1].x, y:vertexPositions[1].y, z:vertexPositions[1].z, color:tint, uv:{x:UV.x, y:UV.y}},
                {x:vertexPositions[6].x, y:vertexPositions[6].y, z:vertexPositions[6].z, color:tint, uv:{x:0, y:0}},
                {x:vertexPositions[2].x, y:vertexPositions[2].y, z:vertexPositions[2].z, color:tint, uv:{x:UV.x, y:0}},
            ]
        ];
    }
}
