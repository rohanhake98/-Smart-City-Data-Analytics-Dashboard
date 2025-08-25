/**
 * Smart City Data Analytics Dashboard - Map Module
 * This file contains the implementation of the Interactive City Map Engine
 */

// Global map variables
let cityMap;
let currentMapLayer = 'traffic';
let mapLayers = {};
let markers = {};
let heatmapLayers = {};

// Sample data for demonstration
const sampleData = {
    traffic: {
        congestionPoints: [
            { lat: 40.7128, lng: -74.006, level: 'high', description: 'Heavy traffic on Main Street' },
            { lat: 40.7138, lng: -74.013, level: 'medium', description: 'Moderate congestion near Downtown' },
            { lat: 40.7118, lng: -74.009, level: 'low', description: 'Flowing traffic on Broadway' }
        ],
        incidents: [
            { lat: 40.7145, lng: -74.005, type: 'accident', description: 'Two-vehicle collision' },
            { lat: 40.7115, lng: -74.015, type: 'construction', description: 'Road work in progress' }
        ]
    },
    airQuality: {
        sensors: [
            { lat: 40.7128, lng: -74.006, aqi: 112, category: 'unhealthy_for_sensitive', pollutants: { pm25: 45, pm10: 38, no2: 25, o3: 70 } },
            { lat: 40.7148, lng: -74.016, aqi: 65, category: 'moderate', pollutants: { pm25: 20, pm10: 25, no2: 15, o3: 40 } },
            { lat: 40.7108, lng: -74.002, aqi: 35, category: 'good', pollutants: { pm25: 8, pm10: 15, no2: 10, o3: 30 } }
        ]
    },
    crime: {
        incidents: [
            { lat: 40.7138, lng: -74.003, type: 'theft', severity: 'low', time: '2023-05-15T14:30:00' },
            { lat: 40.7118, lng: -74.012, type: 'vandalism', severity: 'low', time: '2023-05-14T23:15:00' },
            { lat: 40.7158, lng: -74.008, type: 'assault', severity: 'medium', time: '2023-05-13T22:45:00' }
        ],
        heatmap: [
            [40.7138, -74.003, 0.5],
            [40.7118, -74.012, 0.3],
            [40.7158, -74.008, 0.7],
            [40.7128, -74.005, 0.4],
            [40.7148, -74.015, 0.2]
        ]
    },
    demographics: {
        neighborhoods: [
            { 
                name: 'Downtown',
                polygon: [
                    [40.7128, -74.006],
                    [40.7138, -74.013],
                    [40.7118, -74.009],
                    [40.7128, -74.006]
                ],
                population: 25000,
                density: 'high',
                income: 'mixed'
            },
            { 
                name: 'Westside',
                polygon: [
                    [40.7148, -74.016],
                    [40.7158, -74.023],
                    [40.7138, -74.019],
                    [40.7148, -74.016]
                ],
                population: 18000,
                density: 'medium',
                income: 'high'
            }
        ]
    }
};

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

/**
 * Initialize the city map
 */
function initializeMap() {
    // Create the map centered on a default location
    cityMap = L.map('city-map').setView([40.7128, -74.006], 13);
    
    // Add the base tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(cityMap);
    
    // Initialize map layers
    initializeMapLayers();
    
    // Show the default layer (traffic)
    switchMapLayer('traffic');
    
    // Add event listeners for map interactions
    cityMap.on('moveend', function() {
        loadDataForBounds(cityMap.getBounds());
    });
    
    // Initial data load
    loadDataForBounds(cityMap.getBounds());
}

/**
 * Initialize all map layers
 */
function initializeMapLayers() {
    // Create layer groups for each data type
    mapLayers = {
        traffic: L.layerGroup(),
        airQuality: L.layerGroup(),
        crime: L.layerGroup(),
        demographics: L.layerGroup()
    };
    
    // Add all layer groups to the map
    Object.values(mapLayers).forEach(layer => layer.addTo(cityMap));
    
    // Initialize marker collections
    markers = {
        traffic: [],
        airQuality: [],
        crime: [],
        demographics: []
    };
    
    // Initialize heatmap layers
    heatmapLayers = {};
}

/**
 * Switch between map layers
 * @param {string} layerType - The type of layer to display
 */
function switchMapLayer(layerType) {
    // Hide all layers
    Object.keys(mapLayers).forEach(key => {
        mapLayers[key].clearLayers();
    });
    
    // Update current layer type
    currentMapLayer = layerType;
    
    // Load data for the selected layer
    loadLayerData(layerType);
    
    // Update the legend
    updateLegend(layerType);
}

/**
 * Load data for the current map bounds
 * @param {L.LatLngBounds} bounds - The current map bounds
 */
function loadDataForBounds(bounds) {
    // In a real application, this would make an API call to fetch data
    // for the current bounds. For this demo, we'll use the sample data.
    console.log('Loading data for bounds:', bounds.toString());
    
    // Reload the current layer with potentially new data
    loadLayerData(currentMapLayer);
}

/**
 * Load data for a specific layer type
 * @param {string} layerType - The type of layer to load data for
 */
function loadLayerData(layerType) {
    // Clear existing markers for this layer
    markers[layerType] = [];
    mapLayers[layerType].clearLayers();
    
    // Load data based on layer type
    switch (layerType) {
        case 'traffic':
            loadTrafficData();
            break;
        case 'airQuality':
            loadAirQualityData();
            break;
        case 'crime':
            loadCrimeData();
            break;
        case 'demographics':
            loadDemographicsData();
            break;
    }
}

/**
 * Load traffic data onto the map
 */
function loadTrafficData() {
    const data = sampleData.traffic;
    
    // Add congestion points
    data.congestionPoints.forEach(point => {
        const color = getTrafficLevelColor(point.level);
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 8,
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 2
        }).bindPopup(`
            <strong>Traffic Level: ${capitalizeFirstLetter(point.level)}</strong><br>
            ${point.description}
        `);
        
        markers.traffic.push(marker);
        mapLayers.traffic.addLayer(marker);
    });
    
    // Add traffic incidents
    data.incidents.forEach(incident => {
        const icon = getTrafficIncidentIcon(incident.type);
        const marker = L.marker([incident.lat, incident.lng], { icon: icon })
            .bindPopup(`
                <strong>${capitalizeFirstLetter(incident.type)}</strong><br>
                ${incident.description}
            `);
        
        markers.traffic.push(marker);
        mapLayers.traffic.addLayer(marker);
    });
}

/**
 * Load air quality data onto the map
 */
function loadAirQualityData() {
    const data = sampleData.airQuality;
    
    // Add air quality sensors
    data.sensors.forEach(sensor => {
        const color = getAQIColor(sensor.category);
        const marker = L.circleMarker([sensor.lat, sensor.lng], {
            radius: 10,
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 2
        }).bindPopup(`
            <strong>Air Quality Index: ${sensor.aqi}</strong><br>
            <span style="color: ${color}">${formatAQICategory(sensor.category)}</span><br>
            <br>
            <strong>Pollutants:</strong><br>
            PM2.5: ${sensor.pollutants.pm25} μg/m³<br>
            PM10: ${sensor.pollutants.pm10} μg/m³<br>
            NO₂: ${sensor.pollutants.no2} ppb<br>
            O₃: ${sensor.pollutants.o3} ppb
        `);
        
        markers.airQuality.push(marker);
        mapLayers.airQuality.addLayer(marker);
    });
    
    // Create a gradient circle around each sensor
    data.sensors.forEach(sensor => {
        const color = getAQIColor(sensor.category);
        const circle = L.circle([sensor.lat, sensor.lng], {
            radius: 500,  // 500 meters radius
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            weight: 1
        });
        
        mapLayers.airQuality.addLayer(circle);
    });
}

/**
 * Load crime data onto the map
 */
function loadCrimeData() {
    const data = sampleData.crime;
    
    // Add crime incidents
    data.incidents.forEach(incident => {
        const icon = getCrimeIcon(incident.type);
        const marker = L.marker([incident.lat, incident.lng], { icon: icon })
            .bindPopup(`
                <strong>${capitalizeFirstLetter(incident.type)}</strong><br>
                Severity: ${capitalizeFirstLetter(incident.severity)}<br>
                Time: ${formatDateTime(new Date(incident.time))}
            `);
        
        markers.crime.push(marker);
        mapLayers.crime.addLayer(marker);
    });
    
    // Add crime heatmap if the heatmap library is available
    if (typeof L.heatLayer === 'function') {
        if (heatmapLayers.crime) {
            mapLayers.crime.removeLayer(heatmapLayers.crime);
        }
        
        heatmapLayers.crime = L.heatLayer(data.heatmap, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.6: 'yellow', 0.8: 'orange', 1.0: 'red' }
        });
        
        mapLayers.crime.addLayer(heatmapLayers.crime);
    } else {
        console.warn('Leaflet.heat plugin not available. Heatmap not displayed.');
    }
}

/**
 * Load demographics data onto the map
 */
function loadDemographicsData() {
    const data = sampleData.demographics;
    
    // Add neighborhood polygons
    data.neighborhoods.forEach(neighborhood => {
        const color = getDemographicsColor(neighborhood.density, neighborhood.income);
        const polygon = L.polygon(neighborhood.polygon, {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            weight: 2
        }).bindPopup(`
            <strong>${neighborhood.name}</strong><br>
            Population: ${neighborhood.population.toLocaleString()}<br>
            Density: ${capitalizeFirstLetter(neighborhood.density)}<br>
            Income Level: ${capitalizeFirstLetter(neighborhood.income)}
        `);
        
        mapLayers.demographics.addLayer(polygon);
    });
    
    // Add population density labels
    data.neighborhoods.forEach(neighborhood => {
        // Calculate center of polygon
        const bounds = L.polygon(neighborhood.polygon).getBounds();
        const center = bounds.getCenter();
        
        // Add a label
        const icon = L.divIcon({
            className: 'demographics-label',
            html: `<div>${neighborhood.name}<br>${neighborhood.population.toLocaleString()}</div>`,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
        });
        
        const marker = L.marker(center, { icon: icon });
        mapLayers.demographics.addLayer(marker);
    });
}

/**
 * Update the map legend based on the current layer
 * @param {string} layerType - The current layer type
 */
function updateLegend(layerType) {
    const legendContent = document.getElementById('legend-content');
    let legendHTML = '';
    
    switch (layerType) {
        case 'traffic':
            legendHTML = `
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #ff0000;"></span>
                    <span>High Congestion</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #ffa500;"></span>
                    <span>Medium Congestion</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #008000;"></span>
                    <span>Low Congestion</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon"><i class="fas fa-car-crash"></i></span>
                    <span>Accident</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon"><i class="fas fa-hard-hat"></i></span>
                    <span>Construction</span>
                </div>
            `;
            break;
        case 'airQuality':
            legendHTML = `
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #009966;"></span>
                    <span>Good (0-50)</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #ffde33;"></span>
                    <span>Moderate (51-100)</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #ff9933;"></span>
                    <span>Unhealthy for Sensitive Groups (101-150)</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #cc0033;"></span>
                    <span>Unhealthy (151-200)</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #660099;"></span>
                    <span>Very Unhealthy (201-300)</span>
                </div>
            `;
            break;
        case 'crime':
            legendHTML = `
                <div class="legend-item">
                    <span class="legend-icon"><i class="fas fa-shopping-bag"></i></span>
                    <span>Theft</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon"><i class="fas fa-spray-can"></i></span>
                    <span>Vandalism</span>
                </div>
                <div class="legend-item">
                    <span class="legend-icon"><i class="fas fa-fist-raised"></i></span>
                    <span>Assault</span>
                </div>
                <div class="legend-item">
                    <span class="legend-gradient"></span>
                    <span>Crime Density</span>
                </div>
            `;
            break;
        case 'demographics':
            legendHTML = `
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #1a9641;"></span>
                    <span>High Income, Low Density</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #a6d96a;"></span>
                    <span>High Income, Medium Density</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #ffffbf;"></span>
                    <span>Mixed Income</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #fdae61;"></span>
                    <span>Low Income, Medium Density</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #d7191c;"></span>
                    <span>Low Income, High Density</span>
                </div>
            `;
            break;
    }
    
    // Add CSS for legend items if not already in the stylesheet
    if (!document.getElementById('legend-styles')) {
        const style = document.createElement('style');
        style.id = 'legend-styles';
        style.innerHTML = `
            .legend-item {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                font-size: 12px;
            }
            .legend-color {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                margin-right: 5px;
                display: inline-block;
            }
            .legend-icon {
                width: 15px;
                text-align: center;
                margin-right: 5px;
            }
            .legend-gradient {
                width: 15px;
                height: 15px;
                margin-right: 5px;
                background: linear-gradient(to right, blue, yellow, red);
            }
        `;
        document.head.appendChild(style);
    }
    
    legendContent.innerHTML = legendHTML;
}

/**
 * Search for a location on the map
 * @param {string} query - The search query
 */
function searchLocation(query) {
    // In a real application, this would use a geocoding service
    // For this demo, we'll just log the query and show a notification
    console.log('Searching for location:', query);
    
    // Simulate a search result
    setTimeout(() => {
        // Random location near the center for demo purposes
        const lat = 40.7128 + (Math.random() - 0.5) * 0.01;
        const lng = -74.006 + (Math.random() - 0.5) * 0.01;
        
        // Pan to the location
        cityMap.setView([lat, lng], 16);
        
        // Add a temporary marker
        const searchMarker = L.marker([lat, lng])
            .addTo(cityMap)
            .bindPopup(`<strong>Search Result: ${query}</strong>`)
            .openPopup();
        
        // Remove the marker after 5 seconds
        setTimeout(() => {
            cityMap.removeLayer(searchMarker);
        }, 5000);
        
        // Show notification
        if (typeof showNotification === 'function') {
            showNotification(`Location found: ${query}`, 'success');
        }
    }, 500);
}

/**
 * Update map data based on selected date
 * @param {Date} date - The selected date
 */
function updateMapData(date) {
    console.log('Updating map data for date:', date);
    // In a real application, this would fetch historical data for the selected date
    // For this demo, we'll just reload the current layer
    loadLayerData(currentMapLayer);
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification(`Map data updated for ${formatDate(date)}`, 'info');
    }
}

// Helper functions

/**
 * Get color for traffic congestion level
 * @param {string} level - The congestion level (high, medium, low)
 * @returns {string} - Color code
 */
function getTrafficLevelColor(level) {
    switch (level.toLowerCase()) {
        case 'high': return '#ff0000';  // Red
        case 'medium': return '#ffa500';  // Orange
        case 'low': return '#008000';  // Green
        default: return '#808080';  // Gray
    }
}

/**
 * Get icon for traffic incident
 * @param {string} type - The incident type
 * @returns {L.Icon} - Leaflet icon
 */
function getTrafficIncidentIcon(type) {
    let iconClass = 'fas fa-exclamation-triangle';
    let iconColor = '#ff0000';
    
    switch (type.toLowerCase()) {
        case 'accident':
            iconClass = 'fas fa-car-crash';
            break;
        case 'construction':
            iconClass = 'fas fa-hard-hat';
            iconColor = '#ffa500';
            break;
    }
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: white; border-radius: 50%; padding: 5px; box-shadow: 0 0 3px rgba(0,0,0,0.3);"><i class="${iconClass}" style="color: ${iconColor};"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

/**
 * Get color for AQI category
 * @param {string} category - The AQI category
 * @returns {string} - Color code
 */
function getAQIColor(category) {
    switch (category.toLowerCase()) {
        case 'good': return '#009966';  // Green
        case 'moderate': return '#ffde33';  // Yellow
        case 'unhealthy_for_sensitive': return '#ff9933';  // Orange
        case 'unhealthy': return '#cc0033';  // Red
        case 'very_unhealthy': return '#660099';  // Purple
        case 'hazardous': return '#7e0023';  // Maroon
        default: return '#808080';  // Gray
    }
}

/**
 * Format AQI category for display
 * @param {string} category - The AQI category
 * @returns {string} - Formatted category
 */
function formatAQICategory(category) {
    switch (category.toLowerCase()) {
        case 'good': return 'Good';
        case 'moderate': return 'Moderate';
        case 'unhealthy_for_sensitive': return 'Unhealthy for Sensitive Groups';
        case 'unhealthy': return 'Unhealthy';
        case 'very_unhealthy': return 'Very Unhealthy';
        case 'hazardous': return 'Hazardous';
        default: return category;
    }
}

/**
 * Get icon for crime incident
 * @param {string} type - The crime type
 * @returns {L.Icon} - Leaflet icon
 */
function getCrimeIcon(type) {
    let iconClass = 'fas fa-exclamation-circle';
    let iconColor = '#ff0000';
    
    switch (type.toLowerCase()) {
        case 'theft':
            iconClass = 'fas fa-shopping-bag';
            iconColor = '#3498db';
            break;
        case 'vandalism':
            iconClass = 'fas fa-spray-can';
            iconColor = '#9b59b6';
            break;
        case 'assault':
            iconClass = 'fas fa-fist-raised';
            iconColor = '#e74c3c';
            break;
    }
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: white; border-radius: 50%; padding: 5px; box-shadow: 0 0 3px rgba(0,0,0,0.3);"><i class="${iconClass}" style="color: ${iconColor};"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

/**
 * Get color for demographics data
 * @param {string} density - Population density (high, medium, low)
 * @param {string} income - Income level (high, medium, low, mixed)
 * @returns {string} - Color code
 */
function getDemographicsColor(density, income) {
    if (income === 'high') {
        if (density === 'low') return '#1a9641';  // Dark green
        if (density === 'medium') return '#a6d96a';  // Light green
        if (density === 'high') return '#ffffbf';  // Yellow
    } else if (income === 'mixed') {
        return '#ffffbf';  // Yellow
    } else if (income === 'low') {
        if (density === 'low') return '#fdae61';  // Light orange
        if (density === 'medium') return '#fdae61';  // Orange
        if (density === 'high') return '#d7191c';  // Red
    }
    
    return '#808080';  // Gray default
}

/**
 * Format date and time for display
 * @param {Date} dateTime - The date and time to format
 * @returns {string} - Formatted date and time
 */
function formatDateTime(dateTime) {
    return dateTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export functions for use in other modules
window.switchMapLayer = switchMapLayer;
window.searchLocation = searchLocation;
window.updateMapData = updateMapData;