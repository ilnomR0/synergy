import type { Vec3, Color } from "../types.js";
import * as math3 from "../3dMath.js";
import { Particle } from "./particle.js";
import type { Object } from "./object.js";
import type { Camera } from "../camera.js";

export class ParticleGenerator {
    #particles: Particle[] = [];
    #position: Vec3 = { x: 0, y: 0, z: 0 };
    #particleCount: number = 10;
    #maxLifetime: number = 10;
    #minLifetime: number = 20;
    #textures: ImageData[] = [];
    #facingObject!: Object|Camera;
    #particleRate: number = 1;
    #tint: Color = { r: 0, g: 0, b: 0 };

    constructor({ tint = { r: 0, g: 0, b: 0 }, particleRate = 2, position = { x: 0, y: 0, z: 0 }, particleCount = 10, maxLifetime = 10, minLifetime = 0, textures = [], facingObject }: {
        tint?: Color;
        particleRate?: number;
        position?: Vec3;
        particleCount?: number;
        maxLifetime?: number;
        minLifetime?: number;
        textures?: ImageData[];
        facingObject: Object|Camera;
    }) {
        this.#particleCount = particleCount;
        this.#position = position;
        this.#maxLifetime = maxLifetime;
        this.#minLifetime = minLifetime;
        this.#textures = textures;
        this.#facingObject = facingObject;
        this.#particleRate = particleRate;
        this.#tint = tint;
    }

    render(syn: { triangleTex: (tri: any, texture: ImageData) => void }): void {
        for (let i = 0; i < this.#particleRate; i++) {
            if (this.#particles.length < this.#particleCount) {
                this.#particles.push(new Particle({
                    position: math3.addVec3(this.#position, { x: (Math.random() * 2) + 1, z: (Math.random() * 10) + 5, y: 0 }),
                    lifetime: ~~(Math.random() * (this.#maxLifetime - this.#minLifetime) + this.#minLifetime),
                    texture: this.#textures[~~(Math.random() * this.#textures.length)],
                    facingObject: this.#facingObject,
                    tint: this.#tint,
                    velocity: {
                        position: {
                            x: ((Math.random() * 10) - 5) / 150,
                            y: -0.05,
                            z: ((Math.random() * 10) - 5) / 150,
                        }, rotation: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    }
                }));
            }
        }
        for (const particle of this.#particles) {
            if (particle.getLife() > 0) {
                particle.tickLife();
                particle.render(syn);
                continue;
            } else {
                this.#particles.splice(this.#particles.indexOf(particle), 1);
            }
        }
    }
}
