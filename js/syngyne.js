import * as Math3 from "./3dMath.js";

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
    #pixels;
    #zPixels;
    #resWidth;
    #resHeight;
    #pointerLockBroken;
    constructor() {
        this.pointerLockBroken = false;
        this.tick = 0;
        this.res = 350; // Horizontal resolution (chunky pixels)
        this.clearColor = 0x07000000

        // Setup main display canvas
        this.#canvas = document.createElement("canvas");
        this.#canvas.style.position = "absolute";
        this.#canvas.style.top = "0";
        this.#canvas.style.left = "0";
        this.#canvas.style.width = "100%";
        this.#canvas.style.height = "100%";
        this.#canvas.style.backgroundColor = "black";
        this.#ctx = this.#canvas.getContext("2d");

        // Crucial for chunky pixel scaling: disable smoothing
        document.body.appendChild(this.#canvas);

        // Setup offscreen canvas for the framebuffer
        this.#offscreenCanvas = document.createElement("canvas");
        this.#offscreenCtx = this.#offscreenCanvas.getContext("2d", { willReadFrequently: true });

        window.addEventListener("resize", () => { this.#resizeCanvas() });
        this.#canvas.addEventListener("click", async () => {
            
            await this.#canvas.requestPointerLock({unadjustedMovement:true }).catch(()=>{
                this.#canvas.requestPointerLock();
            });
            await this.#canvas.requestFullscreen(); 
        });
        this.#resizeCanvas();

    }


    #clipNearPlane(camPts) {
        const nearZ = 0.01;

        // Helper math to calculate the exact point where a line hits the glass
        const intersect = (p1, p2) => {
            const t = (nearZ - p1.z) / (p2.z - p1.z);
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y),
                z: nearZ,
                uv: {
                    x: p1.uv.x + t * (p2.uv.x - p1.uv.x),
                    y: p1.uv.y + t * (p2.uv.y - p1.uv.y)
                }
            };
        };

        const outPts = [];

        // Iterate through the edges sequentially to preserve winding order!
        for (let i = 0; i < 3; i++) {
            const cur = camPts[i];
            const next = camPts[(i + 1) % 3]; // Wraps back to 0 on the last step

            const curInside = cur.z >= nearZ;
            const nextInside = next.z >= nearZ;

            if (curInside && nextInside) {
                // Both points safe: just add the target point
                outPts.push(next);
            } else if (curInside && !nextInside) {
                // Leaving the safe zone: calculate where it hits the glass
                outPts.push(intersect(cur, next));
            } else if (!curInside && nextInside) {
                // Re-entering the safe zone: add glass intersection, then safe point
                outPts.push(intersect(cur, next));
                outPts.push(next);
            } 
            // If both are outside, we do nothing and draw nothing.
        }

        // Now, assemble the clipped polygon back into triangles for the rasterizer
        if (outPts.length === 3) {
            // It's a perfect triangle
            return [outPts];
        } else if (outPts.length === 4) {
            // It's a quad! Triangulate it into two triangles (Fan method)
            return [
                [outPts[0], outPts[1], outPts[2]],
                [outPts[0], outPts[2], outPts[3]]
            ];
        }

        // If it's 0, 1, or 2 points, it's either invisible or a useless line.
        return []; 
    }

    #resizeCanvas() {
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;

        // Calculate aspect-ratio-correct vertical resolution
        this.aspect = window.innerHeight / window.innerWidth;
        this.#resWidth = this.res;
        this.#resHeight = this.res*this.aspect;

        this.#offscreenCanvas.width = this.#resWidth;
        this.#offscreenCanvas.height = this.#resHeight;

        // Create the raw pixel buffer
        this.#backBuffer = this.#offscreenCtx.createImageData(this.#resWidth, this.#resHeight);
        this.#zBuffer = new Float32Array(this.#resWidth * this.#resHeight).fill(Infinity);
        this.#pixels = this.#backBuffer.data; // 1D array of [R,G,B,A, R,G,B,A...]
        this.#zPixels = this.#zBuffer;
        this.#ctx.imageSmoothingEnabled = false ; 
    }

    // CALL THIS AT THE START OF EVERY FRAME
    clear() {
        new Uint32Array(this.#pixels.buffer).fill(this.clearColor); //clears the pixel buffer 
        new Float32Array(this.#zPixels.buffer).fill(Infinity);
    }
    initApplication(callback = () => {}) {
        callback();
        // Start the loop. (Make sure you assign drw.loop before calling this!)
        requestAnimationFrame((tick) => this.loop(tick));
    }
    // CALL THIS AT THE END OF EVERY FRAME
    present() {
        // 1. Put the raw pixel data onto the tiny offscreen canvas
        this.#offscreenCtx.putImageData(this.#backBuffer, 0, 0);
        // 2. Hardware-scale the tiny canvas onto the massive main canvas
        this.#ctx.drawImage(this.#offscreenCanvas, 0, 0, this.#canvas.width, this.#canvas.height);
    }

    // Projects a 3D coordinate into our integer Framebuffer coordinates
    #project(x, y) {
        // Maps your original float coordinates to exact integer pixels in the buffer
        const pX = ~~(x * this.res) + ~~(this.#resWidth >> 1);
        const pY = ~~(y * this.res) + ~~(this.#resHeight >> 1);
        return { x: pX, y: pY };
    }

    triangleTex(array, texture) {
        // 1. Transform world coordinates to camera coordinates
        let camPts = [];
        for (let i = 0; i < 3; i++) {
            const cp = this.#camera.transformPoints(array[i]);
            cp.uv = array[i].uv; // Make sure to carry the UV data over!
            camPts.push(cp);
        }

        // 2. Chop the triangle against the near plane
        const validTriangles = this.#clipNearPlane(camPts);

        // 3. Project and draw whatever pieces survived the cut
        for (const tri of validTriangles) {
            this.#rasterizeTriangle(tri, texture);
        }
    }
    #rasterizeTriangle(camPts, texture) {
        const pts = [];
        const zVals = [];

        // Project the completely safe, clipped camera points to the screen
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

                    pixels[bufferIdx]     = (texData[texIdx]     * alpha + pixels[bufferIdx]     * invAlpha) / Math.max(zCorrect/4, 0.89);
                    pixels[bufferIdx + 1] = (texData[texIdx + 1] * alpha + pixels[bufferIdx + 1] * invAlpha) / Math.max(zCorrect/4, 0.89);
                    pixels[bufferIdx + 2] = (texData[texIdx + 2] * alpha + pixels[bufferIdx + 2] * invAlpha) / Math.max(zCorrect/4, 0.89);
                    pixels[bufferIdx + 3] = 255; // or also blend this if you need transparent canvas

                    if(alpha > 254/255){
                        zPixels[bufferIdx/4] = zCorrect;
                    }
                }
            }
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
}
