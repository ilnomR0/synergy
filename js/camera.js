import * as Math3 from "./3dMath.js";

export class Camera{
    constructor(){
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
        this.fov = 150;
    }

    transformPoints(point){
        return Math3.gimbal({
            x:point.x - this.position.x,
            y: point.y - this.position.y,
            z: point.z - this.position.z,
        }, this.rotation, "yxz");
    }

    getFactor(){
        return 1 / Math.tan(this.fov *(Math.PI/180)/2);
    }

    //merely here for compatibility with billboard and such. I have nothing wrong with position and rotation being public
    getPosition(){return this.position};
    getRotation(){return this.rotation};
}
