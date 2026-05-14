import {Camera} from "./camera.js";

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
        this.speed = 1.5;
        this.velocity = {
            x:0,
            y:0,
            z:0
        }
        this.sensitivity = 70;
        this.mouseSensitivity = this.sensitivity/50;
        this.straif = 2;
        this.jumpForce = 10;
        this.timesJumped = 0;
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
        });
    }
    controlCharacter(dt) {
        const currentSpeed = this.speed;
        const currentSensitivity = this.sensitivity*5 * dt;

        if (this.activeKeys["a"]) {
            this.velocity.z += Math.cos((this.rotation.y - 90) * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
            this.velocity.x += Math.sin((this.rotation.y - 90) * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
            this.#camera.rotation.z+=dt*50;
        }
        if (this.activeKeys["d"]) {
            this.velocity.z += Math.cos((this.rotation.y + 90) * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
            this.velocity.x += Math.sin((this.rotation.y + 90) * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
            this.#camera.rotation.z-=dt*50;
        }
        if (this.activeKeys[" "] && this.onGround && this.timesJumped==0) {
            this.velocity.y = -this.jumpForce;
            this.timesJumped++;
        }else if(!this.activeKeys[" "] && this.timesJumped > 0 && this.onGround){
            this.timesJumped--
        }
        if (this.activeKeys["w"]) {
            this.velocity.z += Math.cos(this.rotation.y * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
            this.velocity.x += Math.sin(this.rotation.y * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
        }
        if (this.activeKeys["s"]) {
            this.velocity.z -= Math.cos(this.rotation.y * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
            this.velocity.x -= Math.sin(this.rotation.y * Math.PI / 180) * currentSpeed/(this.onGround ? 1 : this.straif);
        }
        if (this.activeKeys["ArrowLeft"]) {
            this.rotation.y -= currentSensitivity;
        }
        if (this.activeKeys["ArrowRight"]) {
            this.rotation.y += currentSensitivity;
        }
        if (this.activeKeys["ArrowUp"]) {
            this.#camera.rotation.x += currentSensitivity;
        }
        if (this.activeKeys["ArrowDown"]) {
            this.#camera.rotation.x -= currentSensitivity;
        }
        if(this.activeKeys['p']) {
            this.#camera.fov++;
            console.log(this.#camera.fov);
        }
        if(this.activeKeys[';']){
            this.#camera.fov--;
            console.log(this.#camera.fov);
        }


        this.#camera.position = this.position;
        this.#camera.rotation.y = this.rotation.y;
        this.#camera.rotation.z /=1.18;
    }
    getCamera(){
        return this.#camera;
    }

}
