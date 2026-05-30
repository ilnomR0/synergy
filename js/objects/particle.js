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
var _Particle_lifetime;
import { Billboard } from "./billboard.js";
export class Particle extends Billboard {
    constructor({ tint = { r: 0, g: 0, b: 0 }, velocity = { position: { x: 0, y: -0.01, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 0.3, y: 0.3, z: 0.3 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz", facingObject, lifetime = 100 }) {
        super({ tint, velocity, position, scale, texture, UV, rotation, rotFormat, facingObject });
        _Particle_lifetime.set(this, void 0);
        __classPrivateFieldSet(this, _Particle_lifetime, lifetime, "f");
    }
    render(syn) {
        this.applyVelocity();
        super.render(syn);
    }
    tickLife() { var _a; __classPrivateFieldSet(this, _Particle_lifetime, (_a = __classPrivateFieldGet(this, _Particle_lifetime, "f"), _a--, _a), "f"); }
    getLife() { return __classPrivateFieldGet(this, _Particle_lifetime, "f"); }
}
_Particle_lifetime = new WeakMap();
//# sourceMappingURL=particle.js.map