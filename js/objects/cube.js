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
var _Cube_instances, _Cube_UV, _Cube_texture, _Cube_vertexPositions, _Cube_triangles, _Cube_tint, _Cube_updateVertexPositions;
import * as math3 from "../3dMath.js";
import { Object } from "./object.js";
export class Cube extends Object {
    constructor({ velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, tint = { r: 0, g: 0, b: 0 }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, texture, UV = { x: 1, y: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" }) {
        super({ position, scale, rotation, velocity, rotFormat });
        _Cube_instances.add(this);
        _Cube_UV.set(this, { x: 1, y: 1 });
        _Cube_texture.set(this, void 0);
        _Cube_vertexPositions.set(this, void 0);
        _Cube_triangles.set(this, void 0);
        _Cube_tint.set(this, void 0);
        __classPrivateFieldSet(this, _Cube_texture, texture, "f");
        __classPrivateFieldSet(this, _Cube_UV, UV, "f");
        __classPrivateFieldSet(this, _Cube_tint, tint, "f");
        __classPrivateFieldGet(this, _Cube_instances, "m", _Cube_updateVertexPositions).call(this);
        this.lockedAxis = {
            x: false,
            y: false,
            z: false
        };
    }
    render(drw) {
        for (let i = 0; i < __classPrivateFieldGet(this, _Cube_triangles, "f").length; i++) {
            drw.triangleTex(__classPrivateFieldGet(this, _Cube_triangles, "f")[i], __classPrivateFieldGet(this, _Cube_texture, "f"));
        }
    }
}
_Cube_UV = new WeakMap(), _Cube_texture = new WeakMap(), _Cube_vertexPositions = new WeakMap(), _Cube_triangles = new WeakMap(), _Cube_tint = new WeakMap(), _Cube_instances = new WeakSet(), _Cube_updateVertexPositions = function _Cube_updateVertexPositions() {
    const scale = this.getScale();
    const rotation = this.getRotation();
    const rotFormat = this.getRotFormat();
    const position = this.getPosition();
    __classPrivateFieldSet(this, _Cube_vertexPositions, [
        math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: 0.5 * scale.y, z: 0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: 0.5 * scale.y, z: 0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: -0.5 * scale.y, z: 0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: -0.5 * scale.y, z: 0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: 0.5 * scale.y, z: -0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: 0.5 * scale.y, z: -0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: -0.5 * scale.x, y: -0.5 * scale.y, z: -0.5 * scale.z }, rotation, rotFormat), position),
        math3.addVec3(math3.gimbal({ x: 0.5 * scale.x, y: -0.5 * scale.y, z: -0.5 * scale.z }, rotation, rotFormat), position),
    ], "f");
    __classPrivateFieldSet(this, _Cube_triangles, [
        // FRONT FACE (+z)
        [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
        ], [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: 0 } },
        ],
        // BACK FACE (-z)
        [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
        ], [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: 0 } },
        ],
        // TOP FACE (+y)
        [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
        ], [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: 0 } },
        ],
        // BOTTOM FACE (-y)
        [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
        ], [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: 0 } },
        ],
        // RIGHT FACE (+x)
        [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[0].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
        ], [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[4].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[3].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[7].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: 0 } },
        ],
        // LEFT FACE (-x)
        [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[5].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
        ], [
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[1].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: __classPrivateFieldGet(this, _Cube_UV, "f").y } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[6].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: 0, y: 0 } },
            { x: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].x, y: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].y, z: __classPrivateFieldGet(this, _Cube_vertexPositions, "f")[2].z, color: __classPrivateFieldGet(this, _Cube_tint, "f"), uv: { x: __classPrivateFieldGet(this, _Cube_UV, "f").x, y: 0 } },
        ]
    ], "f");
};
//# sourceMappingURL=cube.js.map