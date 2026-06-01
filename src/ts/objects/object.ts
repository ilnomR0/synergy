import type { Vec3, RotFormat, Velocity } from "../types.ts";
import * as math3 from "../3dMath.ts";

export class Object {
    protected vertexPositions!: Vec3[];
    protected detector!:boolean;
    
    public position: Vec3;
    public velocity: Velocity;
    public scale: Vec3;
    public rotation: Vec3;
    public rotFormat: RotFormat;
    public onGround: boolean = false;
    public colliding: boolean = false;
    public lockedAxis: { x: boolean; y: boolean; z: boolean };
    public active!:boolean;
    

    constructor({ velocity = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, rotation = { x: 0, y: 0, z: 0 }, rotFormat = "xyz" as RotFormat }: {
        velocity?: Velocity;
        position?: Vec3;
        scale?: Vec3;
        rotation?: Vec3;
        rotFormat?: RotFormat;
    } = {}) {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
        this.rotFormat = rotFormat;
        this.velocity = velocity;
        this.lockedAxis = {
            x: false,
            y: false,
            z: false
        }
        this.vertexPositions = [this.position];
    }

    updatePosition(position: Vec3): void {
        this.position = position;
        this.vertexPositions = [this.position];
    }

    updateRotation(rotation: Vec3): void {
        this.rotation.x = this.lockedAxis.x ? this.rotation.x : rotation.x;
        this.rotation.y = this.lockedAxis.y ? this.rotation.y : rotation.y;
        this.rotation.z = this.lockedAxis.z ? this.rotation.z : rotation.z;
    }

    updateScale(scale: Vec3): void {
        this.scale = scale;
    }

    updateVelocity(velocity: Velocity): void {
        this.velocity = velocity;
    }

    updateRotFormat(format: RotFormat): void {
        if (format.length == 3) {
            this.rotFormat = format;
        } else {
            console.error("could not set rotation format: requires length to be 3, (ex: xyz, zyx...))");
        }
    }

    applyVelocity(): void {
        this.position = math3.addVec3(this.position, this.velocity.position);
        this.rotation.x += this.lockedAxis.x ? 0 : this.velocity.rotation.x;
        this.rotation.y += this.lockedAxis.y ? 0 : this.velocity.rotation.y;
        this.rotation.z += this.lockedAxis.z ? 0 : this.velocity.rotation.z;
    }
    protected updateVertexPositions(): void {
        this.vertexPositions = [this.position];
    }

    onCollisionWith(object:Object, callback:Function){
        this.detector = true;
        if(object.colliding && this.colliding){
            callback();
        }
    };

    getRotation(): Vec3 { return this.rotation; }
    getPosition(): Vec3 { return this.position; }
    getScale(): Vec3 { return this.scale; }
    getVelocity(): Velocity { return this.velocity; }
    getRotFormat(): RotFormat { return this.rotFormat; }
    getVertexPositions(): Vec3[] { return this.vertexPositions; }
    getDetectorMode():boolean{ return this.detector; }
}
