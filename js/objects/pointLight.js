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
var _PointLight_glowColor, _PointLight_radius;
import { Object } from "./object.js";
export class PointLight extends Object {
    constructor({ radius = 1, glowColor = { r: 255, g: 200, b: 150 }, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" } = {}) {
        super({ velocity, position, scale, rotation, rotFormat });
        _PointLight_glowColor.set(this, void 0);
        _PointLight_radius.set(this, 1);
        __classPrivateFieldSet(this, _PointLight_glowColor, glowColor, "f");
        __classPrivateFieldSet(this, _PointLight_radius, radius, "f");
    }
    render(syn) {
        syn.renderLightSplat(this);
    }
    setRadius(intensity) { __classPrivateFieldSet(this, _PointLight_radius, intensity, "f"); }
    getRadius() { return __classPrivateFieldGet(this, _PointLight_radius, "f"); }
    getColor() { return __classPrivateFieldGet(this, _PointLight_glowColor, "f"); }
}
_PointLight_glowColor = new WeakMap(), _PointLight_radius = new WeakMap();
//# sourceMappingURL=pointLight.js.map