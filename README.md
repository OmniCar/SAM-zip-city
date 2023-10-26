# SAM zip-city
This library aims to do city lookups in a fast (client-side), generic way.

The script will dynamically load the appropriate file with zipcodes and city names for a given country.

This allows for smaller bundle size and means that the file(s) are only downloaded when needed.

## How to install
`npm install @omnicar/sam-zip-city` or `yarn add @omnicar/sam-zip-city`

## FAQ ##
Question:
> _But are all the zip code files inside the imported package?_
>
Answer: No, only the file(s) with the postal codes (zip codes) of the requested country are retrieved dynamically at run time.

Question:
> _From where are the file(s) with the postal codes (zip codes) fetched from?_
>
Answer: The postal codes are fetched from admin `dot` omnicar `dot` io `slash` data `slash` zip-codes `slash`

---

## How to use
```
import { getCityFromZip } from '@omnicar/sam-zip-city'

const myFunc = async () => {
  const city = await getCityFromZip({
    zipcode: 2300,
    country: 'DK' 
  })
  console.log(city)
}
```

Or to initialise a country before requesting a city:
```
import { initZipCityCountry } from '@omnicar/sam-zip-city'

const myOtherFunc = async () => {
  await initZipCityCountry({ country: 'DK' })
  console.log('Danish zipcodes and cities should be ready!')
}
```
