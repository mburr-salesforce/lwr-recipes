import { LightningElement } from 'lwc';

export default class CustomApp extends LightningElement {
    showPurple = false; // "purple"
    showBlue = false;   // "navy"
    showRed = false;    // "maroon"

    pickPurple() {
        this.showPurple = true;
        this.showBlue = false;
        this.showRed = false;
    }

    pickBlue() {
        this.showPurple = false;
        this.showBlue = true;
        this.showRed = false;
    }

    pickRed() {
        this.showPurple = false;
        this.showBlue = false;
        this.showRed = true;
    }
}