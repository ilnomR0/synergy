import * as Math3 from "./3dMath.js";
export class Camera extends Object {
    constructor() {
        super();
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.fov = 150;
    }
    transformPoints(point) {
        return Math3.gimbal({
            x: point.x - this.position.x,
            y: point.y - this.position.y,
            z: point.z - this.position.z,
        }, this.rotation, "yxz");
    }
    getFactor() {
        return 1 / Math.tan(this.fov * (Math.PI / 180) / 2);
    }
    getPosition() { return this.position; }
    getRotation() { return this.rotation; }
}
//# sourceMappingURL=camera.js.map