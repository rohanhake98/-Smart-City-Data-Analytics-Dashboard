/**
 * Smart City Data Analytics Dashboard - Traffic Module
 * This file contains the implementation of the Predictive Traffic Flow Model
 */

// Traffic Predictor class for traffic analysis and prediction
class TrafficPredictor {
    constructor() {
        this.historicalData = new Map();
        this.realTimeData = new Map();
        this.predictions = new Map();
        this.initialized = false;
        
        // Sample ML model weights (in a real application, these would be trained)
        this.mlModelWeights = {
            historical: 0.6,
            realTime: 0.3,
            weather: 0.1
        };
    }
    
    /**
     * Initialize the traffic predictor with sample data
     */
    initialize() {
        if (this.initialized) return;
        
        // Load sample historical data
        this.loadSampleHistoricalData();
        
        // Load sample real-time data
        this.loadSampleRealTimeData();
        
        // Generate initial predictions
        this.generateAllPredictions();
        
        this.initialized = true;
        console.log('Traffic Predictor initialized');
    }
    
    /**
     * Load sample historical traffic data
     */
    loadSampleHistoricalData() {
        // Sample routes
        const routes = [
            'route_001', 'route_002', 'route_003', 'route_004', 'route_005'
        ];
        
        // Generate historical data for each route
        routes.forEach(routeId => {
            // Create data for different days of the week and times of day
            const weekdayMorning = this.generateSampleTrafficPattern(70, 90);
            const weekdayAfternoon = this.generateSampleTrafficPattern(50, 70);
            const weekdayEvening = this.generateSampleTrafficPattern(75, 95);
            const weekendMorning = this.generateSampleTrafficPattern(30, 50);
            const weekendAfternoon = this.generateSampleTrafficPattern(60, 80);
            const weekendEvening = this.generateSampleTrafficPattern(40, 60);
            
            this.historicalData.set(routeId, {
                weekday: {
                    morning: weekdayMorning,
                    afternoon: weekdayAfternoon,
                    evening: weekdayEvening
                },
                weekend: {
                    morning: weekendMorning,
                    afternoon: weekendAfternoon,
                    evening: weekendEvening
                }
            });
        });
    }
    
    /**
     * Generate a sample traffic pattern
     * @param {number} minCongestion - Minimum congestion percentage
     * @param {number} maxCongestion - Maximum congestion percentage
     * @returns {Array} - Array of congestion values
     */
    generateSampleTrafficPattern(minCongestion, maxCongestion) {
        const pattern = [];
        const hours = 3; // 3-hour time period
        const pointsPerHour = 12; // 5-minute intervals
        
        for (let i = 0; i < hours * pointsPerHour; i++) {
            // Create a realistic pattern with some randomness
            const baseValue = minCongestion + (maxCongestion - minCongestion) * 
                Math.sin(Math.PI * (i / (hours * pointsPerHour)));
            
            // Add some noise
            const noise = (Math.random() - 0.5) * 10;
            
            // Ensure the value stays within bounds
            let value = baseValue + noise;
            value = Math.max(minCongestion, Math.min(maxCongestion, value));
            
            pattern.push(Math.round(value));
        }
        
        return pattern;
    }
    
    /**
     * Load sample real-time traffic data
     */
    loadSampleRealTimeData() {
        // Sample routes
        const routes = [
            'route_001', 'route_002', 'route_003', 'route_004', 'route_005'
        ];
        
        // Generate real-time data for each route
        routes.forEach(routeId => {
            // Get the historical data for this route and time period
            const historicalData = this.getHistoricalPattern(routeId);
            
            // Create real-time data based on historical with some variation
            const realTimeData = historicalData.map(value => {
                // Add some random variation
                const variation = (Math.random() - 0.5) * 20;
                let newValue = value + variation;
                
                // Ensure the value stays within bounds
                newValue = Math.max(0, Math.min(100, newValue));
                
                return Math.round(newValue);
            });
            
            // Add some incidents randomly
            const incidents = [];
            if (Math.random() > 0.7) {
                incidents.push({
                    type: this.getRandomIncidentType(),
                    location: `${Math.floor(Math.random() * 100)}% along route`,
                    severity: Math.floor(Math.random() * 5) + 1,
                    timestamp: new Date().toISOString()
                });
            }
            
            this.realTimeData.set(routeId, {
                congestion: realTimeData,
                speed: this.congestionToSpeed(realTimeData),
                travelTime: this.congestionToTravelTime(realTimeData, routeId),
                incidents: incidents,
                lastUpdated: new Date().toISOString()
            });
        });
    }
    
    /**
     * Get a random incident type
     * @returns {string} - Random incident type
     */
    getRandomIncidentType() {
        const types = ['accident', 'construction', 'event', 'weather', 'breakdown'];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    /**
     * Convert congestion percentage to speed (mph)
     * @param {Array} congestion - Array of congestion percentages
     * @returns {Array} - Array of speeds
     */
    congestionToSpeed(congestion) {
        // Simple conversion: 0% congestion = 60mph, 100% congestion = 5mph
        return congestion.map(value => {
            return Math.round(60 - (value / 100) * 55);
        });
    }
    
    /**
     * Convert congestion percentage to travel time (minutes)
     * @param {Array} congestion - Array of congestion percentages
     * @param {string} routeId - Route identifier
     * @returns {Array} - Array of travel times
     */
    congestionToTravelTime(congestion, routeId) {
        // Get a base travel time for the route (would be based on distance in real app)
        const baseTime = 10 + (parseInt(routeId.split('_')[1]) % 5) * 2; // 10-18 minutes
        
        // Convert congestion to travel time multiplier
        return congestion.map(value => {
            // 0% congestion = 1x multiplier, 100% congestion = 3x multiplier
            const multiplier = 1 + (value / 100) * 2;
            return Math.round(baseTime * multiplier);
        });
    }
    
    /**
     * Get the appropriate historical pattern for the current time
     * @param {string} routeId - Route identifier
     * @returns {Array} - Historical traffic pattern
     */
    getHistoricalPattern(routeId) {
        const now = new Date();
        const hour = now.getHours();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        
        const dayType = isWeekend ? 'weekend' : 'weekday';
        let timeOfDay;
        
        if (hour >= 6 && hour < 12) {
            timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 18) {
            timeOfDay = 'afternoon';
        } else {
            timeOfDay = 'evening';
        }
        
        const routeData = this.historicalData.get(routeId);
        if (!routeData) return [];
        
        return routeData[dayType][timeOfDay];
    }
    
    /**
     * Get current traffic conditions for a route
     * @param {string} routeId - Route identifier
     * @returns {Object} - Current traffic conditions
     */
    async getCurrentConditions(routeId) {
        // In a real application, this would fetch data from an API
        // For this demo, we'll use the sample data
        return this.realTimeData.get(routeId) || { congestion: [], speed: [], travelTime: [] };
    }
    
    /**
     * Generate traffic prediction for a specific route
     * @param {string} routeId - Route identifier
     * @param {number} timeHorizon - Time horizon in minutes (15, 30, 60)
     * @returns {Object} - Traffic prediction
     */
    async generatePrediction(routeId, timeHorizon) {
        // Get historical pattern
        const historical = this.getHistoricalPattern(routeId);
        
        // Get current conditions
        const current = await this.getCurrentConditions(routeId);
        
        // Simple prediction model: weighted average of historical and real-time data
        // with some random variation to simulate ML prediction
        const prediction = {
            congestion: [],
            speed: [],
            travelTime: []
        };
        
        // Number of data points to predict (based on time horizon)
        const pointsToPredict = timeHorizon / 5; // 5-minute intervals
        
        for (let i = 0; i < pointsToPredict; i++) {
            // Get the current index in the data
            const currentIndex = i % current.congestion.length;
            const historicalIndex = (currentIndex + Math.floor(Date.now() / 300000)) % historical.length;
            
            // Get the values
            const currentCongestion = current.congestion[currentIndex] || 50;
            const historicalCongestion = historical[historicalIndex] || 50;
            
            // Generate a weather factor (random for demo)
            const weatherFactor = 1 + (Math.random() - 0.5) * 0.2; // ±10%
            
            // Calculate predicted congestion
            let predictedCongestion = (
                this.mlModelWeights.historical * historicalCongestion +
                this.mlModelWeights.realTime * currentCongestion
            ) * this.mlModelWeights.weather * weatherFactor;
            
            // Add some randomness to simulate prediction uncertainty
            predictedCongestion += (Math.random() - 0.5) * 10;
            
            // Ensure the value stays within bounds
            predictedCongestion = Math.max(0, Math.min(100, predictedCongestion));
            predictedCongestion = Math.round(predictedCongestion);
            
            // Calculate speed and travel time from congestion
            const predictedSpeed = Math.round(60 - (predictedCongestion / 100) * 55);
            
            // Get a base travel time for the route
            const baseTime = 10 + (parseInt(routeId.split('_')[1]) % 5) * 2; // 10-18 minutes
            const predictedTravelTime = Math.round(baseTime * (1 + (predictedCongestion / 100) * 2));
            
            // Add to prediction
            prediction.congestion.push(predictedCongestion);
            prediction.speed.push(predictedSpeed);
            prediction.travelTime.push(predictedTravelTime);
        }
        
        // Add timestamp and time horizon
        prediction.timestamp = new Date().toISOString();
        prediction.timeHorizon = timeHorizon;
        
        // Store the prediction
        this.predictions.set(`${routeId}_${timeHorizon}`, prediction);
        
        return prediction;
    }
    
    /**
     * Generate predictions for all routes
     */
    generateAllPredictions() {
        const routes = Array.from(this.historicalData.keys());
        const timeHorizons = [15, 30, 60]; // 15, 30, and 60 minutes
        
        routes.forEach(routeId => {
            timeHorizons.forEach(timeHorizon => {
                this.generatePrediction(routeId, timeHorizon);
            });
        });
    }
    
    /**
     * Get the latest prediction for a route
     * @param {string} routeId - Route identifier
     * @param {number} timeHorizon - Time horizon in minutes
     * @returns {Object} - Traffic prediction
     */
    getPrediction(routeId, timeHorizon) {
        const key = `${routeId}_${timeHorizon}`;
        return this.predictions.get(key);
    }
    
    /**
     * Calculate the optimal route between two points
     * @param {Object} start - Start coordinates {lat, lng}
     * @param {Object} end - End coordinates {lat, lng}
     * @returns {Object} - Optimal route information
     */
    calculateOptimalRoute(start, end) {
        // In a real application, this would use a routing algorithm with traffic data
        // For this demo, we'll return a sample route
        
        // Get a random route ID
        const routeId = `route_00${Math.floor(Math.random() * 5) + 1}`;
        
        // Get the prediction for this route
        const prediction = this.getPrediction(routeId, 30) || {
            congestion: [50],
            speed: [30],
            travelTime: [15]
        };
        
        // Calculate average values
        const avgCongestion = prediction.congestion.reduce((a, b) => a + b, 0) / prediction.congestion.length;
        const avgSpeed = prediction.speed.reduce((a, b) => a + b, 0) / prediction.speed.length;
        const avgTravelTime = prediction.travelTime.reduce((a, b) => a + b, 0) / prediction.travelTime.length;
        
        // Generate a sample route
        return {
            routeId: routeId,
            distance: (5 + Math.random() * 5).toFixed(1), // 5-10 miles
            travelTime: Math.round(avgTravelTime),
            congestion: Math.round(avgCongestion),
            speed: Math.round(avgSpeed),
            coordinates: this.generateSampleRouteCoordinates(start, end),
            alternativeRoutes: this.generateAlternativeRoutes(start, end, avgTravelTime)
        };
    }
    
    /**
     * Generate sample route coordinates between two points
     * @param {Object} start - Start coordinates {lat, lng}
     * @param {Object} end - End coordinates {lat, lng}
     * @returns {Array} - Array of coordinate pairs
     */
    generateSampleRouteCoordinates(start, end) {
        const coordinates = [];
        const steps = 10; // Number of points in the route
        
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            
            // Add some randomness to make the route look realistic
            const jitter = (Math.random() - 0.5) * 0.005;
            
            const lat = start.lat + (end.lat - start.lat) * ratio + jitter;
            const lng = start.lng + (end.lng - start.lng) * ratio + jitter;
            
            coordinates.push([lat, lng]);
        }
        
        return coordinates;
    }
    
    /**
     * Generate alternative routes
     * @param {Object} start - Start coordinates {lat, lng}
     * @param {Object} end - End coordinates {lat, lng}
     * @param {number} baseTravelTime - Base travel time in minutes
     * @returns {Array} - Array of alternative routes
     */
    generateAlternativeRoutes(start, end, baseTravelTime) {
        const alternatives = [];
        const numAlternatives = 2;
        
        for (let i = 0; i < numAlternatives; i++) {
            // Add some variation to the travel time
            const travelTimeFactor = 1 + (i + 1) * 0.1; // 10% longer for each alternative
            const travelTime = Math.round(baseTravelTime * travelTimeFactor);
            
            // Add some variation to the distance
            const distanceFactor = 1 - (i + 1) * 0.05; // 5% shorter for each alternative
            const distance = (5 + Math.random() * 5) * distanceFactor;
            
            // Generate coordinates with more variation
            const coordinates = this.generateSampleRouteCoordinates(start, end);
            
            // Add more jitter to make routes visibly different
            coordinates.forEach((coord, index) => {
                if (index > 0 && index < coordinates.length - 1) {
                    const jitterFactor = (i + 1) * 0.01;
                    coord[0] += (Math.random() - 0.5) * jitterFactor;
                    coord[1] += (Math.random() - 0.5) * jitterFactor;
                }
            });
            
            alternatives.push({
                routeId: `route_alt_${i + 1}`,
                distance: distance.toFixed(1),
                travelTime: travelTime,
                congestion: Math.round(40 + Math.random() * 30), // 40-70%
                speed: Math.round(20 + Math.random() * 20), // 20-40 mph
                coordinates: coordinates
            });
        }
        
        return alternatives;
    }
    
    /**
     * Simulate the impact of an incident on traffic
     * @param {Object} incident - Incident information
     * @returns {Object} - Traffic impact assessment
     */
    simulateIncidentImpact(incident) {
        // Calculate impact radius based on severity (1-5)
        const impactRadius = incident.severity * 0.5; // 0.5-2.5 miles
        
        // Calculate congestion increase based on type and severity
        let congestionIncrease;
        switch (incident.type) {
            case 'accident':
                congestionIncrease = 20 + incident.severity * 10; // 30-70%
                break;
            case 'construction':
                congestionIncrease = 10 + incident.severity * 8; // 18-50%
                break;
            case 'event':
                congestionIncrease = 5 + incident.severity * 5; // 10-30%
                break;
            case 'weather':
                congestionIncrease = 15 + incident.severity * 7; // 22-50%
                break;
            case 'breakdown':
                congestionIncrease = 5 + incident.severity * 6; // 11-35%
                break;
            default:
                congestionIncrease = 10 + incident.severity * 5; // 15-35%
        }
        
        // Calculate estimated duration based on type and severity
        let durationMinutes;
        switch (incident.type) {
            case 'accident':
                durationMinutes = 30 + incident.severity * 30; // 60-180 minutes
                break;
            case 'construction':
                durationMinutes = 60 + incident.severity * 120; // 180-660 minutes
                break;
            case 'event':
                durationMinutes = 120 + incident.severity * 60; // 180-420 minutes
                break;
            case 'weather':
                durationMinutes = 60 + incident.severity * 60; // 120-360 minutes
                break;
            case 'breakdown':
                durationMinutes = 20 + incident.severity * 20; // 40-120 minutes
                break;
            default:
                durationMinutes = 30 + incident.severity * 30; // 60-180 minutes
        }
        
        // Calculate affected routes (would use spatial analysis in a real app)
        const affectedRoutes = [];
        for (let i = 1; i <= 3; i++) {
            affectedRoutes.push(`route_00${i}`);
        }
        
        return {
            incident: incident,
            impactRadius: impactRadius,
            congestionIncrease: congestionIncrease,
            estimatedDuration: durationMinutes,
            affectedRoutes: affectedRoutes,
            recommendedActions: this.generateRecommendedActions(incident)
        };
    }
    
    /**
     * Generate recommended actions for an incident
     * @param {Object} incident - Incident information
     * @returns {Array} - Recommended actions
     */
    generateRecommendedActions(incident) {
        const actions = [];
        
        // Add general recommendation
        actions.push('Consider alternative routes to avoid delays');
        
        // Add specific recommendations based on incident type
        switch (incident.type) {
            case 'accident':
                actions.push('Expect emergency vehicles in the area');
                if (incident.severity > 3) {
                    actions.push('Major accident: Consider postponing non-essential travel');
                }
                break;
            case 'construction':
                actions.push('Reduced speed limits in construction zones');
                actions.push('Watch for construction workers and equipment');
                break;
            case 'event':
                actions.push('Consider public transportation if available');
                actions.push('Expect increased pedestrian activity');
                break;
            case 'weather':
                actions.push('Reduce speed and increase following distance');
                if (incident.severity > 3) {
                    actions.push('Hazardous conditions: Consider postponing non-essential travel');
                }
                break;
            case 'breakdown':
                actions.push('Watch for stopped vehicles on shoulder');
                break;
        }
        
        return actions;
    }
}

// Create a global instance of the traffic predictor
const trafficPredictor = new TrafficPredictor();

// Initialize the traffic module when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTrafficModule();
});

/**
 * Initialize the traffic module
 */
function initializeTrafficModule() {
    // Initialize the traffic predictor
    trafficPredictor.initialize();
    
    // Set up event listeners
    setupTrafficEventListeners();
    
    // Load initial traffic data
    loadTrafficData();
    
    console.log('Traffic module initialized');
}

/**
 * Set up event listeners for traffic module
 */
function setupTrafficEventListeners() {
    // Time horizon selector
    const timeHorizonSelect = document.getElementById('traffic-time-horizon');
    if (timeHorizonSelect) {
        timeHorizonSelect.addEventListener('change', function() {
            loadTrafficData();
        });
    }
    
    // Route optimizer form
    const routeOptimizerForm = document.getElementById('route-optimizer-form');
    if (routeOptimizerForm) {
        routeOptimizerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateOptimalRoute();
        });
    }
    
    // Incident simulator form
    const incidentSimulatorForm = document.getElementById('incident-simulator-form');
    if (incidentSimulatorForm) {
        incidentSimulatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            simulateIncident();
        });
    }
}

/**
 * Load traffic data and update the UI
 */
function loadTrafficData() {
    // Get the selected time horizon
    const timeHorizonSelect = document.getElementById('traffic-time-horizon');
    const timeHorizon = timeHorizonSelect ? parseInt(timeHorizonSelect.value) : 30;
    
    // Get predictions for all routes
    const routes = ['route_001', 'route_002', 'route_003', 'route_004', 'route_005'];
    const predictions = routes.map(routeId => {
        return {
            routeId: routeId,
            prediction: trafficPredictor.getPrediction(routeId, timeHorizon)
        };
    });
    
    // Update the traffic data display
    updateTrafficDataDisplay(predictions, timeHorizon);
    
    // Update the traffic map if the map function is available
    if (typeof switchMapLayer === 'function') {
        switchMapLayer('traffic');
    }
}

/**
 * Update the traffic data display
 * @param {Array} predictions - Array of route predictions
 * @param {number} timeHorizon - Time horizon in minutes
 */
function updateTrafficDataDisplay(predictions, timeHorizon) {
    const trafficDataContainer = document.getElementById('traffic-data');
    if (!trafficDataContainer) return;
    
    // Clear existing content
    trafficDataContainer.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'traffic-data-header';
    header.innerHTML = `
        <h3>Traffic Predictions (${timeHorizon} min horizon)</h3>
        <p>Last updated: ${formatDateTime(new Date())}</p>
    `;
    trafficDataContainer.appendChild(header);
    
    // Create table
    const table = document.createElement('table');
    table.className = 'traffic-data-table';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Route</th>
            <th>Congestion</th>
            <th>Speed</th>
            <th>Travel Time</th>
            <th>Incidents</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add rows for each route
    predictions.forEach(({ routeId, prediction }) => {
        if (!prediction) return;
        
        // Calculate average values
        const avgCongestion = prediction.congestion.reduce((a, b) => a + b, 0) / prediction.congestion.length;
        const avgSpeed = prediction.speed.reduce((a, b) => a + b, 0) / prediction.speed.length;
        const avgTravelTime = prediction.travelTime.reduce((a, b) => a + b, 0) / prediction.travelTime.length;
        
        // Get real-time data for incidents
        const realTimeData = trafficPredictor.realTimeData.get(routeId) || { incidents: [] };
        
        // Create row
        const tr = document.createElement('tr');
        
        // Format route name
        const routeName = `Route ${routeId.split('_')[1]}`;
        
        // Determine congestion class
        let congestionClass = 'low-congestion';
        if (avgCongestion >= 70) {
            congestionClass = 'high-congestion';
        } else if (avgCongestion >= 40) {
            congestionClass = 'medium-congestion';
        }
        
        tr.innerHTML = `
            <td>${routeName}</td>
            <td class="${congestionClass}">${Math.round(avgCongestion)}%</td>
            <td>${Math.round(avgSpeed)} mph</td>
            <td>${Math.round(avgTravelTime)} min</td>
            <td>${realTimeData.incidents.length > 0 ? 
                realTimeData.incidents.map(inc => `<span class="incident-badge">${capitalizeFirstLetter(inc.type)}</span>`).join('') : 
                'None'}</td>
        `;
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    trafficDataContainer.appendChild(table);
    
    // Add CSS for traffic data if not already in the stylesheet
    if (!document.getElementById('traffic-data-styles')) {
        const style = document.createElement('style');
        style.id = 'traffic-data-styles';
        style.innerHTML = `
            .traffic-data-header {
                margin-bottom: 15px;
            }
            .traffic-data-header h3 {
                margin-bottom: 5px;
            }
            .traffic-data-header p {
                color: #666;
                font-size: 0.9em;
                margin: 0;
            }
            .traffic-data-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .traffic-data-table th, .traffic-data-table td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .traffic-data-table th {
                background-color: #f5f5f5;
                font-weight: 600;
            }
            .high-congestion {
                background-color: rgba(255, 0, 0, 0.2);
                color: #d00;
                font-weight: bold;
            }
            .medium-congestion {
                background-color: rgba(255, 165, 0, 0.2);
                color: #f80;
                font-weight: bold;
            }
            .low-congestion {
                background-color: rgba(0, 128, 0, 0.2);
                color: #080;
                font-weight: bold;
            }
            .incident-badge {
                display: inline-block;
                background-color: #f44336;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.8em;
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create traffic charts
    createTrafficCharts(predictions, timeHorizon);
}

/**
 * Create traffic charts
 * @param {Array} predictions - Array of route predictions
 * @param {number} timeHorizon - Time horizon in minutes
 */
function createTrafficCharts(predictions, timeHorizon) {
    const trafficChartsContainer = document.getElementById('traffic-charts');
    if (!trafficChartsContainer) return;
    
    // Clear existing content
    trafficChartsContainer.innerHTML = '';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Traffic Trends';
    trafficChartsContainer.appendChild(header);
    
    // Create chart containers
    const congestionChartContainer = document.createElement('div');
    congestionChartContainer.className = 'chart-container';
    congestionChartContainer.innerHTML = '<canvas id="congestion-chart"></canvas>';
    trafficChartsContainer.appendChild(congestionChartContainer);
    
    const travelTimeChartContainer = document.createElement('div');
    travelTimeChartContainer.className = 'chart-container';
    travelTimeChartContainer.innerHTML = '<canvas id="travel-time-chart"></canvas>';
    trafficChartsContainer.appendChild(travelTimeChartContainer);
    
    // Add CSS for charts if not already in the stylesheet
    if (!document.getElementById('traffic-chart-styles')) {
        const style = document.createElement('style');
        style.id = 'traffic-chart-styles';
        style.innerHTML = `
            .chart-container {
                margin-bottom: 20px;
                height: 250px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        // Add a message that Chart.js is required
        const message = document.createElement('p');
        message.textContent = 'Chart.js is required to display traffic charts. Please include Chart.js in your project.';
        trafficChartsContainer.appendChild(message);
        return;
    }
    
    // Prepare data for charts
    const labels = [];
    for (let i = 0; i < timeHorizon / 5; i++) {
        labels.push(`+${i * 5} min`);
    }
    
    const datasets = [];
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8F00FF'];
    
    predictions.forEach(({ routeId, prediction }, index) => {
        if (!prediction) return;
        
        // Format route name
        const routeName = `Route ${routeId.split('_')[1]}`;
        
        // Add congestion dataset
        datasets.push({
            label: routeName,
            data: prediction.congestion,
            borderColor: colors[index % colors.length],
            backgroundColor: 'transparent',
            tension: 0.4
        });
    });
    
    // Create congestion chart
    const congestionCtx = document.getElementById('congestion-chart').getContext('2d');
    new Chart(congestionCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Predicted Congestion Levels'
                }
            }
        }
    });
    
    // Create travel time datasets
    const travelTimeDatasets = [];
    predictions.forEach(({ routeId, prediction }, index) => {
        if (!prediction) return;
        
        // Format route name
        const routeName = `Route ${routeId.split('_')[1]}`;
        
        // Add travel time dataset
        travelTimeDatasets.push({
            label: routeName,
            data: prediction.travelTime,
            borderColor: colors[index % colors.length],
            backgroundColor: 'transparent',
            tension: 0.4
        });
    });
    
    // Create travel time chart
    const travelTimeCtx = document.getElementById('travel-time-chart').getContext('2d');
    new Chart(travelTimeCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: travelTimeDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Travel Time (min)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Predicted Travel Times'
                }
            }
        }
    });
}

/**
 * Calculate and display the optimal route
 */
function calculateOptimalRoute() {
    // Get form values
    const startInput = document.getElementById('route-start');
    const endInput = document.getElementById('route-end');
    
    if (!startInput || !endInput) return;
    
    const start = startInput.value.trim();
    const end = endInput.value.trim();
    
    if (!start || !end) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter both start and end locations', 'error');
        }
        return;
    }
    
    // In a real application, these would be geocoded to coordinates
    // For this demo, we'll use sample coordinates
    const startCoords = { lat: 40.7128, lng: -74.006 };
    const endCoords = { lat: 40.7138 + (Math.random() - 0.5) * 0.02, lng: -74.006 + (Math.random() - 0.5) * 0.02 };
    
    // Calculate the optimal route
    const route = trafficPredictor.calculateOptimalRoute(startCoords, endCoords);
    
    // Display the route
    displayRoute(route, start, end);
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification(`Optimal route calculated: ${route.travelTime} minutes`, 'success');
    }
}

/**
 * Display a route on the map and in the UI
 * @param {Object} route - Route information
 * @param {string} start - Start location name
 * @param {string} end - End location name
 */
function displayRoute(route, start, end) {
    // Display route on map if the map function is available
    if (typeof cityMap !== 'undefined') {
        // Clear any existing routes
        if (window.currentRouteLayer) {
            cityMap.removeLayer(window.currentRouteLayer);
        }
        
        // Create a new layer for the route
        window.currentRouteLayer = L.layerGroup().addTo(cityMap);
        
        // Add the main route
        const routeLine = L.polyline(route.coordinates, {
            color: '#4285F4',
            weight: 5,
            opacity: 0.7
        }).addTo(window.currentRouteLayer);
        
        // Add start and end markers
        const startMarker = L.marker(route.coordinates[0], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: '<div style="background-color: #4285F4; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">A</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(window.currentRouteLayer);
        
        const endMarker = L.marker(route.coordinates[route.coordinates.length - 1], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: '<div style="background-color: #EA4335; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">B</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(window.currentRouteLayer);
        
        // Add alternative routes if available
        if (route.alternativeRoutes && route.alternativeRoutes.length > 0) {
            route.alternativeRoutes.forEach((altRoute, index) => {
                const altColor = index === 0 ? '#FBBC05' : '#34A853';
                
                L.polyline(altRoute.coordinates, {
                    color: altColor,
                    weight: 3,
                    opacity: 0.5,
                    dashArray: '5, 10'
                }).addTo(window.currentRouteLayer);
            });
        }
        
        // Fit the map to the route bounds
        const bounds = L.latLngBounds(route.coordinates);
        cityMap.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Display route information in the UI
    const routeInfoContainer = document.getElementById('route-info');
    if (!routeInfoContainer) return;
    
    // Clear existing content
    routeInfoContainer.innerHTML = '';
    
    // Create route information card
    const routeCard = document.createElement('div');
    routeCard.className = 'route-card';
    
    // Determine congestion class
    let congestionClass = 'low-congestion';
    if (route.congestion >= 70) {
        congestionClass = 'high-congestion';
    } else if (route.congestion >= 40) {
        congestionClass = 'medium-congestion';
    }
    
    routeCard.innerHTML = `
        <div class="route-header">
            <h3>Optimal Route</h3>
            <div class="route-summary">
                <div class="route-locations">
                    <div class="route-start"><strong>From:</strong> ${start}</div>
                    <div class="route-end"><strong>To:</strong> ${end}</div>
                </div>
                <div class="route-stats">
                    <div class="route-distance"><i class="fas fa-road"></i> ${route.distance} miles</div>
                    <div class="route-time"><i class="fas fa-clock"></i> ${route.travelTime} min</div>
                    <div class="route-congestion ${congestionClass}"><i class="fas fa-traffic-light"></i> ${route.congestion}% congestion</div>
                </div>
            </div>
        </div>
    `;
    
    // Add alternative routes if available
    if (route.alternativeRoutes && route.alternativeRoutes.length > 0) {
        const altRoutesContainer = document.createElement('div');
        altRoutesContainer.className = 'alternative-routes';
        
        const altHeader = document.createElement('h4');
        altHeader.textContent = 'Alternative Routes';
        altRoutesContainer.appendChild(altHeader);
        
        route.alternativeRoutes.forEach((altRoute, index) => {
            // Determine congestion class for alternative route
            let altCongestionClass = 'low-congestion';
            if (altRoute.congestion >= 70) {
                altCongestionClass = 'high-congestion';
            } else if (altRoute.congestion >= 40) {
                altCongestionClass = 'medium-congestion';
            }
            
            const altRouteItem = document.createElement('div');
            altRouteItem.className = 'alt-route-item';
            altRouteItem.innerHTML = `
                <div class="alt-route-name">Alternative ${index + 1}</div>
                <div class="alt-route-stats">
                    <div class="alt-route-distance"><i class="fas fa-road"></i> ${altRoute.distance} miles</div>
                    <div class="alt-route-time"><i class="fas fa-clock"></i> ${altRoute.travelTime} min</div>
                    <div class="alt-route-congestion ${altCongestionClass}"><i class="fas fa-traffic-light"></i> ${altRoute.congestion}% congestion</div>
                </div>
            `;
            
            altRoutesContainer.appendChild(altRouteItem);
        });
        
        routeCard.appendChild(altRoutesContainer);
    }
    
    routeInfoContainer.appendChild(routeCard);
    
    // Add CSS for route info if not already in the stylesheet
    if (!document.getElementById('route-info-styles')) {
        const style = document.createElement('style');
        style.id = 'route-info-styles';
        style.innerHTML = `
            .route-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .route-header h3 {
                margin-top: 0;
                margin-bottom: 15px;
            }
            .route-summary {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .route-locations {
                margin-bottom: 10px;
            }
            .route-start, .route-end {
                margin-bottom: 5px;
            }
            .route-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            .route-stats > div {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .alternative-routes {
                margin-top: 15px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
            .alternative-routes h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .alt-route-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #f5f5f5;
            }
            .alt-route-stats {
                display: flex;
                gap: 15px;
            }
            .alt-route-stats > div {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Simulate an incident and display its impact
 */
function simulateIncident() {
    // Get form values
    const typeSelect = document.getElementById('incident-type');
    const severitySelect = document.getElementById('incident-severity');
    const locationInput = document.getElementById('incident-location');
    
    if (!typeSelect || !severitySelect || !locationInput) return;
    
    const type = typeSelect.value;
    const severity = parseInt(severitySelect.value);
    const location = locationInput.value.trim();
    
    if (!type || !severity || !location) {
        if (typeof showNotification === 'function') {
            showNotification('Please fill in all incident details', 'error');
        }
        return;
    }
    
    // Create incident object
    const incident = {
        type: type,
        severity: severity,
        location: location,
        timestamp: new Date().toISOString()
    };
    
    // Simulate the incident impact
    const impact = trafficPredictor.simulateIncidentImpact(incident);
    
    // Display the impact
    displayIncidentImpact(impact);
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification(`Incident impact simulated: ${impact.congestionIncrease}% congestion increase`, 'info');
    }
}

/**
 * Display incident impact in the UI
 * @param {Object} impact - Incident impact assessment
 */
function displayIncidentImpact(impact) {
    const impactContainer = document.getElementById('incident-impact');
    if (!impactContainer) return;
    
    // Clear existing content
    impactContainer.innerHTML = '';
    
    // Create impact card
    const impactCard = document.createElement('div');
    impactCard.className = 'impact-card';
    
    // Format incident type and severity
    const incidentType = capitalizeFirstLetter(impact.incident.type);
    const severityText = getSeverityText(impact.incident.severity);
    
    impactCard.innerHTML = `
        <div class="impact-header">
            <h3>Incident Impact Assessment</h3>
            <div class="incident-details">
                <div><strong>Type:</strong> ${incidentType}</div>
                <div><strong>Severity:</strong> ${severityText}</div>
                <div><strong>Location:</strong> ${impact.incident.location}</div>
                <div><strong>Time:</strong> ${formatDateTime(new Date(impact.incident.timestamp))}</div>
            </div>
        </div>
        <div class="impact-details">
            <div class="impact-stat">
                <div class="impact-label">Impact Radius</div>
                <div class="impact-value">${impact.impactRadius.toFixed(1)} miles</div>
            </div>
            <div class="impact-stat">
                <div class="impact-label">Congestion Increase</div>
                <div class="impact-value high-congestion">+${impact.congestionIncrease}%</div>
            </div>
            <div class="impact-stat">
                <div class="impact-label">Estimated Duration</div>
                <div class="impact-value">${formatDuration(impact.estimatedDuration)}</div>
            </div>
            <div class="impact-stat">
                <div class="impact-label">Affected Routes</div>
                <div class="impact-value">${impact.affectedRoutes.map(route => `Route ${route.split('_')[1]}`).join(', ')}</div>
            </div>
        </div>
        <div class="recommended-actions">
            <h4>Recommended Actions</h4>
            <ul>
                ${impact.recommendedActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
    `;
    
    impactContainer.appendChild(impactCard);
    
    // Add CSS for impact info if not already in the stylesheet
    if (!document.getElementById('impact-info-styles')) {
        const style = document.createElement('style');
        style.id = 'impact-info-styles';
        style.innerHTML = `
            .impact-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .impact-header h3 {
                margin-top: 0;
                margin-bottom: 15px;
            }
            .incident-details {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 10px;
                margin-bottom: 15px;
            }
            .impact-details {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            .impact-stat {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 10px;
            }
            .impact-label {
                font-size: 0.9em;
                color: #666;
                margin-bottom: 5px;
            }
            .impact-value {
                font-size: 1.2em;
                font-weight: 600;
            }
            .recommended-actions {
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
            .recommended-actions h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .recommended-actions ul {
                margin: 0;
                padding-left: 20px;
            }
            .recommended-actions li {
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Display the incident on the map if the map function is available
    if (typeof cityMap !== 'undefined') {
        // In a real application, the incident would have coordinates
        // For this demo, we'll use a random location near the center
        const lat = 40.7128 + (Math.random() - 0.5) * 0.01;
        const lng = -74.006 + (Math.random() - 0.5) * 0.01;
        
        // Clear any existing incident markers
        if (window.incidentMarker) {
            cityMap.removeLayer(window.incidentMarker);
        }
        
        // Create an icon based on incident type
        let iconClass = 'fas fa-exclamation-triangle';
        let iconColor = '#ff0000';
        
        switch (impact.incident.type) {
            case 'accident':
                iconClass = 'fas fa-car-crash';
                break;
            case 'construction':
                iconClass = 'fas fa-hard-hat';
                iconColor = '#ffa500';
                break;
            case 'event':
                iconClass = 'fas fa-calendar-alt';
                iconColor = '#3498db';
                break;
            case 'weather':
                iconClass = 'fas fa-cloud-rain';
                iconColor = '#9b59b6';
                break;
            case 'breakdown':
                iconClass = 'fas fa-car';
                iconColor = '#e67e22';
                break;
        }
        
        // Create the incident marker
        window.incidentMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: white; border-radius: 50%; padding: 5px; box-shadow: 0 0 3px rgba(0,0,0,0.3);"><i class="${iconClass}" style="color: ${iconColor};"></i></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(cityMap);
        
        // Add a popup with incident details
        window.incidentMarker.bindPopup(`
            <strong>${incidentType}</strong><br>
            Severity: ${severityText}<br>
            Location: ${impact.incident.location}<br>
            Congestion Increase: +${impact.congestionIncrease}%<br>
            Duration: ${formatDuration(impact.estimatedDuration)}
        `).openPopup();
        
        // Add a circle to show the impact radius
        window.incidentRadiusCircle = L.circle([lat, lng], {
            radius: impact.impactRadius * 1609.34, // Convert miles to meters
            color: iconColor,
            fillColor: iconColor,
            fillOpacity: 0.2,
            weight: 1
        }).addTo(cityMap);
        
        // Pan to the incident
        cityMap.setView([lat, lng], 14);
    }
}

/**
 * Get text description of severity level
 * @param {number} severity - Severity level (1-5)
 * @returns {string} - Severity description
 */
function getSeverityText(severity) {
    switch (severity) {
        case 1: return 'Minor';
        case 2: return 'Moderate';
        case 3: return 'Significant';
        case 4: return 'Severe';
        case 5: return 'Critical';
        default: return 'Unknown';
    }
}

/**
 * Format duration in minutes to a readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration
 */
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minutes` : ''}`;
    }
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
window.loadTrafficData = loadTrafficData;
window.calculateOptimalRoute = calculateOptimalRoute;
window.simulateIncident = simulateIncident;