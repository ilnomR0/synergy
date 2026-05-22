import { Plane } from "./plane";

export class Cube extends Object{

    #UV = {x:1, y:1};
    #texture;

    #vertexPositions;
    #triangles;
    #tint; 

    constructor({velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}},tint={r:0, g:0, b:0}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, texture, UV={x:1,y:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        super({position, scale, velocity, rotation, rotFormat})
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
        drw.triangleTex(this.#triangles[2], this.#texture);
        drw.triangleTex(this.#triangles[3], this.#texture);
        drw.triangleTex(this.#triangles[4], this.#texture);
        drw.triangleTex(this.#triangles[6], this.#texture);
    }
    
    #updateVertexPositions() {
        const scale = this.getScale();
        const rotation = this.getRotation();
        const rotFormat = this.getRotFormat();
        const position = this.getPosition();

        // 8 Corners of the cube
        this.#vertexPositions = [
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
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[2].x, y:this.#vertexPositions[2].y, z:this.#vertexPositions[2].z, color:this.#tint, uv:{x:0, y:0}},
            ],[
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[2].x, y:this.#vertexPositions[2].y, z:this.#vertexPositions[2].z, color:this.#tint, uv:{x:0, y:0}},
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
            ],
            // --- BACK FACE (-z) ---
            [
                {x:this.#vertexPositions[5].x, y:this.#vertexPositions[5].y, z:this.#vertexPositions[5].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[4].x, y:this.#vertexPositions[4].y, z:this.#vertexPositions[4].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[7].x, y:this.#vertexPositions[7].y, z:this.#vertexPositions[7].z, color:this.#tint, uv:{x:0, y:0}},
            ],[
                {x:this.#vertexPositions[5].x, y:this.#vertexPositions[5].y, z:this.#vertexPositions[5].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[7].x, y:this.#vertexPositions[7].y, z:this.#vertexPositions[7].z, color:this.#tint, uv:{x:0, y:0}},
                {x:this.#vertexPositions[6].x, y:this.#vertexPositions[6].y, z:this.#vertexPositions[6].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
            ],
            // --- TOP FACE (+y) ---
            [
                {x:this.#vertexPositions[4].x, y:this.#vertexPositions[4].y, z:this.#vertexPositions[4].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[5].x, y:this.#vertexPositions[5].y, z:this.#vertexPositions[5].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:0, y:0}},
            ],[
                {x:this.#vertexPositions[4].x, y:this.#vertexPositions[4].y, z:this.#vertexPositions[4].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:0, y:0}},
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
            ],
            // --- BOTTOM FACE (-y) ---
            [
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[2].x, y:this.#vertexPositions[2].y, z:this.#vertexPositions[2].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[6].x, y:this.#vertexPositions[6].y, z:this.#vertexPositions[6].z, color:this.#tint, uv:{x:0, y:0}},
            ],[
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[6].x, y:this.#vertexPositions[6].y, z:this.#vertexPositions[6].z, color:this.#tint, uv:{x:0, y:0}},
                {x:this.#vertexPositions[7].x, y:this.#vertexPositions[7].y, z:this.#vertexPositions[7].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
            ],
            // --- RIGHT FACE (+x) ---
            [
                {x:this.#vertexPositions[4].x, y:this.#vertexPositions[4].y, z:this.#vertexPositions[4].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[0].x, y:this.#vertexPositions[0].y, z:this.#vertexPositions[0].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:this.#tint, uv:{x:0, y:0}},
            ],[
                {x:this.#vertexPositions[4].x, y:this.#vertexPositions[4].y, z:this.#vertexPositions[4].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[3].x, y:this.#vertexPositions[3].y, z:this.#vertexPositions[3].z, color:this.#tint, uv:{x:0, y:0}},
                {x:this.#vertexPositions[7].x, y:this.#vertexPositions[7].y, z:this.#vertexPositions[7].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
            ],
            // --- LEFT FACE (-x) ---
            [
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[5].x, y:this.#vertexPositions[5].y, z:this.#vertexPositions[5].z, color:this.#tint, uv:{x:0, y:this.#UV.y}},
                {x:this.#vertexPositions[6].x, y:this.#vertexPositions[6].y, z:this.#vertexPositions[6].z, color:this.#tint, uv:{x:0, y:0}},
            ],[
                {x:this.#vertexPositions[1].x, y:this.#vertexPositions[1].y, z:this.#vertexPositions[1].z, color:this.#tint, uv:{x:this.#UV.x, y:this.#UV.y}},
                {x:this.#vertexPositions[6].x, y:this.#vertexPositions[6].y, z:this.#vertexPositions[6].z, color:this.#tint, uv:{x:0, y:0}},
                {x:this.#vertexPositions[2].x, y:this.#vertexPositions[2].y, z:this.#vertexPositions[2].z, color:this.#tint, uv:{x:this.#UV.x, y:0}},
            ]
        ];
    }
}
