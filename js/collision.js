
export class Collision{
    static #colliderSpots = [];
    static gravity = {
        x:2,
        y:30,
        z:0 
    }
    
    static addCollider(object){
        this.#colliderSpots.push(object); 
    }

    static rigidify(object, dt){
        object.velocity.y += this.gravity.y*dt;
        object.velocity.x += this.gravity.x*dt;
        object.velocity.z += this.gravity.z*dt;
        object.position.y += object.velocity.y*dt;
        object.position.x += object.velocity.x*dt;
        object.position.z += object.velocity.z*dt;

        if(-5 >= object.position.y || object.position.y >= 1.5){ //TEMPORARY COLLISION THINGS
            object.position.y -=object.velocity.y*dt;
            object.velocity.y -= this.gravity.y*dt;
            object.velocity.y = 0;
            object.onGround = true;

            object.velocity.x *=Math.pow(0.0002, dt);
            object.velocity.z *=Math.pow(0.0002, dt);
        }else{
            object.onGround = false;
            object.velocity.x *=Math.pow(0.7, dt);
            object.velocity.z *=Math.pow(0.7, dt);
        }
    }
}
