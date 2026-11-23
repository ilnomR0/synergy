import type { Vec3, Color } from "@/types.ts";
import * as math3 from "@syngyne/3dMath.ts";
import { Particle } from "@objects/particle.ts";
import type { Object } from "@objects/object.ts";

export class ParticleGenerator {
    private particles: Particle[] = [];
    private position: Vec3 = { x: 0, y: 0, z: 0 };
    private particleCount: number = 10;
    private maxLifetime: number = 10;
    private minLifetime: number = 20;
    private textures: ImageData[] = [];
    private facingObject!: Object;
    private particleRate: number = 1;
    private tint: Color = { r: 0, g: 0, b: 0 };
    static readonly isParticleGenerator = true;

    constructor({
        tint = { r: 0, g: 0, b: 0 },
            particleRate = 2,
            position = { x: 0, y: 0, z: 0 },
            particleCount = 10,
            maxLifetime = 10,
            minLifetime = 0,
            textures = [],
            facingObject 
    }: {
        tint?: Color;
        particleRate?: number;
        position?: Vec3;
        particleCount?: number;
        maxLifetime?: number;
        minLifetime?: number;
        textures?: ImageData[];
        facingObject: Object;
    }) {
        this.particleCount = particleCount;
        this.position = position;
        this.maxLifetime = maxLifetime;
        this.minLifetime = minLifetime;
        this.textures = textures;
        this.facingObject = facingObject;
        this.particleRate = particleRate;
        this.tint = tint;
    }

    render(): void {
        for (let i = 0; i < this.particleRate; i++) {
            if (this.particles.length < this.particleCount) {
                this.particles.push(new Particle({
                    position: math3.addVec3(this.position, { x: (Math.random() * 2) + 1, z: (Math.random() * 10) + 5, y: 0 }),
                    lifetime: ~~(Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime),
                    texture: this.textures[~~(Math.random() * this.textures.length)],
                    facingObject: this.facingObject,
                    tint: this.tint,
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
        for (const particle of this.particles) {
            if (particle.getLife() > 0) {
                particle.tickLife();
                particle.render();
                continue;
            } else {
                particle.destructor();
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        }
    }
}
