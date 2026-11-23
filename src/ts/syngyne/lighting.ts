import type { Camera } from "@objects/camera";
import type { ScreenBounds, Vec3 } from "@/types";
import { PointLight } from "@objects/pointLight";

export class Lighting{
    private lightBuffer:Float32Array = new Float32Array();
    clearLightBuffer(): void {
        this.lightBuffer.fill(0);
    }
    resizeLightBuffer(): void{
        this.lightBuffer = new Float32Array(syn.getResWidth() * syn.getResHeight() * 3).fill(0);
    }
    public getLightScreenBounds(camSpacePos: Vec3, radius: number): ScreenBounds {
        const nearZ = 0.01;

        if (camSpacePos.z - radius <= nearZ) {
            return {
                minX: 0,
                maxX: syn.getResWidth(),
                minY: 0,
                maxY: syn.getResHeight(),
            };
        }

        const factor = syn.camera.getFactor();
        const halfW = syn.getResWidth() >> 1;
        const halfH = syn.getResHeight() >> 1;

        const screenX = (camSpacePos.x / camSpacePos.z) * factor + halfW;
        const screenY = (camSpacePos.y / camSpacePos.z) * factor + halfH;
        const screenRadius = (radius / Math.max(nearZ, camSpacePos.z - radius)) * factor*syn.res;

        return {
            minX: Math.max(0, Math.floor(screenX - screenRadius)),
            maxX: Math.min(syn.getResWidth(), Math.ceil(screenX + screenRadius)),
            minY: Math.max(0, Math.floor(screenY - screenRadius)),
            maxY: Math.min(syn.getResHeight(), Math.ceil(screenY + screenRadius))
        };
    }
    public lighting(light: PointLight): void {
        const camSpacePos = syn.camera.transformPoints(light.position);
        const radius = light.radius;

        const bounds = this.getLightScreenBounds(camSpacePos, radius);

        const factor = syn.camera.getFactor();
        const halfW = syn.getResWidth() >> 1;
        const halfH = syn.getResHeight() >> 1;

        const rMod = light.glowColor.r / 255;
        const gMod = light.glowColor.g / 255;
        const bMod = light.glowColor.b / 255;

        for (let yPixel = bounds.minY; yPixel < bounds.maxY; yPixel++) {
            let idx = yPixel * syn.getResWidth() + bounds.minX;

            for (let xPixel = bounds.minX; xPixel < bounds.maxX; xPixel++, idx++) {
                const zCorrect = syn.getZBuffer()[idx];

                if (zCorrect === undefined || zCorrect === Infinity) continue;

                const pixelCamX = (xPixel - halfW) / syn.res * zCorrect / factor;
                const pixelCamY = (yPixel - halfH) / syn.res * zCorrect / factor;
                const pixelCamZ = zCorrect;

                const dx = pixelCamX - camSpacePos.x;
                const dy = pixelCamY - camSpacePos.y;
                const dz = pixelCamZ - camSpacePos.z;

                const distSq = Math.max(Math.pow(dx, light.pwrFactor) + Math.pow(dy,light.pwrFactor) + Math.pow(dz,light.pwrFactor), 0.001);
                const intensity = radius / distSq ;

                const lightIdx = (idx * 3);
                this.lightBuffer[lightIdx] += intensity * rMod;
                this.lightBuffer[lightIdx+1] += intensity * gMod;
                this.lightBuffer[lightIdx+2] += intensity * bMod;
            }
        }
    }

    public getLightBuffer(){return this.lightBuffer};

}
