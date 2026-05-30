var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ParticleGenerator_particles, _ParticleGenerator_position, _ParticleGenerator_particleCount, _ParticleGenerator_maxLifetime, _ParticleGenerator_minLifetime, _ParticleGenerator_textures, _ParticleGenerator_facingObject, _ParticleGenerator_particleRate, _ParticleGenerator_tint;
import * as math3 from "../3dMath.js";
import { Particle } from "./particle.js";
export class ParticleGenerator {
    constructor({ tint = { r: 0, g: 0, b: 0 }, particleRate = 2, position = { x: 0, y: 0, z: 0 }, particleCount = 10, maxLifetime = 10, minLifetime = 0, textures = [], facingObject }) {
        _ParticleGenerator_particles.set(this, []);
        _ParticleGenerator_position.set(this, { x: 0, y: 0, z: 0 });
        _ParticleGenerator_particleCount.set(this, 10);
        _ParticleGenerator_maxLifetime.set(this, 10);
        _ParticleGenerator_minLifetime.set(this, 20);
        _ParticleGenerator_textures.set(this, []);
        _ParticleGenerator_facingObject.set(this, void 0);
        _ParticleGenerator_particleRate.set(this, 1);
        _ParticleGenerator_tint.set(this, { r: 0, g: 0, b: 0 });
        __classPrivateFieldSet(this, _ParticleGenerator_particleCount, particleCount, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_position, position, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_maxLifetime, maxLifetime, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_minLifetime, minLifetime, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_textures, textures, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_facingObject, facingObject, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_particleRate, particleRate, "f");
        __classPrivateFieldSet(this, _ParticleGenerator_tint, tint, "f");
    }
    render(syn) {
        for (let i = 0; i < __classPrivateFieldGet(this, _ParticleGenerator_particleRate, "f"); i++) {
            if (__classPrivateFieldGet(this, _ParticleGenerator_particles, "f").length < __classPrivateFieldGet(this, _ParticleGenerator_particleCount, "f")) {
                __classPrivateFieldGet(this, _ParticleGenerator_particles, "f").push(new Particle({
                    position: math3.addVec3(__classPrivateFieldGet(this, _ParticleGenerator_position, "f"), { x: (Math.random() * 2) + 1, z: (Math.random() * 10) + 5, y: 0 }),
                    lifetime: ~~(Math.random() * (__classPrivateFieldGet(this, _ParticleGenerator_maxLifetime, "f") - __classPrivateFieldGet(this, _ParticleGenerator_minLifetime, "f")) + __classPrivateFieldGet(this, _ParticleGenerator_minLifetime, "f")),
                    texture: __classPrivateFieldGet(this, _ParticleGenerator_textures, "f")[~~(Math.random() * __classPrivateFieldGet(this, _ParticleGenerator_textures, "f").length)],
                    facingObject: __classPrivateFieldGet(this, _ParticleGenerator_facingObject, "f"),
                    tint: __classPrivateFieldGet(this, _ParticleGenerator_tint, "f"),
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
        for (const particle of __classPrivateFieldGet(this, _ParticleGenerator_particles, "f")) {
            if (particle.getLife() > 0) {
                particle.tickLife();
                particle.render(syn);
                continue;
            }
            else {
                __classPrivateFieldGet(this, _ParticleGenerator_particles, "f").splice(__classPrivateFieldGet(this, _ParticleGenerator_particles, "f").indexOf(particle), 1);
            }
        }
    }
}
_ParticleGenerator_particles = new WeakMap(), _ParticleGenerator_position = new WeakMap(), _ParticleGenerator_particleCount = new WeakMap(), _ParticleGenerator_maxLifetime = new WeakMap(), _ParticleGenerator_minLifetime = new WeakMap(), _ParticleGenerator_textures = new WeakMap(), _ParticleGenerator_facingObject = new WeakMap(), _ParticleGenerator_particleRate = new WeakMap(), _ParticleGenerator_tint = new WeakMap();
//# sourceMappingURL=particleGenerator.js.map