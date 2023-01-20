const countryFields = 'name,capital,popularion,flags,languages';
export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v2/nam3/${name}?fields=${countryFields}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
