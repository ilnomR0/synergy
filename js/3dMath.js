export function rotX(point, deg){
    let rad = deg * Math.PI/180;

    let fX = point.x;
    let fY = point.y * Math.cos(rad) + point.z * Math.sin(rad);
    let fZ = point.z * Math.cos(rad) + point.y * -Math.sin(rad);

    return{x:fX, y:fY, z:fZ};
}

export function rotY(point, deg){
    let rad = deg * Math.PI/180;

    let fX = point.x * Math.cos(rad) + point.z * -Math.sin(rad);
    let fY = point.y;
    let fZ = point.z * Math.cos(rad) + point.x * Math.sin(rad);

    return{x:fX, y:fY, z:fZ};
}

export function rotZ(point, deg){
    let rad = deg * Math.PI/180;

    let fX = point.x * Math.cos(rad) + point.y * Math.sin(rad);
    let fY = point.y * Math.cos(rad) + point.x * -Math.sin(rad);
    let fZ = point.z;
    return {x: fX, y:fY, z:fZ};
}

export function gimbal(pointI, rot, order = "xyz", origin={x:0, y:0, z:0}){

    let finalPoint = subVec3(pointI, origin);

    if(order.length != 3){
        console.warn("order length too long; gonna give u back your point. Typo buddy?");
        return pointI;
    }
    for(let char of order){
        switch(char){
            case "x":
                finalPoint = rotX(finalPoint, rot.x);
                break;
            case "y":
                finalPoint = rotY(finalPoint, rot.y);
                break;
            case "z":
                finalPoint = rotZ(finalPoint, rot.z);
                break;
        }
    }

    return finalPoint;
}



export function detVec2(vec1, vec2){
    return (vec1.x * vec2.y) - (vec2.x * vec1.x)
}
export function subVec2(vec1, vec2){
    return {x:vec1.x - vec2.x,
        y:vec1.y - vec2.y}
}
export function subVec3(vec1, vec2){
    return {x:vec1.x - vec2.x,
        y:vec1.y - vec2.y,
        z:vec1.z - vec2.z}
}
export function addVec3(vec1, vec2){
    return {x:vec1.x + vec2.x,
        y:vec1.y + vec2.y,
        z:vec1.z + vec2.z}
}
export function multVec3(vec1, vec2){
    return {x:vec1.x * vec2.x,
        y:vec1.y * vec2.y,
        z:vec1.z * vec2.z}
}
export const Vec3Z = {x:0, y:0, z:0};
