import { data } from "./country_data.js";

const countryMap = new Map();

data.forEach((country) => {
  countryMap.set(country.code, country.name);
});

export const getCountryName = (code) => {
  return countryMap.get(code);
};

export const getCountryNameList = (codes) => {
  return codes.map((code) => getCountryName(code));
};
