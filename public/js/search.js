import axios from 'axios';

const showSearchedResults = (words) => {
  console.log(words);
  const searchResults = document.querySelector('#search-results');
  searchResults.classList.remove('hide');
  if (words.length > 0) {
    searchResults.innerHTML = '';
    for (const word of words) {
      const listItem = `<li><a href="/words/${word.slug}">${word.spelling}</a></li>`;
      searchResults.innerHTML += listItem;
    }
  } else {
    searchResults.innerHTML = '<li>NO RESULTS</li>';
  }
};
export const searchWords = async (str) => {
  try {
    console.log(`${window.location.origin}/api/v1/words`);
    const res = await axios({
      url: `${window.location.origin}/api/v1/words`,
      method: 'GET',
      params: { search: str },
    });

    if (res.data.status === 'success') {
      showSearchedResults(res.data.data.data);
    }
  } catch (error) {
    console.error(error);
  }
};
