import type { Vec3, RotFormat, Velocity } from "./types.js";
import { Camera } from "./camera.js";
import { Object } from "./objects/object.js";
import type { syngyne } from "./syngyne.js";
import * as Math3 from "./3dMath.js";
export class Character extends Object {
    #camera: Camera = new Camera();
    #syn: syngyne;
    activeKeys: Record<string, boolean> = {};
    speed: number = 90;
    sensitivity: number = 40;
    mouseSensitivity: number;
    straif: number = 10;
    jumpForce: number = 15;
    timesJumped: number = 0;
    maxCameraX: [number, number] = [-90, 90];
    pausable: boolean = true;
    oldVelocity: Vec3 = { x: 0, y: 0, z: 0 };
    
    constructor({ syn, velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 2, y: -3, z: 2 }, scale = { x: 0.25, y: 3, z: 0.25 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat }: {
        syn: syngyne;
        velocity?: Velocity;
        position?: Vec3;
        scale?: Vec3;
        rotation?: Vec3;
        rotFormat?: RotFormat;
    }) {
        super({ velocity, rotation, position, scale, rotFormat })
        this.#syn = syn;
        this.mouseSensitivity = this.sensitivity / 40 * (navigator.userAgent.includes("Chrome") ? 0.3 : 1);
        this.#defKeys();
    }

    #defKeys(): void {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            this.activeKeys[e.key] = true;
        });
        document.addEventListener("keyup", (e: KeyboardEvent) => {
            this.activeKeys[e.key] = false;
        });
        document.addEventListener("mousemove", (e: MouseEvent) => {
            if (document.pointerLockElement === this.#syn.getCanvas()) {
                this.#camera.rotation.x -= e.movementY * this.mouseSensitivity;
                this.rotation.y += e.movementX * this.mouseSensitivity;
                this.#camera.rotation.x = Math.max(this.#camera.rotation.x, this.maxCameraX[0]);
                this.#camera.rotation.x = Math.min(this.#camera.rotation.x, this.maxCameraX[1]);
                this.#camera.rotation.z += e.movementX / 50;
            }
        });
    }

    controlCharacter(dt: number, syn: syngyne): void {
        const currentSpeed = this.speed;
        const currentSensitivity = this.sensitivity * 5 * dt;

        if (this.activeKeys["a"]) {
            this.velocity.position.z += Math.cos((this.rotation.y - 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.velocity.position.x += Math.sin((this.rotation.y - 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.#camera.rotation.z += 50 * dt;
        }
        if (this.activeKeys["d"]) {
            this.velocity.position.z += Math.cos((this.rotation.y + 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.velocity.position.x += Math.sin((this.rotation.y + 90) * Math.PI / 180) * (currentSpeed * dt) / (this.onGround ? 1 : this.straif);
            this.#camera.rotation.z -= 50 * dt;
        }
        if (this.activeKeys[" "] && this.onGround && this.timesJumped <= 0) {
            this.velocity.position.y = -this.jumpForce;
            this.oldVelocity.x = this.velocity.position.x;
            this.oldVelocity.y = this.velocity.position.y;
            this.oldVelocity.z = this.velocity.position.z;
            this.timesJumped++;
        } else if (!this.activeKeys[" "] && this.timesJumped > 0 && this.onGround) {
            this.timesJumped--
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
            this.#camera.rotation.x += currentSensitivity;
            this.#camera.rotation.x = Math.max(this.#camera.rotation.x, this.maxCameraX[0]);
            this.#camera.rotation.x = Math.min(this.#camera.rotation.x, this.maxCameraX[1]);
        }
        if (this.activeKeys["ArrowDown"]) {
            this.#camera.rotation.x -= currentSensitivity;
            this.#camera.rotation.x = Math.max(this.#camera.rotation.x, this.maxCameraX[0]);
            this.#camera.rotation.x = Math.min(this.#camera.rotation.x, this.maxCameraX[1]);
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
        } else if (!this.activeKeys["Escape"] && !this.pausable) {
            this.pausable = true;
        }

        this.#camera.position = Math3.addVec3(this.position,{x:0, y:-this.scale.y, z:0});
        this.#camera.rotation.y = this.rotation.y;
        this.#camera.rotation.z *= Math.pow(0.02, dt);
    }

    getCamera(): Camera {
        return this.#camera;
    }
}
