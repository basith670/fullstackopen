import { useEffect, useState } from 'react'
import axios from 'axios'

const baseUrl =
  'https://studies.cs.helsinki.fi/restcountries/api'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital?.[0]

  const languages = Object.values(
    country.languages || {}
  )

  useEffect(() => {
    if (!capital) {
      setWeather(null)
      return
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          capital
        )}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Weather request failed:', error)
        setWeather(null)
      })
  }, [capital])

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>
        capital {capital}
      </p>

      <p>
        area {country.area}
      </p>

      <h2>languages:</h2>

      <ul>
        {languages.map(language => (
          <li key={language}>
            {language}
          </li>
        ))}
      </ul>

      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />

      <h2>Weather in {capital}</h2>

      {weather ? (
        <div>
          <p>
            temperature {weather.main.temp} Celsius
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <p>
            {weather.weather[0].description}
          </p>

          <p>
            wind {weather.wind.speed} m/s
          </p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (search.trim() === '') {
      setCountries([])
      setSelectedCountry(null)
      return
    }

    axios
      .get(`${baseUrl}/all`)
      .then(response => {
        const filteredCountries = response.data.filter(country =>
          country.name.common
            .toLowerCase()
            .includes(search.toLowerCase())
        )

        setCountries(filteredCountries)

        if (filteredCountries.length === 1) {
          setSelectedCountry(filteredCountries[0])
        } else {
          setSelectedCountry(null)
        }
      })
      .catch(error => {
        console.error(error)
      })
  }, [search])

  const handleSearchChange = event => {
    setSearch(event.target.value)
  }

  const showCountry = country => {
    setSelectedCountry(country)
  }

  return (
    <div className="app">
      <h1>Find countries</h1>

      <div>
        find countries{' '}
        <input
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {countries.length > 10 && (
        <p>
          Too many matches, specify another filter
        </p>
      )}

      {countries.length > 1 &&
        countries.length <= 10 &&
        selectedCountry === null && (
          <div>
            {countries.map(country => (
              <div key={country.cca3}>
                {country.name.common}{' '}
                <button
                  onClick={() => showCountry(country)}
                >
                  show
                </button>
              </div>
            ))}
          </div>
        )}

      {selectedCountry && (
        <Country country={selectedCountry} />
      )}
    </div>
  )
}

export default App