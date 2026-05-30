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
var _Character_instances, _Character_camera, _Character_syn, _Character_defKeys;
import { Camera } from "./camera.js";
import { Object } from "./objects/object.js";
import * as Math3 from "./3dMath.js";
export class Character extends Object {
    constructor({ syn, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 2, y: -3, z: 2 }, scale = { x: 0.25, y: 3, z: 0.25 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" }) {
        super({ velocity, rotation, position, scale, rotFormat });
        _Character_instances.add(this);
        _Character_camera.set(this, new Camera());
        _Character_syn.set(this, void 0);
        this.activeKeys = {};
        this.speed = 90;
        this.sensitivity = 40;
        this.straif = 10;
        this.jumpForce = 15;
        this.timesJumped = 0;
        this.maxCameraX = [-90, 90];
        this.pausable = true;
        this.oldVelocity = { x: 0, y: 0, z: 0 };
        __classPrivateFieldSet(this, _Character_syn, syn, "f");
        this.mouseSensitivity = this.sensitivity / 40 * (navigator.userAgent.includes("Chrome") ? 0.3 : 1);
        __classPrivateFieldGet(this, _Character_instances, "m", _Character_defKeys).call(this);
    }
    controlCharacter(dt, syn) {
        const currentSpeed = this.speed;
        const currentSensitivity = this.sensitivity * 5 * dt;
        if (this.activeKeys["a"]) {
            this.velocity.position.z += Math.cos((this.rotation.y - 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.velocity.position.x += Math.sin((this.rotation.y - 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.z += 50 * dt;
        }
        if (this.activeKeys["d"]) {
            this.velocity.position.z += Math.cos((this.rotation.y + 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.velocity.position.x += Math.sin((this.rotation.y + 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.z -= 50 * dt;
        }
        if (this.activeKeys[" "] && this.onGround && this.timesJumped <= 0) {
            this.velocity.position.y = -this.jumpForce;
            this.oldVelocity.x = this.velocity.position.x;
            this.oldVelocity.y = this.velocity.position.y;
            this.oldVelocity.z = this.velocity.position.z;
            this.timesJumped++;
        }
        else if (!this.activeKeys[" "] && this.timesJumped > 0 && this.onGround) {
            this.timesJumped--;
        }
        if (this.activeKeys["w"]) {
            this.velocity.position.z += Math.cos(this.rotation.y * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.velocity.position.x += Math.sin(this.rotation.y * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
        }
        if (this.activeKeys["s"]) {
            this.velocity.position.z -= Math.cos(this.rotation.y * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.velocity.position.x -= Math.sin(this.rotation.y * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
        }
        if (this.activeKeys["ArrowLeft"]) {
            this.rotation.y -= currentSensitivity;
        }
        if (this.activeKeys["ArrowRight"]) {
            this.rotation.y += currentSensitivity;
        }
        if (this.activeKeys["ArrowUp"]) {
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x += currentSensitivity;
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x = Math.max(__classPrivateFieldGet(this, _Character_camera, "f").rotation.x, this.maxCameraX[0]);
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x = Math.min(__classPrivateFieldGet(this, _Character_camera, "f").rotation.x, this.maxCameraX[1]);
        }
        if (this.activeKeys["ArrowDown"]) {
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x -= currentSensitivity;
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x = Math.max(__classPrivateFieldGet(this, _Character_camera, "f").rotation.x, this.maxCameraX[0]);
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x = Math.min(__classPrivateFieldGet(this, _Character_camera, "f").rotation.x, this.maxCameraX[1]);
        }
        if (this.activeKeys['i']) {
            this.sensitivity += 0.1;
        }
        if (this.activeKeys['k']) {
            this.sensitivity -= 0.1;
        }
        if (this.activeKeys["Escape"] && this.pausable) {
            syn.togglePause();
            this.pausable = false;
        }
        else if (!this.activeKeys["Escape"] && !this.pausable) {
            this.pausable = true;
        }
        __classPrivateFieldGet(this, _Character_camera, "f").position = Math3.addVec3(this.position, { x: 0, y: -this.scale.y, z: 0 });
        __classPrivateFieldGet(this, _Character_camera, "f").rotation.y = this.rotation.y;
        __classPrivateFieldGet(this, _Character_camera, "f").rotation.z *= Math.pow(0.02, dt);
    }
    getCamera() {
        return __classPrivateFieldGet(this, _Character_camera, "f");
    }
}
_Character_camera = new WeakMap(), _Character_syn = new WeakMap(), _Character_instances = new WeakSet(), _Character_defKeys = function _Character_defKeys() {
    document.addEventListener("keydown", (e) => {
        this.activeKeys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        this.activeKeys[e.key] = false;
    });
    document.addEventListener("mousemove", (e) => {
        if (document.pointerLockElement === __classPrivateFieldGet(this, _Character_syn, "f").getCanvas()) {
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x -= e.movementY * this.mouseSensitivity;
            this.rotation.y += e.movementX * this.mouseSensitivity;
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x = Math.max(__classPrivateFieldGet(this, _Character_camera, "f").rotation.x, this.maxCameraX[0]);
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.x = Math.min(__classPrivateFieldGet(this, _Character_camera, "f").rotation.x, this.maxCameraX[1]);
            __classPrivateFieldGet(this, _Character_camera, "f").rotation.z += e.movementX / 50;
        }
    });
};
//# sourceMappingURL=character.js.map