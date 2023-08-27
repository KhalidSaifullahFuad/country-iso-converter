import { getCountryName } from "./converter.js";

const isoCodeInput = document.querySelector("#iso_code_input");
const countryOuput = document.querySelector("#country_output");
const convertButton = document.querySelector("#convert_btn");
const copyToClipboardButton = document.querySelector("#copy_to_clipboard");
const clearButton = document.querySelector("#clear_btn");
const inputErrorMessage = document.querySelector("#input_error_message");
const outputErrorMessage = document.querySelector("#output_error_message");

function setInputError(message) {
  inputErrorMessage.style.color = "#f44336";
  inputErrorMessage.innerHTML = message;
}

function setOutputError(message) {
  outputErrorMessage.style.color = "#f44336";
  outputErrorMessage.innerHTML = message;
}

function formatInput(isoCode) {
  const countryCodeList = isoCode.split("\n");
  const formattedCountryCode = countryCodeList.map((countryCode) => {
    if (countryCode.length > 2 || countryCode.length < 2) {
      setInputError("Country code should be 2 characters long");
    }
    return countryCode.toUpperCase().trim();
  });

  return formattedCountryCode;
}

function getCountryList(countryCodeList) {
  const invalidCodes = [];

  let countryList = countryCodeList.map((countryCode) => {
    const countryName = getCountryName(countryCode);
    if (countryCode.length === 2 && countryName) {
      return countryName;
    } else {
      invalidCodes.push(countryCode);
    }
  });

  countryList = countryList.filter((countryName) => countryName);

  if (invalidCodes.length > 0)
    setOutputError(
      'Country not found for Code "' + invalidCodes.join(",") + '"'
    );

  return countryList;
}

function deduplicateCountryList(countryList) {
  const countryMap = new Map();
  for (const countryName of countryList) {
    const count = countryMap.get(countryName);
    countryMap.set(countryName, count ? count + 1 : 1);
  }

  const updatedCountryList = [];
  countryMap.forEach((count, countryName) =>
    updatedCountryList.push(
      count > 1 ? countryName + " (" + count + ")" : countryName
    )
  );

  return updatedCountryList;
}
``;

window.addEventListener("load", () => {
  isoCodeInput.placeholder = "Example Country Codes:\nUS\nGB\nBD";
});

isoCodeInput.addEventListener("input", () => {
  inputErrorMessage.innerHTML = "";
  outputErrorMessage.innerHTML = "";
});

convertButton.addEventListener("click", () => {
  const isoCode = isoCodeInput.value;

  if (isoCode === "") {
    setInputError("Please enter country codes");
    return;
  }

  const formattedCountryCode = formatInput(isoCode);
  const countryList = getCountryList(formattedCountryCode);
  const deduplicatedCountryList = deduplicateCountryList(countryList);

  countryOuput.value = deduplicatedCountryList.join("\n");
});

copyToClipboardButton.addEventListener("click", () => {
  const countryCodes = countryOuput.value;

  if (countryCodes === "") {
    setInputError("Please convert country codes first");
    return;
  }

  navigator.clipboard.writeText(countryCodes).then(
    () => {
      outputErrorMessage.style.color = "#4CAF50";
      outputErrorMessage.innerHTML = "Copied to clipboard";

      setTimeout(() => {
        outputErrorMessage.innerHTML = "";
      }, 3000);
    },
    () => {
      setOutputError("Failed to copy to clipboard");
    }
  );
});

clearButton.addEventListener("click", () => {
  isoCodeInput.value = "";
  countryOuput.value = "";
  inputErrorMessage.innerHTML = "";
  outputErrorMessage.innerHTML = "";
});
