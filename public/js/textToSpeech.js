const synth = window.speechSynthesis;
let voices = [];

const filterVoices = (synthObj, voiceNames) =>
  synthObj.getVoices().filter((voice) => voiceNames.includes(voice.name));

export const populateVoices = (...voiceNames) => {
  if (!synth.onvoiceschanged) {
    console.log(synth.onvoiceschanged);
    synth.addEventListener('voiceschanged', (event) => {
      console.log('VOICES ARE READY');
      voices = filterVoices(event.target, voiceNames);

      console.log(synth);
    });
  }

  voices = filterVoices(synth, voiceNames);
};

export const speakerHandler = (
  wordSpelling,
  pronunciationAccent,
  pitch = 1,
  rate = 0.8
) => {
  const utterThis = new SpeechSynthesisUtterance(wordSpelling);

  console.log(voices);

  for (const voice of voices)
    if (voice.name.includes(pronunciationAccent)) {
      utterThis.voice = voice;
      utterThis.lang = voice.lang;
    }

  utterThis.pitch = pitch;
  utterThis.rate = rate;

  console.log(utterThis);

  synth.speak(utterThis);
};
