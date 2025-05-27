import { Intro } from "./intro.ts";
import { ScrollManager } from "./ScrollManager";
import { MusicManager } from "./MusicManager.ts";

class Manager {
    musicManager: MusicManager;
   
    constructor() {
        
        this.initMusicManager()      
        this.initIntro()
        document.addEventListener("completedIntro", () => {
            this.initScrollManager()
        })
    }

    initScrollManager() {
        new ScrollManager(this.musicManager);
    }

    initMusicManager(){
        console.log("init music manager")
        this.musicManager = new MusicManager();
    }
      
    initIntro(){
        new Intro(this.musicManager)
       }
}



window.addEventListener("DOMContentLoaded", () => {new Manager})