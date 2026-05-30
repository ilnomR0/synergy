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
var _Object_instances, _Object_vertexPositions, _Object_updateVertexPositions;
import * as math3 from "../3dMath.js";
export class Object {
    constructor({ velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" } = {}) {
        _Object_instances.add(this);
        this.onGround = false;
        this.colliding = false;
        _Object_vertexPositions.set(this, void 0);
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
        this.rotFormat = rotFormat;
        this.velocity = velocity;
        this.lockedAxis = {
            x: false,
            y: false,
            z: false
        };
        __classPrivateFieldSet(this, _Object_vertexPositions, [this.position], "f");
    }
    updatePosition(position) {
        this.position = position;
        __classPrivateFieldSet(this, _Object_vertexPositions, [this.position], "f");
    }
    updateRotation(rotation) {
        this.rotation.x = this.lockedAxis.x ? this.rotation.x : rotation.x;
        this.rotation.y = this.lockedAxis.y ? this.rotation.y : rotation.y;
        this.rotation.z = this.lockedAxis.z ? this.rotation.z : rotation.z;
    }
    updateScale(scale) {
        this.scale = scale;
    }
    updateVelocity(velocity) {
        this.velocity = velocity;
    }
    updateRotFormat(format) {
        if (format.length == 3) {
            this.rotFormat = format;
        }
        else {
            console.error("could not set rotation format: requires length to be 3, (ex: xyz, zyx...))");
        }
    }
    applyVelocity() {
        this.position = math3.addVec3(this.position, this.velocity.position);
        this.rotation.x += this.lockedAxis.x ? 0 : this.velocity.rotation.x;
        this.rotation.y += this.lockedAxis.y ? 0 : this.velocity.rotation.y;
        this.rotation.z += this.lockedAxis.z ? 0 : this.velocity.rotation.z;
    }
    getRotation() { return this.rotation; }
    getPosition() { return this.position; }
    getScale() { return this.scale; }
    getVelocity() { return this.velocity; }
    getRotFormat() { return this.rotFormat; }
    getVertexPositions() { return __classPrivateFieldGet(this, _Object_vertexPositions, "f"); }
}
_Object_vertexPositions = new WeakMap(), _Object_instances = new WeakSet(), _Object_updateVertexPositions = function _Object_updateVertexPositions() {
    __classPrivateFieldSet(this, _Object_vertexPositions, [this.position], "f");
};
//# sourceMappingURL=object.js.map