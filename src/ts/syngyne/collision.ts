import type { Vec3, VertexData } from "@/types.ts";
import { Object } from "@objects/object.ts";
import { Mesh } from "@objects/mesh.ts";
import * as Math3 from "@syngyne/3dMath.ts";

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

    private static AABB(colliderObj:Object, object:Object){
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

        /*return (colliderObj.position.x -scaleOff.x <= object.position.x + objOff.x &&
                colliderObj.position.x +scaleOff.x >= object.position.x - objOff.x &&

                colliderObj.position.y -scaleOff.y <= object.position.y + objOff.y &&
                colliderObj.position.y +scaleOff.y >= object.position.y - objOff.y &&

                colliderObj.position.z -scaleOff.z <= object.position.z + objOff.z &&
                colliderObj.position.z +scaleOff.z >= object.position.z - objOff.z)*/
        //if this returns true, then we can then check on a per-triangle basis. Eg: A and B may be in their bounding box, but check these triangles. 
        //We should be able to optimise too if we get the direction of collision, singling out only the triangles that are most likely to 
        //be returned. We can return a boolean and also some triangles
        
        if (colliderObj.position.x -scaleOff.x <= object.position.x + objOff.x &&
                colliderObj.position.x +scaleOff.x >= object.position.x - objOff.x &&

                colliderObj.position.y -scaleOff.y <= object.position.y + objOff.y &&
                colliderObj.position.y +scaleOff.y >= object.position.y - objOff.y &&

                colliderObj.position.z -scaleOff.z <= object.position.z + objOff.z &&
                colliderObj.position.z +scaleOff.z >= object.position.z - objOff.z){
           
                let COTriangles; 
                let OTriangles; 

                if(colliderObj instanceof Mesh) {
                    COTriangles = colliderObj.triangles;
                }
                if(object instanceof Mesh) {
                    OTriangles = object.triangles;
                }
                if(COTriangles == undefined && OTriangles == undefined){
                    return true;
                }else if(COTriangles != undefined && OTriangles == undefined){
                    return this.boxInTriangles(object, COTriangles);
                }else if(OTriangles != undefined && COTriangles == undefined){
                    return this.boxInTriangles(colliderObj, OTriangles);
                }else if(OTriangles != undefined && COTriangles != undefined){
                    return this.trianglesInTriangles(colliderObj, OTriangles);
                }
        }
        return false;
    }
    private static boxInTriangles(box:Object, triangles:VertexData[][]):boolean{
        
        triangles.forEach((triangle, i)=>{
            
        });
        return false; 
    }
    private static trianglesInTriangles(box:Object, triangles:VertexData[][]):boolean{
        
        return false; 
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
            colliderObj.colliding = false;
            if(this.AABB(colliderObj, object)){
                if(!colliderObj.getDetectorMode()){
                    object.position.x -= object.velocity.position.x * dt;
                    object.velocity.position.x = 0;
                }
                object.colliding = true;
                colliderObj.colliding = true;
            }
        });
        object.position.y += object.velocity.position.y * dt;
        this.colliderSpots.forEach((colliderObj)=>{
            if(this.AABB(colliderObj, object)){
                if(!colliderObj.getDetectorMode()){
                    object.position.y -= object.velocity.position.y * dt;
                    object.velocity.position.y = 0;
                }
                object.colliding = true;
                object.onGround = true;
                colliderObj.colliding = true;
            }
        });
        object.position.z += object.velocity.position.z * dt;
        this.colliderSpots.forEach((colliderObj)=>{
            if(this.AABB(colliderObj, object)){
                if(!colliderObj.getDetectorMode()){
                    object.position.z -= object.velocity.position.z * dt;
                    object.velocity.position.z = 0;
                }
                object.colliding = true;
                colliderObj.colliding = true;
            }
        });

        if (object.colliding) {
            object.velocity.position.x *= Math.pow(0.0002, dt);
            object.velocity.position.z *= Math.pow(0.0002, dt);
        } else {
            object.velocity.position.x *= Math.pow(0.5, dt);
            object.velocity.position.z *= Math.pow(0.5, dt);
        }
    }
}
