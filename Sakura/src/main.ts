import { Intro } from "./intro.ts";
import { ScrollManager } from "./ScrollManager";

class Manager {
   
    scrollManager : ScrollManager;

    constructor() {
        this.initIntro();
        this.scrollManager = this.initScrollManager()
        document.addEventListener("completedIntro", () => {
            this.initScrollManager().enableScroll();
        });
        this.initSoundManager();
    }

    initScrollManager() {
        return new ScrollManager;
    }

    initSoundManager() {
        //probably going to have a class for that
    }

    initIntro(){
     new Intro()
    }
}



window.addEventListener("DOMContentLoaded", () => {new Manager})