const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export const speechToText = (func, searchInput) => {
  recognition.start();
  recognition.addEventListener('result', async (event) => {
    console.log(event.results);
    searchInput.value = event.results[0][0].transcript;
    console.log('FROM SPEECH RECOGNITION!! WHAT I HEARD: ', searchInput.value);
    try {
      await func(searchInput.value);
    } catch (error) {
      console.log(error);
    }
  });
};
