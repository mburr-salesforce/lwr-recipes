import { LightningElement } from 'lwc';
// Generated ES echo modules
import lwrMessage from 'echo/LWR';
import helloMessage from 'echo/Hello World!';

export default class CustomApp extends LightningElement {
    message = '-';
    showPurple = false; // "purple"
    showBlue = false; // "navy"
    showRed = false; // "maroon"

    pickLwr() {
        this.message = lwrMessage;
    }

    pickHello() {
        this.message = helloMessage;
    }

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
