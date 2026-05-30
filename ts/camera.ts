import type { Vec3 } from "./types.js";
import * as Math3 from "./3dMath.js";

export class Camera extends Object {
    position: Vec3 = { x: 0, y: 0, z: 0 };
    rotation: Vec3 = { x: 0, y: 0, z: 0 };
    fov: number = 150;

    constructor() { 
        super();
    }

    transformPoints(point: Vec3): Vec3 {
        return Math3.gimbal({
            x: point.x - this.position.x,
            y: point.y - this.position.y,
            z: point.z - this.position.z,
        }, this.rotation, "yxz");
    }

    getFactor(): number {
        return 1 / Math.tan(this.fov * (Math.PI / 180) / 2);
    }

    getPosition(): Vec3 { return this.position; }
    getRotation(): Vec3 { return this.rotation; }
}
