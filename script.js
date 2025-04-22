
const countrySelect = document.getElementById('country-select');
const countryInfoDiv = document.getElementById('country-info');
const GachaResultDiv = document.getElementById('gacha-result');
const GachaResultCounter = document.getElementById('roll-counter');
let rollcounter = [0,0,0,0,0];
let capitalLat;
let capitalLnt;
let capitalWeather =[];

let countriesData = [];

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {

        data.sort((a,b)=>{
            const nameA = a.name.common.toLowerCase();
            const nameB = b.name.common.toLowerCase();
            return nameA.localeCompare(nameB);
        })

        countriesData.push(...data);

        const loadingOption = document.getElementById('loading-option');
        if (loadingOption) loadingOption.textContent = 'Choose a country';

        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca3;
            option.textContent = country.name.common;
            console.log(`Ajout de ${country.name.common} avec code: ${country.cca3}`);
            countrySelect.appendChild(option);
            countrySelect.children
        });
    })
    .catch(error => {
        console.error('Error fetching countries:', error);
    });


    countrySelect.addEventListener('change', (e) => {
        const selectedCode = e.target.value;
        console.log('Code sélectionné :', selectedCode);
        const country = countriesData.find(c => c.cca3 === selectedCode);
        console.log('Pays trouvé dans countriesData:', country);

        if(country.capitalInfo?.latlng) {
            capitalLat = country.capitalInfo.latlng[0];
            capitalLnt = country.capitalInfo.latlng[1];

            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${capitalLat}&longitude=${capitalLnt}&current=apparent_temperature,is_day,precipitation,cloud_cover&forecast_days=1&temporal_resolution=native`)
            .then(response => response.json())
            .then(data =>{
                capitalWeather = data;
                console.log(capitalWeather);
                let isDay;

                if(capitalWeather.current.is_day == 1)
                {
                    isDay = 'Day';
                } else {isDay = 'Night';}

                if(country) {
                    countryInfoDiv.innerHTML = `
                        <h2>${country.name.common}</h2>
                        <h3>Country Information</h3>
                        <img src="${country.flags.svg}" alt= "Flag of ${country.name.common}" width ='100'>
                        <p><strong>Capital: </strong> ${country.capital?.[0] || 'Unknown'}</p>
                        <p><strong>Population:</strong>${country.population.toLocaleString()}</p>

                        <h3>Capital current weather</h3>

                        <p><strong>Cloud Cover:</strong>${capitalWeather.current.cloud_cover.toLocaleString()} ${capitalWeather.current_units.cloud_cover}</p>
                        <p><strong>Temperature:</strong>${capitalWeather.current.apparent_temperature.toLocaleString()} ${capitalWeather.current_units.apparent_temperature}</p>
                        <p><strong>Current Precipitation:</strong>${capitalWeather.current.precipitation.toLocaleString()} ${capitalWeather.current_units.precipitation}</p>
                        <p><strong>Day or Night:</strong>${isDay}</p>

                    `;

                }
            }).catch(error =>{
                console.error(error);
            })
        }
        else{
            if(country) {
                countryInfoDiv.innerHTML = `
                    <h2>${country.name.common}</h2>
                    <h3>Country Information</h3>
                    <img src="${country.flags.svg}" alt= "Flag of ${country.name.common}" width ='100'>
                    <p><strong>Capital: </strong> "Unknown"</p>
                `;
            }
        }
    })

function myFunction(){
    var x = document.getElementById("myTopnav");
    if(x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}


function Roll(){
    let result = Math.random();
    console.log(result);
    if(result >= 0.99) { GachaResultDiv.innerHTML = `<h2>${result}</h2> <h3 style="background-color:Tomato;">Godlike</h3>`; rollcounter[4]++; console.log(rollcounter[4])}
    else{ if(result >= 0.95) { GachaResultDiv.innerHTML = `<h2>${result}</h2> <h3 style="background-color:Orange;">Legendary</h3>`; rollcounter[3]++; console.log(rollcounter[3])}
    else{ if(result >= 0.70) { GachaResultDiv.innerHTML = `<h2>${result}</h2> <h3 style="background-color:Violet;">Epic</h3>`; rollcounter[2]++; console.log(rollcounter[2])}
    else{ if(result >= 0.5) { GachaResultDiv.innerHTML = `<h2>${result}</h2> <h3 style="background-color:DodgerBlue;">Rare</h3>`; rollcounter[1]++; console.log(rollcounter[1])}
    else{ GachaResultDiv.innerHTML = `<h2>${result}</h2> <h3 style="background-color:Gray;">Common</h3>`; rollcounter[0]++; console.log(rollcounter[0])} } } }

    GachaResultCounter.innerHTML = `
        <h2>Roll Collection</h2>
        <h4 style="background-color:Tomato;"><strong>Godlike:</strong>${rollcounter[4]}
        <h4 style="background-color:Orange;"><strong>Legendary:</strong>${rollcounter[3]}
        <h4 style="background-color:Violet;"><strong>Epic:</strong>${rollcounter[2]}
        <h4 style="background-color:DodgerBlue;"><strong>Rare:</strong>${rollcounter[1]}
        <h4 style="background-color:Gray;"><strong>Common:</strong>${rollcounter[0]}
        `;
}
