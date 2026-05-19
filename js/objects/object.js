import * as math3 from "../3dMath.js";


export class Object{

    /** @type {Vec3} the position of this object*/
    #position = {x:0, y:0, z:0};
    /** @type{{position:Vec3, rotation:Vec3} A given velocity of this object*/
    #velocity = {
        position:{x:0, y:0, z:0},
        rotation:{x:0, y:0, z:0}
    };
    /** @type {Vec3} The scale of an object */
    #scale = {x:1, y:1, z:1};
    /** @type {Vec3} Rotation of an object */
    #rotation = {x:0, y:0, z:0};
    /** @type {rotFormat} used for gimbal rotations*/ 
    #rotFormat = "xyz";

    constructor({velocity = {position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}}, position={x:0,y:0,z:0}, scale = {x:1, y:1, z:1}, rotation={x:0,y:0,z:0}, rotFormat="xyz"}){
        this.#position = position;
        this.#scale = scale;
        this.#rotation = rotation;
        this.#rotFormat= rotFormat;
        this.#velocity = velocity;
        this.lockedAxis={
            x:false,
            y:false,
            z:false
        }
    }
    /**
     *@param {Vec3} position 
     */
    updatePosition(position){
        this.#position = position;
    }
    /**
     * @param {Vec3} rotation 
     */
    updateRotation(rotation){
        this.#rotation.x = this.lockedAxis.x ? this.#rotation.x : rotation.x;
        this.#rotation.y = this.lockedAxis.y ? this.#rotation.y : rotation.y;
        this.#rotation.z = this.lockedAxis.z ? this.#rotation.z : rotation.z;
    }
    /**
     * @param {Vec3} scale
     */
    updateScale(scale){
        this.#scale = scale;
    }
    /**
     * @param {Vec3} velocity 
     */
    updateVelocity(velocity){
        this.#velocity = velocity;
    }
    /**
     *@param {rotFormat} format 
     */
    updateRotFormat(format){
        if(format.length == 3){
            this.#rotFormat = format;
        }else{
            console.error("could not set rotation format: requires length to be 3, (ex: xyz, zyx...))");
        }
    }
    applyVelocity(){
        this.#position = math3.addVec3(this.#position, this.#velocity.position);
        this.#rotation.x += this.lockedAxis.x ? 0 : this.#velocity.rotation.x;
        this.#rotation.y += this.lockedAxis.y ? 0 : this.#velocity.rotation.y;
        this.#rotation.z += this.lockedAxis.z ? 0 : this.#velocity.rotation.z;
    }
    getRotation(){return this.#rotation};
    getPosition(){return this.#position};
    getScale(){return this.#scale};
    getVelocity(){return this.#velocity};
    getRotFormat(){return this.#rotFormat};
}
