import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const listClearing = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

const createCountryList = countries => {
  const countriesList = countries.map(country => {
    const countryDescription = document.createElement('li');
    countryDescription.className = "country-list__element"
    countryDescription.innerHTML = `<img src="${country.flags.svg}" alt="${country.name} flag" class="country-list__img">
    <span class="country-list__description">${country.name}</span>`;
    return countryDescription;
  });
  return countriesList;
};

const createCountryInfoList = (name, value) => {
  const countriesInfoList = document.createElement('li');
  countriesInfoList.innerHTML = `<span class="country-info__text"><strong>${name}:</strong> ${value}</span>`;
  return countriesInfoList;
};

const createCountryInfo = country => {
  const countryDescriptionBox = document.createElement('div');
  countryDescriptionBox.className = 'country-info__box';
  countryDescriptionBox.innerHTML = `<img src="${country.flags.svg}" alt="${country.name} flag" class="country-info__img"><span class="country-info__description">${country.name}</span>`;

  const countriesListPro = document.createElement('ul');
  countriesListPro.className = "country-info__details"

  const capitalInfo = createCountryInfoList('Capital', country.capital);
  const populationInfo = createCountryInfoList(
    'Population',
    country.population
  );
  const languagesInfo = createCountryInfoList(
    'Languages',
    country.languages.map(language => language.name).join(', ')
  );

  countriesListPro.append(capitalInfo, populationInfo, languagesInfo);
  return [countryDescriptionBox, countriesListPro];
};

const fetchingCountries = debounce(event => {
  const searchValue = event.target.value.trim();
  if (!searchValue) {
    listClearing();
    return;
  }

  listClearing();

  fetchCountries(event.target.value)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 1 && data.length < 11) {
        countryList.append(...createCountryList(data));
      } else {
        const [countryDescriptionBox, countriesListPro] = createCountryInfo(
          data[0]
        );
        countryInfo.innerHTML = '';
        countryInfo.append(countryDescriptionBox, countriesListPro);
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}, DEBOUNCE_DELAY);

searchInput.addEventListener('input', fetchingCountries);
