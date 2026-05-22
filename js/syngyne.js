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
        this.#pointerLockBroken = false;
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
            await this.#canvas.requestPointerLock({ unadjustedMovement: true }).catch(() => {
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
                color: p1.color
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
        this.#resHeight = Math.floor(this.res * this.aspect);

        this.#offscreenCanvas.width = this.#resWidth;
        this.#offscreenCanvas.height = this.#resHeight;

        this.#backBuffer = this.#offscreenCtx.createImageData(this.#resWidth, this.#resHeight);
        this.#zBuffer = new Float32Array(this.#resWidth * this.#resHeight).fill(Infinity);
        this.#lightBuffer = new Float32Array((this.#resWidth * this.#resHeight) * 3).fill(0);
        
        this.#pixels = this.#backBuffer.data; 
        this.#zPixels = this.#zBuffer;
        this.#lightPixels = this.#lightBuffer;
        this.#ctx.imageSmoothingEnabled = false; 
    }

    clear() {
        new Uint32Array(this.#pixels.buffer).fill(this.clearColor); 
        this.#zPixels.fill(Infinity);
        this.#lightPixels.fill(0);
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
        const pX = ~~(x * this.res) + (this.#resWidth >> 1);
        const pY = ~~(y * this.res) + (this.#resHeight >> 1);
        return { x: pX, y: pY };
    }

    triangleTex(array, texture) {
        let camPts = [];
        for (let i = 0; i < 3; i++) {
            const cp = this.#camera.transformPoints(array[i]);
            cp.uv = array[i].uv;
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
        
        // Utilize the bounds function to avoid processing the whole screen
        const bounds = this.#getLightScreenBounds(camSpacePos, radius);

        const factor = this.#camera.getFactor();
        const halfW = this.#resWidth >> 1;
        const halfH = this.#resHeight >> 1;

        const rMod = light.getColor().r / 255;
        const gMod = light.getColor().g / 255;
        const bMod = light.getColor().b / 255;

        for (let yPixel = bounds.minY; yPixel < bounds.maxY; yPixel++) {
            let idx = yPixel * this.#resWidth + bounds.minX;
            
            for (let xPixel = bounds.minX; xPixel < bounds.maxX; xPixel++, idx++) {
                const zCorrect = this.#zBuffer[idx];
                
                if (zCorrect === undefined || zCorrect === Infinity) continue; 

                const pixelCamX = (xPixel - halfW) / this.res * zCorrect / factor;
                const pixelCamY = (yPixel - halfH) / this.res * zCorrect / factor;
                const pixelCamZ = zCorrect;

                const dx = pixelCamX - camSpacePos.x;
                const dy = pixelCamY - camSpacePos.y;
                const dz = pixelCamZ - camSpacePos.z;

                const distSq = Math.max(dx * dx + dy * dy + dz * dz, 0.01);
                const intensity = radius / distSq / 2; 
                
                const lightIdx = idx * 3;
                this.#lightPixels[lightIdx]     += intensity * rMod;
                this.#lightPixels[lightIdx + 1] += intensity * gMod;
                this.#lightPixels[lightIdx + 2] += intensity * bMod;
            }
        }
    }

    #rasterizeTriangle(camPts, texture, color = { r: 0, g: 0, b: 0 }) {
        const factor = this.#camera.getFactor();
        const p0 = this.#project(camPts[0].x * factor / camPts[0].z, camPts[0].y * factor / camPts[0].z);
        const p1 = this.#project(camPts[1].x * factor / camPts[1].z, camPts[1].y * factor / camPts[1].z);
        const p2 = this.#project(camPts[2].x * factor / camPts[2].z, camPts[2].y * factor / camPts[2].z);

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

        const invZ0 = 1.0 / camPts[0].z, invZ1 = 1.0 / camPts[1].z, invZ2 = 1.0 / camPts[2].z;
        const uz0 = camPts[0].uv.x * invZ0, vz0 = camPts[0].uv.y * invZ0;
        const uz1 = camPts[1].uv.x * invZ1, vz1 = camPts[1].uv.y * invZ1;
        const uz2 = camPts[2].uv.x * invZ2, vz2 = camPts[2].uv.y * invZ2;

        const texW = texture.width, texH = texture.height;
        const texData = texture.data;
        const pixels = this.#pixels;
        const zPixels = this.#zPixels;
        const resWidth = this.#resWidth;

        // Hoist color math outside the loop
        const colorModR = (255 - color.r) / 255;
        const colorModG = (255 - color.g) / 255;
        const colorModB = (255 - color.b) / 255;

        // Edge step initializations
        let rowDet1 = (v01x * (minY - p0.y)) - (v01y * (minX - p0.x));
        let rowDet2 = (v12x * (minY - p1.y)) - (v12y * (minX - p1.x));
        let rowDet3 = (v20x * (minY - p2.y)) - (v20y * (minX - p2.x));

        for (let y = minY; y <= maxY; y++) {
            let det1 = rowDet1;
            let det2 = rowDet2;
            let det3 = rowDet3;

            let bufferIdx = (y * resWidth + minX) * 4;

            for (let x = minX; x <= maxX; x++) {
                if (det1 >= 0 && det2 >= 0 && det3 >= 0) {
                    const w0 = det2 * invTotalArea; 
                    const w1 = det3 * invTotalArea;
                    const w2 = det1 * invTotalArea;

                    const interpInvZ = (w0 * invZ0) + (w1 * invZ1) + (w2 * invZ2);
                    const zCorrect = 1.0 / interpInvZ;
                    
                    const zIdx = bufferIdx >> 2; // bufferIdx / 4
                    
                    if (zPixels[zIdx] > zCorrect) {
                        let u = ((w0 * uz0) + (w1 * uz1) + (w2 * uz2)) * zCorrect;
                        let v = ((w0 * vz0) + (w1 * vz1) + (w2 * vz2)) * zCorrect;

                        u = u - (~~u);
                        v = v - (~~v);

                        const texX = ~~(u * texW);
                        const texY = ~~(v * texH);
                        const texIdx = (texY * texW + texX) * 4;
                        const texAlpha = texData[texIdx + 3];

                        if (texAlpha > 0) {
                            const alpha = texAlpha / 255;
                            const invAlpha = 1.0 - alpha;

                            pixels[bufferIdx]     = colorModG * texData[texIdx]     * alpha + pixels[bufferIdx]     * invAlpha;
                            pixels[bufferIdx + 1] = colorModR * texData[texIdx + 1] * alpha + pixels[bufferIdx + 1] * invAlpha;
                            pixels[bufferIdx + 2] = colorModB * texData[texIdx + 2] * alpha + pixels[bufferIdx + 2] * invAlpha;
                            
                            if (alpha > 254 / 255) {
                                zPixels[zIdx] = zCorrect;
                            }
                            pixels[bufferIdx + 3] = 255;
                        }
                    }
                }
                
                // Edge step X
                det1 -= v01y;
                det2 -= v12y;
                det3 -= v20y;
                bufferIdx += 4;
            }
            
            // Edge step Y
            rowDet1 += v01x;
            rowDet2 += v12x;
            rowDet3 += v20x;
        }
    }

    compositeLights() {
        const pixels = this.#pixels;
        const lights = this.#lightPixels;
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
    getBroken() { return this.#pointerLockBroken; }
    isPaused() { return this.#paused; }
    togglePause() { 
        this.#paused = !this.#paused;
        if(this.#paused){
            document.exitPointerLock();
        }else{
            this.#canvas.requestPointerLock();
        }
    }
    addLight(light) { this.#lights.push(light); }
}
