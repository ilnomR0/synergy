import type { Camera } from "../camera.js";
import type { Vec2, Vec3, Color, RotFormat, Velocity } from "../types.js";
import { Billboard } from "./billboard.js";
import type { Object } from "./object.js";

export class Particle extends Billboard {
    #lifetime: number;

    constructor({ tint = { r: 0, g: 0, b: 0 }, velocity = { position: { x: 0, y: -0.01, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 0.3, y: 0.3, z: 0.3 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat, facingObject, lifetime = 100 }: {
        tint?: Color;
        velocity?: Velocity;
        position?: Vec3;
        scale?: Vec3;
        texture: ImageData;
        UV?: Vec2;
        rotation?: Vec3;
        rotFormat?: RotFormat;
        facingObject: Object|Camera;
        lifetime?: number;
    }) {
        super({ tint, velocity, position, scale, texture, UV, rotation, rotFormat, facingObject })
        this.#lifetime = lifetime;
    }

    render(syn: { triangleTex: (tri: any, texture: ImageData) => void }): void {
        this.applyVelocity();
        super.render(syn);
    }

    tickLife(): void { this.#lifetime--; }
    getLife(): number { return this.#lifetime; }
}
