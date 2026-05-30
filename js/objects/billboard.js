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
var _Billboard_facingObject;
import { Plane } from "./plane.js";
export class Billboard extends Plane {
    constructor({ tint = { r: 0, g: 0, b: 0 }, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz", facingObject }) {
        super({ position, scale, texture, UV, rotation, rotFormat, velocity, tint });
        _Billboard_facingObject.set(this, void 0);
        __classPrivateFieldSet(this, _Billboard_facingObject, facingObject, "f");
    }
    render(syn) {
        const ourPos = this.getPosition();
        const theirPos = __classPrivateFieldGet(this, _Billboard_facingObject, "f").getPosition();
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
    getFacingObject() { return __classPrivateFieldGet(this, _Billboard_facingObject, "f"); }
}
_Billboard_facingObject = new WeakMap();
//# sourceMappingURL=billboard.js.map