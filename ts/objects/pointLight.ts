import type { Vec3, Color, RotFormat, Velocity } from "../types.js";
import { Object } from "./object.js";

export class PointLight extends Object {
    #glowColor: Color;
    #radius: number = 1;

    constructor({ radius = 1, glowColor = { r: 255, g: 200, b: 150 }, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat }: {
        radius?: number;
        glowColor?: Color;
        velocity?: Velocity;
        position?: Vec3;
        scale?: Vec3;
        rotation?: Vec3;
        rotFormat?: RotFormat;
    } = {}) {
        super({ velocity, position, scale, rotation, rotFormat });
        this.#glowColor = glowColor;
        this.#radius = radius;
    }

    render(syn: { renderLightSplat: (light: PointLight) => void }): void {
        syn.renderLightSplat(this);
    }

    setRadius(intensity: number): void { this.#radius = intensity; }
    getRadius(): number { return this.#radius; }
    getColor(): Color { return this.#glowColor; }
}
