import { ScrollManager } from "./ScrollManager";

class Manager {
    constructor() {
        this.initScrollManager()
        this.initSoundManager()
    }

    initScrollManager() {
        new ScrollManager;
    }

    initSoundManager() {
        //probably going to have a class for that
    }

}

window.addEventListener("DOMContentLoaded", () => {new Manager})