export class Plane{
    constructor({position, scale, texture, UV}){
        this.position = position;
        this.scale = scale;
        this.texture = texture;
        this.rotation = {
            x:0,
            y:0,
            z:0
        }
        this.vertexPositions = [
            {x:0.5*this.scale.x+this.position.x, y:this.position.y, z:0.5*this.scale.z+this.position.z}]; 
        this.triangles = [
            [
                {x:0.5*this.scale.x+this.position.x, y:this.position.y, z:0.5*this.scale.z+this.position.z, color:{r:0, g:0, b:255}, uv:{x:0, y:UV.y}},
                {x:-0.5*this.scale.x+this.position.x, y:this.position.y, z:-0.5*this.scale.z+this.position.z, color:{r:0, g:255, b:0}, uv:{x:UV.x, y:0}},
                {x:-0.5*this.scale.x+this.position.x, y:this.position.y, z:0.5*this.scale.z+this.position.z, color:{r:255, g:0, b:0}, uv:{x:UV.x, y:UV.y}},

            ], 
            [
                {x:-0.5*this.scale.x+this.position.x, y:this.position.y, z:-0.5*this.scale.z, color:{r:0, g:150, b:0}, uv:{x:UV.x, y:0}},
                {x:0.5*this.scale.x+this.position.x, y:this.position.y, z:0.5*this.scale.z+this.position.z, color:{r:0, g:0, b:150}, uv:{x:0, y:UV.y}},
                {x:0.5*this.scale.x+this.position.x, y:this.position.y, z:-0.5*this.scale.z+this.position.z, color:{r:150, g:150, b:150}, uv:{x:0, y:0}},
            ]
        ]
    }

    render(drw){
        drw.triangleTex(this.triangles[0], this.texture);
        drw.triangleTex(this.triangles[1], this.texture);
    }

}
