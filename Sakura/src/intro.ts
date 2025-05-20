import { createNoise3D } from "simplex-noise";

class Intro {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    maskSize: number;
    maskCanvas: HTMLCanvasElement;
    maskCtx: CanvasRenderingContext2D;
    simplex: any;
    image: HTMLImageElement;
    noiseMap: Float32Array;
    burnSpeed: number;
    imgData: ImageData;
    data: Uint8ClampedArray;
    noiseValue: number;
    delta: number;
    burnThreshold: number;
    constructor() {
        this.canvas = document.getElementById("burnCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.maskSize = 1024;
        this.maskCanvas = document.createElement("canvas");
        this.maskCanvas.width = this.maskSize;
        this.maskCanvas.height = this.maskSize;
        this.maskCtx = this.maskCanvas.getContext("2d") as CanvasRenderingContext2D;

        this.simplex = createNoise3D();
        this.image = new Image();
        this.image.crossOrigin = "anonymous";
        this.image.src = "japan.png";

        this.imgData = this.maskCtx.createImageData(this.maskSize, this.maskSize);
        this.data = this.imgData.data;
        this.noiseValue = 0
        this.delta = 0


        this.burnSpeed = 0.02;
        this.burnThreshold = -1;
        this.noiseMap = new Float32Array(this.maskSize * this.maskSize);

        this.init()

    }
    init() {

        this.noiseGenerator();
        this.animate();

    }

    noiseGenerator() {
        // Génère le bruit une fois au début (fixe)
        for (let x = 0; x < this.maskSize; x++) {
            for (let y = 0; y < this.maskSize; y++) {
                this.noiseMap[y * this.maskSize + x] = this.simplex(x / 300, y / 300, 0);
            }
        }
    }


    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Dessine l’image normalement
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(this.image, 0, 0, this.width, this.height);

        // 2. Crée la brûlure sur le maskCanvas
        this.imgData = this.maskCtx.createImageData(this.maskSize, this.maskSize);
        this.data = this.imgData.data;

        for (let x = 0; x < this.maskSize; x++) {
            for (let y = 0; y < this.maskSize; y++) {
                const i = (y * this.maskSize + x) * 4;
                this.noiseValue = this.noiseMap[y * this.maskSize + x];
                this.delta = this.noiseValue - this.burnThreshold;

                if (this.delta < -0.05) {
                    // Background
                    this.data[i] = 0;
                    this.data[i + 1] = 0;
                    this.data[i + 2] = 0;
                    this.data[i + 3] = 255;
                } else if (this.delta < 0.05) {
                    const t = (this.delta + 0.05) / 0.1;
                    this.data[i] = 200;
                    this.data[i + 1] = Math.floor(100 * t);
                    this.data[i + 2] = Math.floor(10 * (1 - t));
                    this.data[i + 3] = 250;
                    // Rouge/orangé
                } else if (this.delta < 0.2) {
                    // Rouge/orangé
                    const t = this.delta / 0.1;
                    this.data[i] = 255;
                    this.data[i + 1] = Math.floor(128 * t);
                    this.data[i + 2] = Math.floor(0 * (1 - t));
                    this.data[i + 3] = 255 * t;
                } else {
                    // Image devant
                    this.data[i] = 0;
                    this.data[i + 1] = 0;
                    this.data[i + 2] = 0;
                    this.data[i + 3] = 0;
                }
            }
        }

        this.maskCtx.putImageData(this.imgData, 0, 0);

        // 3. (optionnel) appliquer un flou léger sur la couche brûlure
        this.maskCtx.filter = "blur(1.5px)";
        this.maskCtx.drawImage(this.maskCanvas, 0, 0);
        this.maskCtx.filter = "none";

        // 4. Appliquer la couche de brûlure par-dessus l’image
        this.ctx.globalCompositeOperation = "multiply"; // ou "overlay", "darken", etc.
        this.ctx.drawImage(this.maskCanvas, 0, 0, this.width, this.height);

        // 5. Incrément du seuil
        this.burnThreshold += this.burnSpeed;
        if (this.burnThreshold > 1) this.burnThreshold = 1;

        requestAnimationFrame(this.animate);
    }

}