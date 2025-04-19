# Bauplanauskunft

[![Lint css files](https://github.com/oklabflensburg/open-area-map/actions/workflows/lint-css.yml/badge.svg)](https://github.com/oklabflensburg/open-area-map/actions/workflows/lint-css.yml)
[![Lint html files](https://github.com/oklabflensburg/open-area-map/actions/workflows/lint-html.yml/badge.svg)](https://github.com/oklabflensburg/open-area-map/actions/workflows/lint-html.yml)
[![Lint js files](https://github.com/oklabflensburg/open-area-map/actions/workflows/lint-js.yml/badge.svg)](https://github.com/oklabflensburg/open-area-map/actions/workflows/lint-js.yml)
[![Lighthouse CI](https://github.com/oklabflensburg/open-area-map/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/oklabflensburg/open-area-map/actions/workflows/lighthouse.yml)


![Screenshot der interaktiven Bauplanauskunft](https://raw.githubusercontent.com/oklabflensburg/open-area-map/main/screenshot_bauplanauskunft.webp)

_Haftungsausschluss: Dieses Repository und die zugehörige Datenbank befinden sich derzeit in einer Beta-Version. Einige Aspekte des Codes und der Daten können noch Fehler enthalten. Bitte kontaktieren Sie uns per E-Mail oder erstellen Sie ein Issue auf GitHub, wenn Sie einen Fehler entdecken._


## Hintergrund

Diese interaktive Karte wurde vom OK Lab Flensburg entwickelt, um Baupläne in Schleswig-Holstein digital und leicht zugänglich zu machen.


## Datenquelle

Die zugrundeliegenden Planungsdaten stammen vom Landesamt für Vermessung und Geoinformation Schleswig-Holstein. Der Datensatz kann im WFS Format über das [Open Data Portal]() Schleswig-Holstein heruntergeladen werden.


## Aktualität

Die Aktualität der zugrundeliegenden Daten entnehmen Sie bitte der Projektseite.


## Setup

Install system dependencies and clone repository

```
sudo apt install wget
sudo apt install git git-lfs
sudo apt install python3 python3-pip python3-venv

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null
sudo apt update
sudo apt install postgresql-16 postgis
sudo apt install gdal-bin

git clone https://github.com/oklabflensburg/open-area-map.git
```

Create a dot `.env` file inside the project root. Make sure to add the following content and repace values.

```
PARCEL_BASE_URL=http://localhost

PARCEL_CONTACT_MAIL=mail@example.com
PARCEL_CONTACT_PHONE="+49xx"

PARCEL_PRIVACY_CONTACT_PERSON="Firstname Lastname"

PARCEL_ADDRESS_NAME="Address Name"
PARCEL_ADDRESS_STREET="Address Street"
PARCEL_ADDRESS_HOUSE_NUMBER="House Number"
PARCEL_ADDRESS_POSTAL_CODE="Postal Code"
PARCEL_ADDRESS_CITY="City"

DB_PASS=postgres
DB_HOST=localhost
DB_USER=postgres
DB_NAME=postgres
DB_PORT=5432
```


---


## How to Contribute

Contributions are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on how to get involved.


---


## License

This repository is licensed under [CC0-1.0](LICENSE).
