/**
 * ZuperVerse - Web Audio API Procedural Sound Engine
 * Zero external audio file dependencies - 100% offline & fast
 */
class ZuperSoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem("zuper_muted") === "true";
        this.bgmPlaying = false;
        this.bgmTimer = null;
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem("zuper_muted", this.muted);
        if (this.muted && this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmPlaying = false;
        }
        return this.muted;
    }

    playClick() {
        if (this.muted) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playJump() {
        if (this.muted) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playCoin() {
        if (this.muted) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    playCorrect() {
        if (this.muted) return;
        this.initContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "triangle";
            osc.frequency.value = freq;
            const startTime = this.ctx.currentTime + (idx * 0.07);
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 0.25);
        });
    }

    playWrong() {
        if (this.muted) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playLaserSpell() {
        if (this.muted) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playWarningAlarm() {
        if (this.muted) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playVictoryFanfare() {
        if (this.muted) return;
        this.initContext();
        const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "triangle";
            osc.frequency.value = freq;
            const startTime = this.ctx.currentTime + (idx * 0.1);
            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 1.2);
        });
    }
}

window.zuperSound = new ZuperSoundEngine();
