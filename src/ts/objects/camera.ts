import type { Vec3 } from "@/types.ts";
import * as Math3 from "@syngyne/3dMath.ts";
import { Object } from "@objects/object.ts";

export class Camera extends Object {
    public fov: number = 90;
    static readonly isCamera = true;

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
        return 0.25 / Math.tan(this.fov * (Math.PI / 180) / 2);
    }
}
