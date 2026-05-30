import type { Vec3, RotFormat } from "./types.js";

export function rotX(point: Vec3, deg: number): Vec3 {
    const rad = deg * Math.PI / 180;

    const fX = point.x;
    const fY = point.y * Math.cos(rad) + point.z * Math.sin(rad);
    const fZ = point.z * Math.cos(rad) + point.y * -Math.sin(rad);

    return { x: fX, y: fY, z: fZ };
}

export function rotY(point: Vec3, deg: number): Vec3 {
    const rad = deg * Math.PI / 180;

    const fX = point.x * Math.cos(rad) + point.z * -Math.sin(rad);
    const fY = point.y;
    const fZ = point.z * Math.cos(rad) + point.x * Math.sin(rad);

    return { x: fX, y: fY, z: fZ };
}

export function rotZ(point: Vec3, deg: number): Vec3 {
    const rad = deg * Math.PI / 180;

    const fX = point.x * Math.cos(rad) + point.y * Math.sin(rad);
    const fY = point.y * Math.cos(rad) + point.x * -Math.sin(rad);
    const fZ = point.z;

    return { x: fX, y: fY, z: fZ };
}

export function gimbal(point: Vec3, rot: Vec3, order: RotFormat = "xyz", origin: Vec3 = { x: 0, y: 0, z: 0 }): Vec3 {
    let finalPoint = subVec3(point, origin);

    if (order.length != 3) {
        console.warn("order length too long; gonna give u back your point. Typo buddy?");
        return point;
    }
    for (const char of order) {
        switch (char) {
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

export function detVec2(vec1: Vec3, vec2: Vec3): number {
    return (vec1.x * vec2.y) - (vec2.x * vec1.x);
}

export function dotVec2(vec1: Vec3, vec2: Vec3): number {
    return (vec1.x * vec2.x) + (vec1.y * vec2.y);
}

export function crossVec3(vec1: Vec3, vec2: Vec3): Vec3 {
    return {
        x: (vec1.y * vec2.z) - (vec1.z * vec2.y),
        y: (vec1.z * vec2.x) - (vec1.x * vec2.z),
        z: (vec1.x * vec2.y) - (vec1.y * vec2.x),
    }
}

export function subVec2(vec1: Vec3, vec2: Vec3): Vec3 {
    return {
        x: vec1.x - vec2.x,
        y: vec1.y - vec2.y,
        z: 0
    }
}

export function subVec3(vec1: Vec3, vec2: Vec3): Vec3 {
    return {
        x: vec1.x - vec2.x,
        y: vec1.y - vec2.y,
        z: vec1.z - vec2.z
    }
}

export function addVec3(vec1: Vec3, vec2: Vec3): Vec3 {
    return {
        x: vec1.x + vec2.x,
        y: vec1.y + vec2.y,
        z: vec1.z + vec2.z
    }
}

export function multVec3(vec1: Vec3, vec2: Vec3): Vec3 {
    return {
        x: vec1.x * vec2.x,
        y: vec1.y * vec2.y,
        z: vec1.z * vec2.z
    }
}

export function absVec3(vector:Vec3){
    return {
        x:Math.abs(vector.x),
        y:Math.abs(vector.y),
        z:Math.abs(vector.z),
    }
}

export const Vec3Z: Vec3 = { x: 0, y: 0, z: 0 };
