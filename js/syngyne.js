/**
 *----------------THE SYNERGY ENGINE--------------
 * it's a very nice very cool engine written from
 * hand in a cave with scraps. 
 *
 * pronunciation: syngyne: sin-gin (not sign, sin)
 * written by IlnomR0
 * ----------------------------------------------
 */
export class syngyne {
    #camera;
    #canvas;
    #ctx;

    // Offscreen buffer variables for extreme performance
    #offscreenCanvas;
    #offscreenCtx;
    #backBuffer;
    #zBuffer;
    /** @type{Float32Array}*/
    #lightBuffer;
    #pixels;
    #zPixels;
    #lightPixels;
    #resWidth;
    #resHeight;
    #pointerLockBroken;
    #lights = [];
    #paused = false;

    constructor() {
        this.pointerLockBroken = false;
        this.tick = 0;
        this.res = 320; // Horizontal resolution (chunky pixels)
        this.clearColor = 0x70000000;

        this.#canvas = document.createElement("canvas");
        this.#canvas.style.position = "absolute";
        this.#canvas.style.top = "0";
        this.#canvas.style.left = "0";
        this.#canvas.style.width = "100%";
        this.#canvas.style.height = "100%";
        this.#canvas.style.backgroundColor = "black";
        this.#ctx = this.#canvas.getContext("2d");
        this.renderMethod = "wireframe";
        document.body.appendChild(this.#canvas);

        this.#offscreenCanvas = document.createElement("canvas");
        this.#offscreenCtx = this.#offscreenCanvas.getContext("2d", { willReadFrequently: true });

        window.addEventListener("resize", () => { this.#resizeCanvas() });
        this.#canvas.addEventListener("click", async () => {

            await this.#canvas.requestPointerLock({unadjustedMovement:true }).catch(()=>{
                this.#canvas.requestPointerLock();
            });
            await this.#canvas.requestFullscreen(); 
            await navigator.keyboard.lock();
        });
        this.#resizeCanvas();

    }


    /**
     * Calculates the 2D screen pixel boundaries for a 3D light sphere.
     * @param {Object} camSpacePos The {x, y, z} position of the light in camera space
     * @param {number} radius The max radius of the light
     */
    #getLightScreenBounds(camSpacePos, radius) {
        const nearZ = 0.01;

        if (camSpacePos.z - radius <= nearZ) {
            return {
                minX: 0,
                maxX: this.#resWidth,
                minY: 0,
                maxY: this.#resHeight
            };
        }

        const factor = this.#camera.getFactor();
        const halfW = this.#resWidth >> 1;
        const halfH = this.#resHeight >> 1;

        const screenX = (camSpacePos.x / camSpacePos.z) * factor + halfW;
        const screenY = (camSpacePos.y / camSpacePos.z) * factor + halfH;

        const screenRadius = (radius / Math.max(nearZ, camSpacePos.z - radius)) * factor;

        return {
            minX: Math.max(0, Math.floor(screenX - screenRadius)),
            maxX: Math.min(this.#resWidth, Math.ceil(screenX + screenRadius)),
            minY: Math.max(0, Math.floor(screenY - screenRadius)),
            maxY: Math.min(this.#resHeight, Math.ceil(screenY + screenRadius))
        };
    }
    #clipNearPlane(camPts) {
        const nearZ = 0.01;

        const intersect = (p1, p2) => {
            const t = (nearZ - p1.z) / (p2.z - p1.z);
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y),
                z: nearZ,
                uv: {
                    x: p1.uv.x + t * (p2.uv.x - p1.uv.x),
                    y: p1.uv.y + t * (p2.uv.y - p1.uv.y)
                },
                color:p1.color
            };
        };

        const outPts = [];

        for (let i = 0; i < 3; i++) {
            const cur = camPts[i];
            const next = camPts[(i + 1) % 3]; 

            const curInside = cur.z >= nearZ;
            const nextInside = next.z >= nearZ;

            if (curInside && nextInside) {
                outPts.push(next);
            } else if (curInside && !nextInside) {
                outPts.push(intersect(cur, next));
            } else if (!curInside && nextInside) {
                outPts.push(intersect(cur, next));
                outPts.push(next);
            } 
        }

        if (outPts.length === 3) {
            return [outPts];
        } else if (outPts.length === 4) {
            return [
                [outPts[0], outPts[1], outPts[2]],
                [outPts[0], outPts[2], outPts[3]]
            ];
        }

        return []; 
    }

    #resizeCanvas() {
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;

        this.aspect = window.innerHeight / window.innerWidth;
        this.#resWidth = this.res;
        this.#resHeight = this.res*this.aspect;

        this.#offscreenCanvas.width = this.#resWidth;
        this.#offscreenCanvas.height = this.#resHeight;

        this.#backBuffer = this.#offscreenCtx.createImageData(this.#resWidth, this.#resHeight);
        this.#zBuffer = new Float32Array(this.#resWidth * this.#resHeight).fill(Infinity);
        this.#lightBuffer = new Float32Array((this.#resWidth * this.#resHeight)*3).fill(0);
        this.#pixels = this.#backBuffer.data; 
        this.#zPixels = this.#zBuffer;
        this.#lightPixels = this.#lightBuffer;
        this.#ctx.imageSmoothingEnabled = false; 
        

    }

    clear() {
        new Uint32Array(this.#pixels.buffer).fill(this.clearColor); 
        new Float32Array(this.#zPixels.buffer).fill(Infinity);
        this.#lightBuffer.fill(0);
    }
    initApplication(callback = () => {}) {
        callback();
        requestAnimationFrame((tick) => this.loop(tick));
    }
    present() {
        this.#offscreenCtx.putImageData(this.#backBuffer, 0, 0);
        this.#ctx.drawImage(this.#offscreenCanvas, 0, 0, this.#canvas.width, this.#canvas.height);
    }

    #project(x, y) {
        const pX = ~~(x * this.res) + ~~(this.#resWidth >> 1);
        const pY = ~~(y * this.res) + ~~(this.#resHeight >> 1);
        return { x: pX, y: pY };
    }

    triangleTex(array, texture) {
        let camPts = [];
        for (let i = 0; i < 3; i++) {
            const cp = this.#camera.transformPoints(array[i]);
            cp.uv = array[i].uv;
            cp.color = array[i].color;
            camPts.push(cp);
        }

        const validTriangles = this.#clipNearPlane(camPts);
        for (const tri of validTriangles) {
            this.#rasterizeTriangle(tri, texture, array[0].color);
        }
    }
    /**
     * Renders a single light as a 2D splat over the pre-rendered geometry.
     * @param {Light} light The light object to process
     */
    renderLightSplat(light) {
        const camSpacePos = this.#camera.transformPoints(light.getPosition());
        const radius = light.getRadius();

        const factor = this.#camera.getFactor();
        const halfW = this.#resWidth >> 1;
        const halfH = this.#resHeight >> 1;

        for (let yPixel = 0; yPixel < this.#resHeight; yPixel++) {
            for (let xPixel = 0; xPixel < this.#resWidth; xPixel++) {
                
                const idx = yPixel * this.#resWidth + xPixel;

                const zCorrect = this.#zBuffer[idx];
                
                if (zCorrect === undefined || zCorrect === Infinity) continue; 

                const pixelCamX = (xPixel - halfW) / this.res * zCorrect / factor;
                const pixelCamY = (yPixel - halfH) / this.res * zCorrect / factor;
                const pixelCamZ = zCorrect;

                const dx = pixelCamX - camSpacePos.x;
                const dy = pixelCamY - camSpacePos.y;
                const dz = pixelCamZ - camSpacePos.z;

                const distSq = dx*dx + dy*dy + dz*dz;

                    const intensity = radius / distSq/2; 
                    
                    this.#lightBuffer[idx*3]     += intensity * light.getColor().r/255;
                    this.#lightBuffer[idx*3 + 1] += intensity * light.getColor().g/255;
                    this.#lightBuffer[idx*3 + 2] += intensity * light.getColor().b/255;
            }
        }
        console.log(this.#lightBuffer);
    }
    #rasterizeTriangle(camPts, texture, color={r:0,g:0,b:0}) {
        const pts = [];
        const zVals = [];

        for (let i = 0; i < 3; i++) {
            const factor = this.#camera.getFactor();
            const proj = this.#project(camPts[i].x * factor / camPts[i].z, camPts[i].y * factor / camPts[i].z);
            pts.push(proj);
            zVals.push(camPts[i].z);
        }

        const p0 = pts[0], p1 = pts[1], p2 = pts[2];

        const minX = Math.max(0, Math.min(p0.x, p1.x, p2.x));
        const maxX = Math.min(this.#resWidth - 1, Math.max(p0.x, p1.x, p2.x));
        const minY = Math.max(0, Math.min(p0.y, p1.y, p2.y));
        const maxY = Math.min(this.#resHeight - 1, Math.max(p0.y, p1.y, p2.y));

        const v01x = p1.x - p0.x, v01y = p1.y - p0.y;
        const v12x = p2.x - p1.x, v12y = p2.y - p1.y;
        const v20x = p0.x - p2.x, v20y = p0.y - p2.y;

        const totalArea = (v01x * -v20y) - (v01y * -v20x);
        if (totalArea === 0) return; 
        const invTotalArea = 1.0 / totalArea;

        const invZ0 = 1.0 / zVals[0], invZ1 = 1.0 / zVals[1], invZ2 = 1.0 / zVals[2];
        const uz0 = camPts[0].uv.x * invZ0, vz0 = camPts[0].uv.y * invZ0;
        const uz1 = camPts[1].uv.x * invZ1, vz1 = camPts[1].uv.y * invZ1;
        const uz2 = camPts[2].uv.x * invZ2, vz2 = camPts[2].uv.y * invZ2;

        const texW = texture.width, texH = texture.height;
        const texData = texture.data;
        const pixels = this.#pixels;
        const zPixels = this.#zPixels;
        const resWidth = this.#resWidth;

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const det1 = (v01x * (y - p0.y)) - (v01y * (x - p0.x));
                if (det1 < 0) continue; 
                const det2 = (v12x * (y - p1.y)) - (v12y * (x - p1.x));
                if (det2 < 0) continue; 
                const det3 = (v20x * (y - p2.y)) - (v20y * (x - p2.x));
                if (det3 < 0) continue;

                const w0 = det2 * invTotalArea; 
                const w1 = det3 * invTotalArea;
                const w2 = det1 * invTotalArea;

                const interpInvZ = (w0 * invZ0) + (w1 * invZ1) + (w2 * invZ2);
                const zCorrect = 1.0 / interpInvZ;
                let u = ((w0 * uz0) + (w1 * uz1) + (w2 * uz2)) * zCorrect;
                let v = ((w0 * vz0) + (w1 * vz1) + (w2 * vz2)) * zCorrect;

                u = u - (~~u);
                v = v - (~~v);

                const texX = ~~(u * texW);
                const texY = ~~(v * texH);
                const texIdx = (texY * texW + texX) * 4;
                const bufferIdx = (y * resWidth + x) * 4;
                if(zPixels[bufferIdx/4] > zCorrect && texData[texIdx + 3] > 0){
                    const alpha = texData[texIdx + 3] / 255;
                    const invAlpha = 1.0 - alpha;
// Inside #rasterizeTriangle, just write the raw colors:
pixels[bufferIdx]     = ((255-color.b)/255) * texData[texIdx]     * alpha + pixels[bufferIdx]     * invAlpha
pixels[bufferIdx + 1] = ((255-color.r)/255) * texData[texIdx + 1] * alpha + pixels[bufferIdx + 1] * invAlpha
pixels[bufferIdx + 2] = ((255-color.g)/255) * texData[texIdx + 2] * alpha + pixels[bufferIdx + 2] * invAlpha
//pixels[bufferIdx]     = zCorrect;
//pixels[bufferIdx + 1] = zCorrect;
//pixels[bufferIdx + 2] = zCorrect;
                    if(alpha > 254/255){
 
                        zPixels[bufferIdx/4] = zCorrect;
                    }

                    pixels[bufferIdx + 3] = 255;
                }
            }
        }
    }
    compositeLights() {
        const pixels = this.#pixels;
        const lights = this.#lightBuffer;
        const totalPixels = this.#resWidth * this.#resHeight;

    for (let i = 0; i < totalPixels; i++) {
        const pxIdx = i * 4;
        const ltIdx = i * 3;

        pixels[pxIdx]     *= lights[ltIdx];     // Red
        pixels[pxIdx + 1] *= lights[ltIdx + 1]; // Green
        pixels[pxIdx + 2] *= lights[ltIdx + 2]; // Blue
    }
}
    static async loadTexture(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, img.width, img.height)); 
            };
            img.onerror = reject;
        });
    }

    setCamera(camera) { this.#camera = camera; }
    getCtx() { return this.#ctx; }
    getCanvas() { return this.#canvas; }
    getBroken() {return this.#pointerLockBroken; }
    isPaused() {return this.#paused; }
    togglePause() { this.#paused = !this.#paused };
    addLight(light){this.#lights.push(light)};
}
