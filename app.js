window.addEventListener('DOMContentLoaded', function () {

    class City {
        // Les propriétés de l'objet
        #id = 0
        #name = ""
        #icon = ""
        #temperature = 0
        #wind = 0
        #degree = 0
        #latitude = 0
        #longitude = 0
        #date = ""
        #dateFR = ""
        #optionDate = {}

        constructor(id = 0) {
            if (id > 0) {
                this.id = id;
                this.load();
            } else {
                console.error('Erreur sur chargement');
            }
        }

        static APPID = '3d4c37541fb7e40bb2948b81d5626b10';
        static ICON_PATH = 'http://openweathermap.org/img/wn/'
        static requestJSON = async (url) => {
            let response = await fetch(url);
            let json = await response.json();
            return json;
        }

        //Getters et setters
        get id() {
            return this.#id;
        }
        set id(_id) {
            this.#id = parseInt(_id);
        }
        get name() {
            return this.#name;
        }
        set name(_name) {
            this.#name = _name;
        }
        get icon() {
            return this.#icon;
        }
        set icon(_icon) {
            this.#icon = `${City.ICON_PATH}${_icon}.png`;
        }
        get temperature() {
            return this.#temperature;
        }
        set temperature(_temp) {
            this.#temperature = _temp;
        }
        get wind() {
            return this.#wind;
        }
        set wind(_wind) {
            this.#wind = _wind;
        }
        get degree() {
            return this.#degree;
        }
        set degree(_degree) {
            this.#degree = _degree;
        }
        get latitude() {
            return this.#latitude;
        }
        set latitude(_latitude) {
            this.#latitude = _latitude;
        }
        get longitude() {
            return this.#longitude;
        }
        set longitude(_longitude) {
            this.#longitude = _longitude;
        }
        get date() {
            return this.#date;
        }
        set date(_date) {
            this.#date = _date;
        }
        get optionDate() {
            return this.#optionDate;
        }
        set optionDate(_optionDate) {
            this.#optionDate = _optionDate;
        }
        get dateFR() {
            return this.#dateFR;
        }
        set dateFR(_dateFR) {
            this.#dateFR = _dateFR;
        }

        load = async () => {
            let infoCity = await City.requestJSON(`https://api.openweathermap.org/data/2.5/weather?id=${this.id}&units=metric&appid=${City.APPID}`);
            console.log('REQUETE JSON', infoCity)

            this.name = infoCity.name;
            this.icon = infoCity.weather[0].icon;
            this.temperature = infoCity.main.temp;
            this.wind = Math.floor(infoCity.wind.speed * 3.6);
            this.degree = infoCity.wind.deg - 180;
            this.latitude = (infoCity.coord.lat < 0) ? `${infoCity.coord.lat} °S` : `${infoCity.coord.lat} °N`;
            this.longitude = (infoCity.coord.lon < 0) ? `${infoCity.coord.lon} °O` : `${infoCity.coord.lon} °E`;
            this.date = new Date(infoCity.dt * 1000);
            this.optionDate = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
            this.dateFR = this.date.toLocaleString('fr-FR', this.optionDate);

            this.display();

            // DEBUG
            // console.log('NOM', this.name);
            // console.log('ICONE', this.icon);
            // console.log('TEMPERATURE', this.temperature);
            // console.log('VENT', this.wind);
            // console.log('ORIENTATION VENT', this.degree);
            // console.log('LATITUDE', this.latitude);
            // console.log('LONGITUDE', this.longitude);
            // console.log('DATE US', this.date);
            // console.log('OPTIONDATE', this.optionDate)
            // console.log('DATE FR', this.dateFR);

        }

        display = () => {

            let name = document.querySelector('#city');
            let weather = document.querySelector('#weather');
            let temp = document.querySelector('#temp');
            let wind = document.querySelector('#wind');
            let windDirection = document.querySelector('#direction');
            let long = document.querySelector('#long');
            let lat = document.querySelector('#lat');
            let dateReleve = document.querySelector('#date');

            name.innerHTML = this.name
            weather.src = this.icon;
            temp.innerHTML = `${this.temperature} °`;
            wind.innerHTML = this.wind;
            windDirection.style.transform = `rotate(${this.degree}deg)`;
            lat.innerHTML = this.latitude;
            long.innerHTML = this.longitude;
            dateReleve.innerHTML = `Dernier relevé : ${this.dateFR}`;
        }

    }


    let selectCity = document.querySelector('#select_city');
    let main = document.querySelector('main');
    let button = document.querySelector('#information_city');


    // Je récupère la liste des villes à analyser
    async function loadCityList() {

        let infoCities = await City.requestJSON('http://meteo.webboy.fr/');


        // Evenement au clique du bouton récupérer la ville
        button.addEventListener('click', function () {

            // On rend le bouton inutilisable
            button.setAttribute('disabled', '')
            // On affiche les infos dans le DOM
            main.style.display = "block";
            // J'ajoute en option les villes
            infoCities.forEach(city => {
                let option = document.createElement('option');
                option.value = city.id;
                option.innerHTML = city.name;

                selectCity.appendChild(option);
            });
            // Je charge les infos de la ville par défault
            loadCityData();
        })

        // Evenement sur le changement de la ville dans le select
        selectCity.addEventListener('change', loadCityData);


    }
    loadCityList();

    // Je récupère les infos de la ville dans le select
    async function loadCityData() {

        let id = selectCity.value;
        city = new City(id);
        // await city.load()

        // DEBUG
        // console.log('OBJECT CITY', city)

    }


})
