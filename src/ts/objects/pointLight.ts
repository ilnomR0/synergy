import type { Vec3, Color, RotFormat, Velocity } from "@/types.ts";
import { Object } from "@objects/object.ts";

export class PointLight extends Object {
    public glowColor: Color;
    public radius: number = 1;
    public pwrFactor:number = 2;

    constructor({ radius = 1, glowColor = { r: 255, g: 200, b: 150 }, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat, pwrFactor = 2 }: {
        radius?: number;
        glowColor?: Color;
        velocity?: Velocity;
        position?: Vec3;
        scale?: Vec3;
        rotation?: Vec3;
        rotFormat?: RotFormat;
        pwrFactor?: number
    } = {}) {
        super({ velocity, position, scale, rotation, rotFormat });
        this.glowColor = glowColor;
        this.radius = radius;
        this.pwrFactor = pwrFactor;
    }

    render(): void {
        syn.getLighting().lighting(this);
    }

}
