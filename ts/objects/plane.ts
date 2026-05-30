import type { Vec2, Vec3, Color, RotFormat, Velocity, VertexData } from "../types.js";
import * as math3 from "../3dMath.js";
import { Object } from "./object.js";

export class Plane extends Object {
    #UV: Vec2 = { x: 1, y: 1 };
    #texture: ImageData;
    #vertexPositions!: Vec3[];
    #triangles!: VertexData[][];
    #tint: Color;

    constructor({ velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, tint = { r: 0, g: 0, b: 0 }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 0.1, z: 1 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat }: {
        velocity?: Velocity;
        tint?: Color;
        position?: Vec3;
        scale?: Vec3;
        texture: ImageData;
        UV?: Vec2;
        rotation?: Vec3;
        rotFormat?: RotFormat;
    }) {
        super({ position, scale, rotation, velocity, rotFormat })
        this.#texture = texture;
        this.#UV = UV;
        this.#tint = tint;
        this.#updateVertexPositions();
        this.lockedAxis = {
            x: false,
            y: false,
            z: false
        }
    }

    render(drw: { triangleTex: (tri: VertexData[], texture: ImageData) => void }): void {
        drw.triangleTex(this.#triangles[0], this.#texture);
        drw.triangleTex(this.#triangles[1], this.#texture);
    }

    #updateVertexPositions(): void {
        const scale = this.getScale();
        const rotation = this.getRotation();
        const rotFormat = this.getRotFormat();
        const position = this.getPosition();

        this.#vertexPositions = [
            math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: 0, z: 0.5 * scale.z }, rotation, rotFormat), position),
            math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: 0, z: -0.5 * scale.z }, rotation, rotFormat), position),
            math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: 0, z: 0.5 * scale.z }, rotation, rotFormat), position),
            math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: 0, z: -0.5 * scale.z }, rotation, rotFormat), position),
        ];

        this.#triangles = [
            [
                { x: this.#vertexPositions[0].x, y: this.#vertexPositions[0].y, z: this.#vertexPositions[0].z, color: this.#tint, uv: { x: 0, y: this.#UV.y } },
                { x: this.#vertexPositions[1].x, y: this.#vertexPositions[1].y, z: this.#vertexPositions[1].z, color: this.#tint, uv: { x: this.#UV.x, y: 0 } },
                { x: this.#vertexPositions[2].x, y: this.#vertexPositions[2].y, z: this.#vertexPositions[2].z, color: this.#tint, uv: { x: this.#UV.x, y: this.#UV.y } },
            ], [
                { x: this.#vertexPositions[1].x, y: this.#vertexPositions[1].y, z: this.#vertexPositions[1].z, color: this.#tint, uv: { x: this.#UV.x, y: 0 } },
                { x: this.#vertexPositions[0].x, y: this.#vertexPositions[0].y, z: this.#vertexPositions[0].z, color: this.#tint, uv: { x: 0, y: this.#UV.y } },
                { x: this.#vertexPositions[3].x, y: this.#vertexPositions[3].y, z: this.#vertexPositions[3].z, color: this.#tint, uv: { x: 0, y: 0 } },
            ]
        ]
    }

    updatePosition(position: Vec3): void {
        super.updatePosition(position);
        this.#updateVertexPositions();
    }

    updateRotation(rotation: Vec3): void {
        super.updateRotation(rotation);
        this.#updateVertexPositions();
    }

    updateScale(scale: Vec3): void {
        super.updateScale(scale);
        this.#updateVertexPositions();
    }

    updateTexture(texture: ImageData): void {
        this.#texture = texture;
        this.#updateVertexPositions();
    }

    applyVelocity(): void {
        super.applyVelocity();
        this.#updateVertexPositions();
    }


    getTriangles(): VertexData[][] { return this.#triangles; }
    public getVertexPositions(): Vec3[] { return this.#vertexPositions; }
    getTexture(): ImageData { return this.#texture; }
}
