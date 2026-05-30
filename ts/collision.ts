import type { Vec3 } from "./types.js";
import type { Object } from "./objects/object.js";
import * as Math3 from "./3dMath.js";
export class Collision {

    private static colliderSpots: Object[] = [];

    static gravity: Vec3 = {
        x: 0,
        y: 30,
        z: 0
    }

    /**
     * Marks the given object(s) as a collidable object
     */
    static addCollider(...objects: Object[]): void {
        for (const object of objects) {
            this.colliderSpots.push(object);
        }
    }

    private static AABB(colliderObj:Object, object:Object):boolean{
        const scaleOff = Math3.absVec3(Math3.gimbal({
            x:colliderObj.scale.x*0.5,
            y:colliderObj.scale.y*0.5,
            z:colliderObj.scale.z*0.5
        }, colliderObj.rotation, colliderObj.rotFormat));
        const objOff = {
            x:object.scale.x*0.5,
            y:object.scale.y*0.5,
            z:object.scale.z*0.5
        };

        //big ol' check to determine if the object is inside of the other object. 
        //we also need to determine it all based off of the rotation of the object
        return (colliderObj.position.x -scaleOff.x <= object.position.x + objOff.x &&
                colliderObj.position.x +scaleOff.x >= object.position.x - objOff.x &&

                colliderObj.position.y -scaleOff.y <= object.position.y + objOff.y &&
                colliderObj.position.y +scaleOff.y >= object.position.y - objOff.y &&

                colliderObj.position.z -scaleOff.z <= object.position.z + objOff.z &&
                colliderObj.position.z +scaleOff.z >= object.position.z - objOff.z)
    }

    /**
     * when called on the given object, it applies gravity to said object, and collides with anything that is marked as a collider 
     */
    static rigidify(object: Object, dt: number): void {
        //applying gravity
        object.velocity.position.y += this.gravity.y * dt;
        object.velocity.position.x += this.gravity.x * dt;
        object.velocity.position.z += this.gravity.z * dt;

        //applying velocity

        object.colliding = false;
        object.onGround = false;
        //main colision detection logic
        object.position.x += object.velocity.position.x * dt;
        this.colliderSpots.forEach((colliderObj)=>{
            if(this.AABB(colliderObj, object)){
                object.position.x -= object.velocity.position.x * dt;
                object.velocity.position.x = 0;
                object.colliding = true;
            }
        });
        object.position.y += object.velocity.position.y * dt;
        this.colliderSpots.forEach((colliderObj)=>{
            if(this.AABB(colliderObj, object)){
                object.position.y -= object.velocity.position.y * dt;
                object.velocity.position.y = 0;
                object.colliding = true;
                object.onGround = true;
            }
        });
        object.position.z += object.velocity.position.z * dt;
        this.colliderSpots.forEach((colliderObj)=>{
            if(this.AABB(colliderObj, object)){
                object.position.z -= object.velocity.position.z * dt;
                object.velocity.position.z = 0;
                object.colliding = true;
            }
        });

        if (object.colliding) {
            object.velocity.position.x *= Math.pow(0.0002, dt);
            object.velocity.position.z *= Math.pow(0.0002, dt);
        } else {
            object.velocity.position.x *= Math.pow(0.7, dt);
            object.velocity.position.z *= Math.pow(0.7, dt);
        }
    }
}
