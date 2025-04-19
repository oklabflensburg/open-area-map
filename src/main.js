import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Env } from './env.js'


const env = new Env()
env.injectLinkContent('.contact-mail', 'mailto:', '', env.contactMail, 'E-Mail')


const center = [54.79443515, 9.43205485]
const map = L.map('map', {
  zoomControl: false
}).setView(center, 13)

let currentLayer = null


function formatPlaceName(placeName) {
  const reversePlaceName = placeName.split(', ').reverse().join(' ')

  return reversePlaceName
}


function formatDate(value) {
  const date = new Date(value)
  return date.toLocaleDateString('de-DE')
}


function formatToAreaNumber(number) {
  const unit = 'ha'
  const value = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)

  return `${value} ${unit}`
}


function renderXplanMeta(data) {
  if (currentLayer) {
    map.removeLayer(currentLayer)
  }

  const geoJsonData = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': data['geojson']['type'],
        'coordinates': data['geojson']['coordinates']
      },
      'properties': {}
    }]
  }

  currentLayer = L.geoJSON(geoJsonData, {
    style: {
      color: '#2463eb',
      weight: 4,
      fillOpacity: 0.2
    }
  }).addTo(map)

  map.fitBounds(currentLayer.getBounds())
  console.log(data)

  let detailOutput = ''

  if (data['plan_name']) {
    detailOutput += `<li class="list-group-item">
      <span class="font-bold">Name:</span><br>
      <span>${data['plan_name']}</span>
    </li>`
  }

  if (data['plan_number']) {
    detailOutput += `<li class="list-group-item">
      <span class="font-bold">Plan Nummer:</span><br>
      <span>${data['plan_number']}</span>
    </li>`
  }

  if (data['municipality']) {
    const formattedMunicipality = data['municipality']
      .replace(/^\[|\]$/g, '') // Remove brackets
      .split('|') // Split on pipe
      .join('<br>'); // Join with <br>
    
    detailOutput += `<li class="list-group-item">
      <span class="font-bold">Gemeinde:</span><br>
      <span>${formattedMunicipality}</span>
    </li>`;
  }

  if (data['description']) {
    detailOutput += `<li class="list-group-item">
      <span class="font-bold">Beschreibung:</span><br>
      <span>${data['description']}</span>
    </li>`
  }

  document.querySelector('#detailList').innerHTML = detailOutput
  document.querySelector('#sidebar').classList.remove('hidden')
  document.querySelector('#sidebar').classList.add('absolute')
  document.querySelector('#about').classList.add('hidden')
  document.querySelector('#sidebarContent').classList.remove('hidden')
  document.querySelector('#sidebarContentCloseButton').classList.remove('hidden')
}


function cleanXplanMeta() {
  if (currentLayer) {
    map.removeLayer(currentLayer)
  }

  document.querySelector('#detailList').innerHTML = ''
  document.querySelector('#sidebar').classList.add('hidden')
  document.querySelector('#sidebar').classList.remove('absolute')
  document.querySelector('#about').classList.remove('hidden')
  document.querySelector('#sidebarContent').classList.add('hidden')
}


function fetchXplanMeta(lat, lng) {
  const url = `https://api.oklabflensburg.de/xplan/v1/point?lat=${lat}&lng=${lng}`

  try {
    fetch(url, {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      renderXplanMeta(data)
    }).catch(function (error) {
      cleanXplanMeta()
    })
  }
  catch {
    cleanXplanMeta()
  }
}


function updateScreen(screen) {
  const title = 'Bauplanauskunft für Schleswig-Holstein'

  if (screen === 'home') {
    document.querySelector('title').innerHTML = title
    document.querySelector('meta[property="og:title"]').setAttribute('content', title)
  }
}


function handleWindowSize() {
  const innerWidth = window.innerWidth

  return true
}


document.addEventListener('DOMContentLoaded', function () {
  L.tileLayer('https://tiles.oklabflensburg.de/sgm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    maxNativeZoom: 20,
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="dc:rights">OpenStreetMap</a> contributors'
  }).addTo(map)

  L.tileLayer('https://tiles.oklabflensburg.de/xplan/{z}/{x}/{y}.png', {
    maxZoom: 20,
    maxNativeZoom: 20,
    attribution: '<a href="https://www.govdata.de/dl-de/by-2-0" rel="dc:rights">dl-de/by-2-0</a>, © <a href="https://www.gdi-sh.de" rel="dc:rights">GDI-SH</a>'
  }).addTo(map)

  map.on('click', function (e) {
    const lat = e.latlng.lat
    const lng = e.latlng.lng

    fetchXplanMeta(lat, lng)
  })

  document.querySelector('#sidebarContentCloseButton').addEventListener('click', function (e) {
    e.preventDefault()

    cleanXplanMeta()
  })

  document.querySelector('#sidebarCloseButton').addEventListener('click', function (e) {
    e.preventDefault()

    document.querySelector('#sidebar').classList.add('sm:h-dvh')
    document.querySelector('#sidebar').classList.remove('absolute', 'h-dvh')
    document.querySelector('#sidebarCloseWrapper').classList.add('hidden')
    document.querySelector('#sidebarContentCloseButton').classList.add('hidden')

    history.replaceState({ screen: 'home' }, '', '/')
  })
})


window.onload = () => {
  if (!history.state) {
    history.replaceState({ screen: 'home' }, '', '/')
  }
}

// Handle popstate event when navigating back/forward in the history
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.screen === 'home') {
    document.querySelector('#sidebar').classList.add('sm:h-dvh')
    document.querySelector('#sidebar').classList.remove('absolute', 'h-dvh')
    document.querySelector('#sidebarCloseWrapper').classList.add('hidden')
  }
  else {
    updateScreen('home')
  }
})


// Attach the resize event listener, but ensure proper function reference
window.addEventListener('resize', handleWindowSize)

// Trigger the function initially to handle the initial screen size
handleWindowSize()