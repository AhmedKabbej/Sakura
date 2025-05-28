import { createNoise3D } from "simplex-noise";

import imgUrl from '/intro-screen.png'
import { MusicManager } from "./MusicManager";

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
    newWidth!: number;
    newHeight!: number;
    musicManager: MusicManager;

    constructor(musicManager: MusicManager) {
        this.musicManager = musicManager
        console.log(this.musicManager)
        this.canvas = document.getElementById("burn-canvas") as HTMLCanvasElement;
        this.startButton = document.getElementById("start-button") as HTMLElement;
        this.ctx = this.canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;

        this.simplex = createNoise3D();
        this.image = new Image();
        this.image.crossOrigin = "anonymous";
        this.image.src = imgUrl;

        this.image.onload = () => {

            this.maskSizeWidth = this.image.width;
            this.maskSizeHeight = this.image.height;
            this.width = this.image.width;
            this.height = this.image.height;
            this.maskCanvas = document.createElement("canvas");
            this.maskCanvas.width = this.maskSizeWidth;
            this.maskCanvas.height = this.maskSizeHeight;
            this.maskCtx = this.maskCanvas.getContext("2d") as CanvasRenderingContext2D;

            this.haloCanvas = document.createElement("canvas");
            this.haloCanvas.width = this.maskSizeWidth;
            this.haloCanvas.height = this.maskSizeHeight;
            this.haloCtx = this.haloCanvas.getContext("2d") as CanvasRenderingContext2D;

            this.maskData = this.maskCtx.createImageData(this.maskSizeWidth, this.maskSizeHeight);
            this.data = this.maskData.data;
            this.noiseValue = 0
            this.delta = 0

            this.burnSpeed = 0.030;
            this.burnThreshold = -1;
            this.noiseMap = new Float32Array(this.maskSizeWidth * this.maskSizeHeight);

            this.canvas.width = this.maskSizeWidth;
            this.canvas.height = this.maskSizeHeight;
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


        this.startButton.addEventListener("mouseenter", () => {
            document.body.classList.add("blur-active");
        });

        this.startButton.addEventListener("mouseleave", () => {
            document.body.classList.remove("blur-active");
        });

        this.startButton.addEventListener("click", () => {
            // this.musicManager.sound.play()
            document.body.classList.remove("blur-active");
            this.startButton.classList.add("decrease-opacity");
            
            this.musicManager.sounds.nappescrooollllo.play()
            // Attend 3 secondes (3000 ms) avant de vraiment cacher l'élément
            setTimeout(() => {
                this.startButton.style.display = "none";
            }, 1000);

        });
    }
    initImage() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // object-fit: fill — on force l'image à prendre toute la taille du canvas
        this.newWidth = this.canvas.width;
        this.newHeight = this.canvas.height;
        this.x = 0;
        this.y = 0;

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(this.image, this.x, this.y, this.newWidth, this.newHeight);

        // (optionnel, mais présent dans ton code)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, this.x, this.y, this.newWidth, this.newHeight);
    }


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
        } else {
            //send event to inform of completion and enable Scroll
            const completedIntro = new CustomEvent("completedIntro")
            document.dispatchEvent(completedIntro);
        }
    }

}