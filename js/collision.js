export class Collision{
    static #colliderSpots = [];
    static gravity = {
        x:0,
        y:30,
        z:0 
    }
    
    static addCollider(mesh){
        this.#colliderSpots.push(mesh); 
    }

    static rigidify(object, dt){
        object.velocity.y += this.gravity.y*dt;
        object.velocity.x += this.gravity.x*dt;
        object.velocity.z += this.gravity.z*dt;
        object.position.y += object.velocity.y*dt;
        object.position.x += object.velocity.x*dt;
        object.position.z += object.velocity.z*dt;

        if(object.position.y >= 1.5){ //TEMPORARY COLLISION THINGS
            object.position.y -=object.velocity.y*dt;
            object.velocity.y -= this.gravity.y*dt;
            object.velocity.y = 0;
            object.onGround = true;

            object.velocity.x /=1.1;
            object.velocity.z /=1.1;
        }else{
            object.onGround = false;
            object.velocity.x /=1.002;
            object.velocity.z /=1.002;
        }
    }
}
