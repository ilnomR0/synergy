import type { Vec2, Vec3, Color, RotFormat, Velocity } from "../types.js";
import { Plane } from "./plane.js";
import type { Object } from "./object.js";
import type { Camera } from "../camera.js";
export class Billboard extends Plane {
    #facingObject: Object|Camera;

    constructor({ tint = { r: 0, g: 0, b: 0 }, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat, facingObject }: {
        tint?: Color;
        velocity?: Velocity;
        position?: Vec3;
        scale?: Vec3;
        texture: ImageData;
        UV?: Vec2;
        rotation?: Vec3;
        rotFormat?: RotFormat;
        facingObject: Object|Camera;
    }) {
        super({ position, scale, texture, UV, rotation, rotFormat, velocity, tint });
        this.#facingObject = facingObject;
    }

    render(syn: { triangleTex: (tri: any, texture: ImageData) => void }): void {
        const ourPos = this.getPosition();
        const theirPos = this.#facingObject.getPosition();
        const distX = ourPos.x - theirPos.x;
        const distY = ourPos.y - theirPos.y;
        const distZ = ourPos.z - theirPos.z;

        this.updateRotation({
            z: 0,
            x: -Math.atan2(distY, Math.sqrt(distX * distX + distZ * distZ)) * (180 / Math.PI) + 90,
            y: (Math.atan2(distZ, distX) * (180 / Math.PI)) + 90
        });

        super.render(syn);
    }

    getFacingObject(): Object|Camera { return this.#facingObject; }
}
