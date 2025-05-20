import { createNoise3D } from "simplex-noise";

import imgUrl from '/japan.png'

export class Intro {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    startButton: HTMLElement;
    width: number;
    height: number;
    maskCanvas: HTMLCanvasElement;
    maskCtx: CanvasRenderingContext2D;
    simplex: any;
    image: HTMLImageElement;
    noiseMap: Float32Array;
    burnSpeed: number;
    maskData: ImageData;
    data: Uint8ClampedArray;
    noiseValue: number;
    delta: number;
    burnThreshold: number;
    maskSizeWidth: number;
    maskSizeHeight: number;
    haloCanvas: HTMLCanvasElement;
    haloCtx: CanvasRenderingContext2D;
    haloData: ImageData | undefined;
    wr: number | undefined;
    hr: number | undefined;
    scale: number | undefined;
    x: number | undefined;
    y: number | undefined;
    constructor() {
        this.canvas = document.getElementById("burnCanvas") as HTMLCanvasElement;
        this.startButton = document.getElementById("startButton") as HTMLElement;
        this.ctx = this.canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        console.log(this.canvas);
        console.log(this.ctx);

        this.maskSizeWidth = window.innerWidth;
        this.maskSizeHeight = window.innerHeight;
        this.maskCanvas = document.createElement("canvas");
        this.maskCanvas.width = this.maskSizeWidth;
        this.maskCanvas.height = this.maskSizeHeight;
        this.maskCtx = this.maskCanvas.getContext("2d") as CanvasRenderingContext2D;

        this.haloCanvas = document.createElement("canvas");
        this.haloCanvas.width = this.maskSizeWidth;
        this.haloCanvas.height = this.maskSizeHeight;
        this.haloCtx = this.haloCanvas.getContext("2d") as CanvasRenderingContext2D;

        this.simplex = createNoise3D();
        this.image = new Image();
        this.image.crossOrigin = "anonymous";
        this.image.src = imgUrl;

        this.maskData = this.maskCtx.createImageData(this.maskSizeWidth, this.maskSizeHeight);
        this.data = this.maskData.data;
        this.noiseValue = 0
        this.delta = 0


        this.burnSpeed = 0.02;
        this.burnThreshold = -1;
        this.noiseMap = new Float32Array(this.maskSizeWidth * this.maskSizeHeight);

        this.image.onload = () => {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.init(); // ne lance init() qu'après chargement
        };
    }
    init() {
        this.noiseGenerator();
        this.initEvents()
        this.initImage()
    }
    initEvents() {
        this.startButton.addEventListener('click', this.handleButtonClick.bind(this))
    }
    initImage() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.wr = this.canvas.width / this.image.width;
        this.hr = this.canvas.height / this.image.height;
        this.scale = Math.max(this.wr, this.hr);

        this.x = (this.canvas.width - this.image.width * this.scale) / 2;
        this.y = (this.canvas.height - this.image.height * this.scale) / 2;


        // 1. Dessine l’image normalement
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(
            this.image,
            this.x, this.y,
            this.image.width * this.scale,
            this.image.height * this.scale
        );
        console.log(this.width)    }
    
    handleButtonClick() {
        // this.startButton.style.opacity = 0;
        this.animate()

    }

    noiseGenerator() {
        // Génère le bruit une fois au début (fixe)
        for (let x = 0; x < this.maskSizeWidth; x++) {
            for (let y = 0; y < this.maskSizeHeight; y++) {
                this.noiseMap[y * this.maskSizeWidth + x] = this.simplex(x / 300, y / 300, 0);
            }
        }
    }


    animate() {

        // 2. Crée la brûlure sur le maskCanvas
        this.maskData = this.maskCtx.createImageData(this.maskSizeWidth, this.maskSizeHeight);
        this.haloData = this.haloCtx.createImageData(this.maskSizeWidth, this.maskSizeHeight);
        this.data = this.maskData.data;

        for (let x = 0; x < this.maskSizeWidth; x++) {
            for (let y = 0; y < this.maskSizeHeight; y++) {
                const i = (y * this.maskSizeWidth + x) * 4; // ✅ largeur ici !
                const noise = this.noiseMap[y * this.maskSizeWidth + x]; // idem
                const delta = noise - this.burnThreshold;
        
                if (delta < -0.05) {
                    this.maskData.data[i + 3] = 255; // Brûlé
                } else if (delta < 0.05) {
                    const t = (delta + 0.05) / 0.1;
                    this.haloData.data[i] = 255;
                    this.haloData.data[i + 1] = 100 + 50 * t;
                    this.haloData.data[i + 2] = 0;
                    this.haloData.data[i + 3] = 200;
                }
            }
        }

        // Étape 3 — applique le masque de brûlure pour effacer
        this.maskCtx.putImageData(this.maskData, 0, 0);
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.drawImage(this.maskCanvas, 0, 0);

        // Étape 4 — applique le halo par-dessus
        this.haloCtx.putImageData(this.haloData, 0, 0);
        this.haloCtx.filter = "blur(3px)";
        this.haloCtx.drawImage(this.haloCanvas, 0, 0);
        this.haloCtx.filter = "none";

        this.ctx.globalCompositeOperation = "lighter";
        this.ctx.globalAlpha = 0.6;
        this.ctx.drawImage(this.haloCanvas, 0, 0, this.width, this.height);
        this.ctx.globalAlpha = 1;

        // Étape 5 — progression
        this.burnThreshold += this.burnSpeed;
        if (this.burnThreshold < 1.1) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }

}