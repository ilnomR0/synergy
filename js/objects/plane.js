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
var _Plane_instances, _Plane_UV, _Plane_texture, _Plane_vertexPositions, _Plane_triangles, _Plane_tint, _Plane_updateVertexPositions;
import * as math3 from "../3dMath.js";
import { Object } from "./object.js";
export class Plane extends Object {
    constructor({ velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, tint = { r: 0, g: 0, b: 0 }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 0.1, z: 1 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" }) {
        super({ position, scale, rotation, velocity, rotFormat });
        _Plane_instances.add(this);
        _Plane_UV.set(this, { x: 1, y: 1 });
        _Plane_texture.set(this, void 0);
        _Plane_vertexPositions.set(this, void 0);
        _Plane_triangles.set(this, void 0);
        _Plane_tint.set(this, void 0);
        __classPrivateFieldSet(this, _Plane_texture, texture, "f");
        __classPrivateFieldSet(this, _Plane_UV, UV, "f");
        __classPrivateFieldSet(this, _Plane_tint, tint, "f");
        __classPrivateFieldGet(this, _Plane_instances, "m", _Plane_updateVertexPositions).call(this);
        this.lockedAxis = {
            x: false,
            y: false,
            z: false
        };
    }
    render(drw) {
        drw.triangleTex(__classPrivateFieldGet(this, _Plane_triangles, "f")[0], __classPrivateFieldGet(this, _Plane_texture, "f"));
        drw.triangleTex(__classPrivateFieldGet(this, _Plane_triangles, "f")[1], __classPrivateFieldGet(this, _Plane_texture, "f"));
    }
    updatePosition(position) {
        super.updatePosition(position);
        __classPrivateFieldGet(this, _Plane_instances, "m", _Plane_updateVertexPositions).call(this);
    }
    updateRotation(rotation) {
        super.updateRotation(rotation);
        __classPrivateFieldGet(this, _Plane_instances, "m", _Plane_updateVertexPositions).call(this);
    }
    updateScale(scale) {
        super.updateScale(scale);
        __classPrivateFieldGet(this, _Plane_instances, "m", _Plane_updateVertexPositions).call(this);
    }
    updateTexture(texture) {
        __classPrivateFieldSet(this, _Plane_texture, texture, "f");
        __classPrivateFieldGet(this, _Plane_instances, "m", _Plane_updateVertexPositions).call(this);
    }
    applyVelocity() {
        super.applyVelocity();
        __classPrivateFieldGet(this, _Plane_instances, "m", _Plane_updateVertexPositions).call(this);
    }
    getTriangles() { return __classPrivateFieldGet(this, _Plane_triangles, "f"); }
    getVertexPositions() { return __classPrivateFieldGet(this, _Plane_vertexPositions, "f"); }
    getTexture() { return __classPrivateFieldGet(this, _Plane_texture, "f"); }
}
_Plane_UV = new WeakMap(), _Plane_texture = new WeakMap(), _Plane_vertexPositions = new WeakMap(), _Plane_triangles = new WeakMap(), _Plane_tint = new WeakMap(), _Plane_instances = new WeakSet(), _Plane_updateVertexPositions = function _Plane_updateVertexPositions() {
    const scale = this.getScale();
    const rotation = this.getRotation();
    const rotFormat = this.getRotFormat();
    const position = this.getPosition();
    __classPrivateFieldSet(this, _Plane_vertexPositions, [
        math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: 0, z: 0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: 0, z: -0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: 0, z: 0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: 0, z: -0.5 * scale.z }, rotation, rotFormat), position),
    ], "f");
    __classPrivateFieldSet(this, _Plane_triangles, [
        [
            { x: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[0].x, y: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[0].y, z: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[0].z, color: __classPrivateFieldGet(this, _Plane_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Plane_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Plane_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Plane_UV, "f").x, y: 0 } },
            { x: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[2].x, y: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[2].y, z: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[2].z, color: __classPrivateFieldGet(this, _Plane_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Plane_UV, "f").x, y: __classPrivateFieldGet(this, _Plane_UV, "f").y } },
        ], [
            { x: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Plane_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Plane_UV, "f").x, y: 0 } },
            { x: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[0].x, y: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[0].y, z: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[0].z, color: __classPrivateFieldGet(this, _Plane_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Plane_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[3].x, y: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[3].y, z: __classPrivateFieldGet(this, _Plane_vertexPositions, "f")[3].z, color: __classPrivateFieldGet(this, _Plane_tint, "f"), uv: { x: 0, y: 0 } },
        ]
    ], "f");
};
//# sourceMappingURL=plane.js.map