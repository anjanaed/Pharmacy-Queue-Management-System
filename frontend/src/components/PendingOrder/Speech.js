const SpeechUtil = {
  selectedVoice: null,
  onSpeakStart: null,
  onSpeakEnd: null,

  initialize(onStart, onEnd) {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const ladyVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("young") ||
          voice.name.toLowerCase().includes("zira")
      );
      this.selectedVoice = ladyVoice || voices[0];
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    this.onSpeakStart = onStart;
    this.onSpeakEnd = onEnd;
  },

  speak(value) {
    const text = "Order Number " + value ;

    if (!this.selectedVoice) {
      alert("No suitable voice is available.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    
    if (this.onSpeakStart) {
      this.onSpeakStart();
    }

    utterance.onend = () => {
      if (this.onSpeakEnd) {
        this.onSpeakEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  }
};

export default SpeechUtil;