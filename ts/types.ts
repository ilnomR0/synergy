export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface Vec2 {
    x: number;
    y: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
}

export type RotFormat = "xyz" | "yxz" | "xzy" | "zxy" | "zyx" | "yzx";

export interface VertexData {
    x: number;
    y: number;
    z: number;
    color: Color;
    uv: Vec2;
}

export interface Velocity {
    position: Vec3;
    rotation: Vec3;
}

export interface ObjectConfig {
    position?: Vec3;
    scale?: Vec3;
    rotation?: Vec3;
    velocity?: Velocity;
    rotFormat?: RotFormat;
}

export interface PlaneConfig extends ObjectConfig {
    texture: ImageData;
    UV?: Vec2;
    tint?: Color;
}

export interface ProjectedPoint {
    x: number;
    y: number;
}

export interface ScreenBounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}
