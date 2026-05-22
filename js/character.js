import {Camera} from "./camera.js";
import * as Math3 from "./3dMath.js";
export class Character{
    #camera = new Camera();
    constructor(){
        this.activeKeys = {};
        this.#defKeys();
        this.position = {
            x:2,
            y:-6,
            z:-2
        };
        this.rotation = {
            x:-18, 
            y:55,
            z:0
        }
        this.speed = 150;
        this.velocity = {
            x:0,
            y:0,
            z:0
        }
        this.oldVelocity = {
            x:0,
            y:0,
            z:0
        };
        this.sensitivity = 40;
        this.mouseSensitivity = this.sensitivity/40 * (navigator.userAgent.includes("Chrome") && navigator.userAgentData.platform == "Linux") ? .3 : 1;
        this.straif = 40;
        this.jumpForce = 15;
        this.timesJumped = 0;
        this.maxCameraX = [-90, 90];
        this.pausable = true;
    }
    #defKeys(){
        document.addEventListener("keydown",(e)=>{
            this.activeKeys[e.key] = true;
        });
        document.addEventListener("keyup", (e)=>{
            this.activeKeys[e.key] = false;
        });
        document.addEventListener("mousemove", (e)=>{
            this.#camera.rotation.x -= e.movementY * this.mouseSensitivity;
            this.rotation.y += e.movementX * this.mouseSensitivity;
            this.#camera.rotation.x = Math.max(this.#camera.rotation.x, this.maxCameraX[0]);
            this.#camera.rotation.x = Math.min(this.#camera.rotation.x, this.maxCameraX[1]);
            this.#camera.rotation.z+=e.movementX/50;
        });
    }
    controlCharacter(dt, syn) {
        const currentSpeed = this.speed;
        const currentSensitivity = this.sensitivity*5 * dt;

        if (this.activeKeys["a"]) {
            this.velocity.z += Math.cos((this.rotation.y - 90) * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
            this.velocity.x += Math.sin((this.rotation.y - 90) * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
            this.#camera.rotation.z+=50*dt;
        }
        if (this.activeKeys["d"]) {
            this.velocity.z += Math.cos((this.rotation.y + 90) * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
            this.velocity.x += Math.sin((this.rotation.y + 90) * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
            this.#camera.rotation.z-=50*dt;
        }
        if (this.activeKeys[" "] && this.onGround && this.timesJumped<=0) {
            this.velocity.y = -this.jumpForce;
            this.oldVelocity.x = this.velocity.x;
            this.oldVelocity.y = this.velocity.y;
            this.oldVelocity.z = this.velocity.z;
            this.timesJumped++;
        }else if(!this.activeKeys[" "] && this.timesJumped > 0 && this.onGround){
            this.timesJumped--
        }
        if (this.activeKeys["w"]) {
            this.velocity.z += Math.cos(this.rotation.y * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
            this.velocity.x += Math.sin(this.rotation.y * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
        }
        if (this.activeKeys["s"]) {
            this.velocity.z -= Math.cos(this.rotation.y * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
            this.velocity.x -= Math.sin(this.rotation.y * Math.PI / 180) * (currentSpeed*dt)/(this.onGround ? 1 : this.straif);
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
        if(this.activeKeys['i']) {
            this.sensitivity+=0.1;
        }
        if(this.activeKeys['k']){
            this.sensitivity-=0.1;
        }
        if(this.activeKeys["Escape"] && this.pausable){
            syn.togglePause();
            this.pausable = false;
        }else if(!this.activeKeys["Escape"] && !this.pausable){
            this.pausable = true;
        }

        if(!this.onGround){
            this.velocity.x = Math.sin(this.#camera.rotation.y * Math.PI/180) * avg 
            this.velocity.z = Math.cos(this.#camera.rotation.y * Math.PI/180) * avg
        }

        this.#camera.position = this.position;
        this.#camera.rotation.y = this.rotation.y;
        this.#camera.rotation.z *= Math.pow(0.02, dt);
    }
    getCamera(){
        return this.#camera;
    }
    getPosition(){ return this.position};
    getRotation(){ return this.rotation};
}
