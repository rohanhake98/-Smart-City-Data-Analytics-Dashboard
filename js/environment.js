/**
 * Smart City Data Analytics Dashboard - Environment Module
 * This file contains the implementation of the Environmental Monitoring System
 */

// Environmental Data Manager class for air quality and pollution monitoring
class EnvironmentalDataManager {
    constructor() {
        this.sensors = [];
        this.pollutionSources = [];
        this.healthRisks = {};
        this.forecasts = [];
        this.initialized = false;
    }
    
    /**
     * Initialize the environmental data manager with sample data
     */
    initialize() {
        if (this.initialized) return;
        
        // Load sample sensor data
        this.loadSampleSensorData();
        
        // Load sample pollution sources
        this.loadSamplePollutionSources();
        
        // Calculate health risks
        this.calculateHealthRisks();
        
        // Generate forecasts
        this.generateForecasts();
        
        this.initialized = true;
        console.log('Environmental Data Manager initialized');
    }
    
    /**
     * Load sample sensor data
     */
    loadSampleSensorData() {
        // Sample sensor locations around the city
        const sensorLocations = [
            { lat: 40.7128, lng: -74.006, name: 'Downtown' },
            { lat: 40.7138, lng: -74.013, name: 'Westside' },
            { lat: 40.7118, lng: -74.009, name: 'Eastside' },
            { lat: 40.7148, lng: -74.016, name: 'Northside' },
            { lat: 40.7108, lng: -74.002, name: 'Southside' },
            { lat: 40.7158, lng: -74.008, name: 'Central Park' },
            { lat: 40.7168, lng: -74.018, name: 'Industrial Zone' },
            { lat: 40.7098, lng: -74.019, name: 'Residential Area' }
        ];
        
        // Generate sensor data for each location
        sensorLocations.forEach((location, index) => {
            // Create different pollution profiles based on location
            let pollutionProfile;
            if (location.name.includes('Industrial')) {
                pollutionProfile = 'industrial';
            } else if (location.name.includes('Downtown') || location.name.includes('Central')) {
                pollutionProfile = 'urban';
            } else if (location.name.includes('Residential')) {
                pollutionProfile = 'residential';
            } else {
                pollutionProfile = 'mixed';
            }
            
            // Generate readings based on profile
            const readings = this.generateSensorReadings(pollutionProfile);
            
            // Create sensor object
            const sensor = {
                id: `sensor_${(index + 1).toString().padStart(3, '0')}`,
                location: {
                    lat: location.lat,
                    lng: location.lng,
                    name: location.name
                },
                type: 'air_quality',
                readings: readings,
                lastUpdated: new Date().toISOString()
            };
            
            this.sensors.push(sensor);
        });
    }
    
    /**
     * Generate sensor readings based on pollution profile
     * @param {string} profile - Pollution profile (industrial, urban, residential, mixed)
     * @returns {Object} - Sensor readings
     */
    generateSensorReadings(profile) {
        // Base values for different profiles
        const baseValues = {
            industrial: { pm25: 35, pm10: 70, no2: 40, so2: 30, co: 1.5, o3: 50 },
            urban: { pm25: 20, pm10: 40, no2: 30, so2: 15, co: 1.0, o3: 40 },
            residential: { pm25: 10, pm10: 25, no2: 15, so2: 5, co: 0.5, o3: 30 },
            mixed: { pm25: 15, pm10: 35, no2: 25, so2: 10, co: 0.8, o3: 35 }
        };
        
        // Get base values for the profile
        const base = baseValues[profile] || baseValues.mixed;
        
        // Add some random variation
        const pm25 = Math.max(0, Math.round(base.pm25 + (Math.random() - 0.5) * 10));
        const pm10 = Math.max(0, Math.round(base.pm10 + (Math.random() - 0.5) * 20));
        const no2 = Math.max(0, Math.round(base.no2 + (Math.random() - 0.5) * 10));
        const so2 = Math.max(0, Math.round(base.so2 + (Math.random() - 0.5) * 5));
        const co = Math.max(0, parseFloat((base.co + (Math.random() - 0.5) * 0.5).toFixed(1)));
        const o3 = Math.max(0, Math.round(base.o3 + (Math.random() - 0.5) * 15));
        
        // Calculate AQI based on pollutant concentrations
        const aqi = this.calculateAQI(pm25, pm10, no2, so2, co, o3);
        
        // Determine AQI category
        const aqiCategory = this.getAQICategory(aqi);
        
        return {
            pm25: { value: pm25, timestamp: new Date().toISOString(), unit: 'μg/m³' },
            pm10: { value: pm10, timestamp: new Date().toISOString(), unit: 'μg/m³' },
            no2: { value: no2, timestamp: new Date().toISOString(), unit: 'ppb' },
            so2: { value: so2, timestamp: new Date().toISOString(), unit: 'ppb' },
            co: { value: co, timestamp: new Date().toISOString(), unit: 'ppm' },
            o3: { value: o3, timestamp: new Date().toISOString(), unit: 'ppb' },
            aqi: { value: aqi, category: aqiCategory, timestamp: new Date().toISOString() }
        };
    }
    
    /**
     * Calculate Air Quality Index (AQI) from pollutant concentrations
     * This is a simplified calculation for demonstration purposes
     * @param {number} pm25 - PM2.5 concentration (μg/m³)
     * @param {number} pm10 - PM10 concentration (μg/m³)
     * @param {number} no2 - NO2 concentration (ppb)
     * @param {number} so2 - SO2 concentration (ppb)
     * @param {number} co - CO concentration (ppm)
     * @param {number} o3 - O3 concentration (ppb)
     * @returns {number} - AQI value
     */
    calculateAQI(pm25, pm10, no2, so2, co, o3) {
        // Calculate individual AQI values for each pollutant
        // These are simplified calculations
        const pm25AQI = this.calculatePM25AQI(pm25);
        const pm10AQI = this.calculatePM10AQI(pm10);
        const no2AQI = this.calculateNO2AQI(no2);
        const so2AQI = this.calculateSO2AQI(so2);
        const coAQI = this.calculateCOAQI(co);
        const o3AQI = this.calculateO3AQI(o3);
        
        // Return the highest AQI value
        return Math.max(pm25AQI, pm10AQI, no2AQI, so2AQI, coAQI, o3AQI);
    }
    
    /**
     * Calculate AQI for PM2.5
     * @param {number} concentration - PM2.5 concentration (μg/m³)
     * @returns {number} - AQI value
     */
    calculatePM25AQI(concentration) {
        // AQI breakpoints for PM2.5
        const breakpoints = [
            { min: 0, max: 12, minAQI: 0, maxAQI: 50 },
            { min: 12.1, max: 35.4, minAQI: 51, maxAQI: 100 },
            { min: 35.5, max: 55.4, minAQI: 101, maxAQI: 150 },
            { min: 55.5, max: 150.4, minAQI: 151, maxAQI: 200 },
            { min: 150.5, max: 250.4, minAQI: 201, maxAQI: 300 },
            { min: 250.5, max: 500.4, minAQI: 301, maxAQI: 500 }
        ];
        
        return this.calculateAQIFromBreakpoints(concentration, breakpoints);
    }
    
    /**
     * Calculate AQI for PM10
     * @param {number} concentration - PM10 concentration (μg/m³)
     * @returns {number} - AQI value
     */
    calculatePM10AQI(concentration) {
        // AQI breakpoints for PM10
        const breakpoints = [
            { min: 0, max: 54, minAQI: 0, maxAQI: 50 },
            { min: 55, max: 154, minAQI: 51, maxAQI: 100 },
            { min: 155, max: 254, minAQI: 101, maxAQI: 150 },
            { min: 255, max: 354, minAQI: 151, maxAQI: 200 },
            { min: 355, max: 424, minAQI: 201, maxAQI: 300 },
            { min: 425, max: 604, minAQI: 301, maxAQI: 500 }
        ];
        
        return this.calculateAQIFromBreakpoints(concentration, breakpoints);
    }
    
    /**
     * Calculate AQI for NO2
     * @param {number} concentration - NO2 concentration (ppb)
     * @returns {number} - AQI value
     */
    calculateNO2AQI(concentration) {
        // AQI breakpoints for NO2
        const breakpoints = [
            { min: 0, max: 53, minAQI: 0, maxAQI: 50 },
            { min: 54, max: 100, minAQI: 51, maxAQI: 100 },
            { min: 101, max: 360, minAQI: 101, maxAQI: 150 },
            { min: 361, max: 649, minAQI: 151, maxAQI: 200 },
            { min: 650, max: 1249, minAQI: 201, maxAQI: 300 },
            { min: 1250, max: 2049, minAQI: 301, maxAQI: 500 }
        ];
        
        return this.calculateAQIFromBreakpoints(concentration, breakpoints);
    }
    
    /**
     * Calculate AQI for SO2
     * @param {number} concentration - SO2 concentration (ppb)
     * @returns {number} - AQI value
     */
    calculateSO2AQI(concentration) {
        // AQI breakpoints for SO2
        const breakpoints = [
            { min: 0, max: 35, minAQI: 0, maxAQI: 50 },
            { min: 36, max: 75, minAQI: 51, maxAQI: 100 },
            { min: 76, max: 185, minAQI: 101, maxAQI: 150 },
            { min: 186, max: 304, minAQI: 151, maxAQI: 200 },
            { min: 305, max: 604, minAQI: 201, maxAQI: 300 },
            { min: 605, max: 1004, minAQI: 301, maxAQI: 500 }
        ];
        
        return this.calculateAQIFromBreakpoints(concentration, breakpoints);
    }
    
    /**
     * Calculate AQI for CO
     * @param {number} concentration - CO concentration (ppm)
     * @returns {number} - AQI value
     */
    calculateCOAQI(concentration) {
        // AQI breakpoints for CO
        const breakpoints = [
            { min: 0, max: 4.4, minAQI: 0, maxAQI: 50 },
            { min: 4.5, max: 9.4, minAQI: 51, maxAQI: 100 },
            { min: 9.5, max: 12.4, minAQI: 101, maxAQI: 150 },
            { min: 12.5, max: 15.4, minAQI: 151, maxAQI: 200 },
            { min: 15.5, max: 30.4, minAQI: 201, maxAQI: 300 },
            { min: 30.5, max: 50.4, minAQI: 301, maxAQI: 500 }
        ];
        
        return this.calculateAQIFromBreakpoints(concentration, breakpoints);
    }
    
    /**
     * Calculate AQI for O3
     * @param {number} concentration - O3 concentration (ppb)
     * @returns {number} - AQI value
     */
    calculateO3AQI(concentration) {
        // AQI breakpoints for O3
        const breakpoints = [
            { min: 0, max: 54, minAQI: 0, maxAQI: 50 },
            { min: 55, max: 70, minAQI: 51, maxAQI: 100 },
            { min: 71, max: 85, minAQI: 101, maxAQI: 150 },
            { min: 86, max: 105, minAQI: 151, maxAQI: 200 },
            { min: 106, max: 200, minAQI: 201, maxAQI: 300 },
            { min: 201, max: 504, minAQI: 301, maxAQI: 500 }
        ];
        
        return this.calculateAQIFromBreakpoints(concentration, breakpoints);
    }
    
    /**
     * Calculate AQI from breakpoints
     * @param {number} concentration - Pollutant concentration
     * @param {Array} breakpoints - Array of breakpoint objects
     * @returns {number} - AQI value
     */
    calculateAQIFromBreakpoints(concentration, breakpoints) {
        // Find the appropriate breakpoint
        for (const bp of breakpoints) {
            if (concentration >= bp.min && concentration <= bp.max) {
                // Linear interpolation formula
                const aqi = ((bp.maxAQI - bp.minAQI) / (bp.max - bp.min)) * 
                    (concentration - bp.min) + bp.minAQI;
                
                return Math.round(aqi);
            }
        }
        
        // If concentration is higher than the highest breakpoint
        if (concentration > breakpoints[breakpoints.length - 1].max) {
            return breakpoints[breakpoints.length - 1].maxAQI;
        }
        
        // Default to 0 if concentration is below the lowest breakpoint
        return 0;
    }
    
    /**
     * Get AQI category based on AQI value
     * @param {number} aqi - AQI value
     * @returns {string} - AQI category
     */
    getAQICategory(aqi) {
        if (aqi <= 50) {
            return 'good';
        } else if (aqi <= 100) {
            return 'moderate';
        } else if (aqi <= 150) {
            return 'unhealthy_for_sensitive';
        } else if (aqi <= 200) {
            return 'unhealthy';
        } else if (aqi <= 300) {
            return 'very_unhealthy';
        } else {
            return 'hazardous';
        }
    }
    
    /**
     * Load sample pollution sources
     */
    loadSamplePollutionSources() {
        // Sample pollution sources
        const sources = [
            {
                id: 'source_001',
                type: 'industrial',
                name: 'Manufacturing Plant',
                location: { lat: 40.7168, lng: -74.018 },
                pollutants: ['pm25', 'pm10', 'so2'],
                emissionLevel: 'high',
                operatingHours: '24/7',
                lastInspection: '2023-04-15'
            },
            {
                id: 'source_002',
                type: 'transportation',
                name: 'Highway Junction',
                location: { lat: 40.7138, lng: -74.013 },
                pollutants: ['no2', 'pm25', 'co'],
                emissionLevel: 'medium',
                peakHours: ['7:00-9:00', '16:00-19:00'],
                trafficVolume: 'high'
            },
            {
                id: 'source_003',
                type: 'construction',
                name: 'Downtown Construction Site',
                location: { lat: 40.7128, lng: -74.006 },
                pollutants: ['pm10', 'pm25'],
                emissionLevel: 'medium',
                startDate: '2023-01-10',
                endDate: '2023-12-15',
                operatingHours: '8:00-18:00'
            },
            {
                id: 'source_004',
                type: 'energy',
                name: 'Power Plant',
                location: { lat: 40.7158, lng: -74.022 },
                pollutants: ['so2', 'no2', 'pm25'],
                emissionLevel: 'high',
                operatingHours: '24/7',
                lastInspection: '2023-03-20'
            },
            {
                id: 'source_005',
                type: 'waste',
                name: 'Waste Processing Facility',
                location: { lat: 40.7088, lng: -74.025 },
                pollutants: ['pm10', 'so2'],
                emissionLevel: 'medium',
                operatingHours: '6:00-22:00',
                lastInspection: '2023-05-05'
            }
        ];
        
        this.pollutionSources = sources;
    }
    
    /**
     * Calculate health risks based on air quality
     */
    calculateHealthRisks() {
        // Define health risk factors for different demographics
        const riskFactors = {
            general: 1.0,
            elderly: 1.5,
            children: 1.3,
            respiratory: 2.0,
            cardiovascular: 1.8
        };
        
        // Calculate health risks for each sensor location
        this.sensors.forEach(sensor => {
            const aqi = sensor.readings.aqi.value;
            const risks = {};
            
            // Calculate risk for each demographic group
            Object.keys(riskFactors).forEach(group => {
                let riskLevel;
                const factor = riskFactors[group];
                
                // Determine base risk level from AQI
                if (aqi <= 50) {
                    riskLevel = 'minimal';
                } else if (aqi <= 100) {
                    riskLevel = 'low';
                } else if (aqi <= 150) {
                    riskLevel = 'moderate';
                } else if (aqi <= 200) {
                    riskLevel = 'high';
                } else if (aqi <= 300) {
                    riskLevel = 'very_high';
                } else {
                    riskLevel = 'severe';
                }
                
                // Calculate a numeric risk score (0-100)
                let riskScore;
                switch (riskLevel) {
                    case 'minimal': riskScore = 10; break;
                    case 'low': riskScore = 30; break;
                    case 'moderate': riskScore = 50; break;
                    case 'high': riskScore = 70; break;
                    case 'very_high': riskScore = 85; break;
                    case 'severe': riskScore = 100; break;
                    default: riskScore = 0;
                }
                
                // Apply demographic factor
                riskScore = Math.min(100, Math.round(riskScore * factor));
                
                // Generate health recommendations
                const recommendations = this.generateHealthRecommendations(riskLevel, group);
                
                risks[group] = {
                    level: riskLevel,
                    score: riskScore,
                    recommendations: recommendations
                };
            });
            
            // Store health risks for this location
            this.healthRisks[sensor.id] = {
                location: sensor.location.name,
                aqi: aqi,
                aqiCategory: sensor.readings.aqi.category,
                timestamp: new Date().toISOString(),
                risks: risks
            };
        });
    }
    
    /**
     * Generate health recommendations based on risk level and demographic group
     * @param {string} riskLevel - Risk level (minimal, low, moderate, high, very_high, severe)
     * @param {string} demographicGroup - Demographic group (general, elderly, children, respiratory, cardiovascular)
     * @returns {Array} - Array of recommendation strings
     */
    generateHealthRecommendations(riskLevel, demographicGroup) {
        const recommendations = [];
        
        // General recommendations based on risk level
        switch (riskLevel) {
            case 'minimal':
                recommendations.push('Air quality is good. No special precautions needed.');
                break;
            case 'low':
                recommendations.push('Air quality is acceptable. Unusually sensitive individuals should consider reducing prolonged outdoor exertion.');
                break;
            case 'moderate':
                recommendations.push('Members of sensitive groups may experience health effects. The general public is less likely to be affected.');
                recommendations.push('Consider reducing prolonged or heavy outdoor exertion.');
                break;
            case 'high':
                recommendations.push('Everyone may begin to experience health effects. Members of sensitive groups may experience more serious effects.');
                recommendations.push('Avoid prolonged or heavy outdoor exertion. Consider moving activities indoors or rescheduling.');
                break;
            case 'very_high':
                recommendations.push('Health alert: The risk of health effects is increased for everyone.');
                recommendations.push('Avoid all outdoor physical activity. Stay indoors with windows closed if possible.');
                break;
            case 'severe':
                recommendations.push('Health warning of emergency conditions: everyone is more likely to be affected.');
                recommendations.push('Remain indoors with windows closed. If available, use air purifiers.');
                recommendations.push('Wear N95 masks if outdoor activity is unavoidable.');
                break;
        }
        
        // Specific recommendations based on demographic group
        if (demographicGroup === 'elderly' && riskLevel !== 'minimal') {
            recommendations.push('Elderly individuals should take extra precautions to limit exposure.');
            if (riskLevel === 'high' || riskLevel === 'very_high' || riskLevel === 'severe') {
                recommendations.push('Consider checking in with healthcare provider if respiratory symptoms develop.');
            }
        } else if (demographicGroup === 'children' && riskLevel !== 'minimal') {
            recommendations.push('Children should reduce outdoor play time.');
            if (riskLevel === 'high' || riskLevel === 'very_high' || riskLevel === 'severe') {
                recommendations.push('Keep children indoors with windows closed.');
            }
        } else if (demographicGroup === 'respiratory' && riskLevel !== 'minimal') {
            recommendations.push('Individuals with respiratory conditions should have medication readily available.');
            if (riskLevel === 'moderate' || riskLevel === 'high') {
                recommendations.push('Consider using a mask (N95 or better) when outdoors.');
            }
            if (riskLevel === 'very_high' || riskLevel === 'severe') {
                recommendations.push('Stay indoors and use air purifiers if available.');
                recommendations.push('Contact healthcare provider if symptoms worsen.');
            }
        } else if (demographicGroup === 'cardiovascular' && riskLevel !== 'minimal') {
            recommendations.push('Individuals with cardiovascular conditions should avoid physical exertion.');
            if (riskLevel === 'high' || riskLevel === 'very_high' || riskLevel === 'severe') {
                recommendations.push('Stay in air-conditioned environments when possible.');
                recommendations.push('Monitor blood pressure and contact healthcare provider if unusual symptoms occur.');
            }
        }
        
        return recommendations;
    }
    
    /**
     * Generate air quality forecasts
     */
    generateForecasts() {
        // Generate 48-hour forecasts for each sensor location
        this.sensors.forEach(sensor => {
            const forecast = {
                sensorId: sensor.id,
                location: sensor.location.name,
                generated: new Date().toISOString(),
                hourly: []
            };
            
            // Current AQI value
            const currentAQI = sensor.readings.aqi.value;
            
            // Generate hourly forecasts for the next 48 hours
            for (let hour = 1; hour <= 48; hour++) {
                // Create a date object for this forecast hour
                const forecastDate = new Date();
                forecastDate.setHours(forecastDate.getHours() + hour);
                
                // Add some variation to the AQI based on time of day
                // Morning and evening rush hours tend to have higher pollution
                const hourOfDay = forecastDate.getHours();
                let variation = 0;
                
                // Rush hour variations
                if (hourOfDay >= 7 && hourOfDay <= 9) {
                    variation = 15; // Morning rush hour
                } else if (hourOfDay >= 16 && hourOfDay <= 19) {
                    variation = 20; // Evening rush hour
                } else if (hourOfDay >= 22 || hourOfDay <= 5) {
                    variation = -10; // Night time, typically cleaner
                }
                
                // Add some random noise
                variation += (Math.random() - 0.5) * 15;
                
                // Calculate forecasted AQI
                let forecastedAQI = Math.max(0, Math.round(currentAQI + variation));
                
                // Determine AQI category
                const aqiCategory = this.getAQICategory(forecastedAQI);
                
                // Add to hourly forecasts
                forecast.hourly.push({
                    timestamp: forecastDate.toISOString(),
                    aqi: forecastedAQI,
                    category: aqiCategory,
                    confidence: Math.round(90 - (hour / 48) * 30) // Confidence decreases with time
                });
            }
            
            this.forecasts.push(forecast);
        });
    }
    
    /**
     * Get all sensor data
     * @returns {Array} - Array of sensor objects
     */
    getAllSensors() {
        return this.sensors;
    }
    
    /**
     * Get sensor data by ID
     * @param {string} sensorId - Sensor ID
     * @returns {Object|null} - Sensor object or null if not found
     */
    getSensorById(sensorId) {
        return this.sensors.find(sensor => sensor.id === sensorId) || null;
    }
    
    /**
     * Get all pollution sources
     * @returns {Array} - Array of pollution source objects
     */
    getAllPollutionSources() {
        return this.pollutionSources;
    }
    
    /**
     * Get health risks for a specific location
     * @param {string} sensorId - Sensor ID
     * @returns {Object|null} - Health risk object or null if not found
     */
    getHealthRisks(sensorId) {
        return this.healthRisks[sensorId] || null;
    }
    
    /**
     * Get all health risks
     * @returns {Object} - Object with sensor IDs as keys and health risk objects as values
     */
    getAllHealthRisks() {
        return this.healthRisks;
    }
    
    /**
     * Get forecast for a specific location
     * @param {string} sensorId - Sensor ID
     * @returns {Object|null} - Forecast object or null if not found
     */
    getForecast(sensorId) {
        return this.forecasts.find(forecast => forecast.sensorId === sensorId) || null;
    }
    
    /**
     * Get all forecasts
     * @returns {Array} - Array of forecast objects
     */
    getAllForecasts() {
        return this.forecasts;
    }
    
    /**
     * Get personalized health recommendations based on location and demographic group
     * @param {string} sensorId - Sensor ID
     * @param {string} demographicGroup - Demographic group (general, elderly, children, respiratory, cardiovascular)
     * @returns {Object|null} - Recommendations object or null if not found
     */
    getPersonalizedRecommendations(sensorId, demographicGroup) {
        const healthRisk = this.healthRisks[sensorId];
        if (!healthRisk) return null;
        
        const groupRisk = healthRisk.risks[demographicGroup] || healthRisk.risks.general;
        if (!groupRisk) return null;
        
        return {
            location: healthRisk.location,
            aqi: healthRisk.aqi,
            aqiCategory: healthRisk.aqiCategory,
            riskLevel: groupRisk.level,
            riskScore: groupRisk.score,
            recommendations: groupRisk.recommendations,
            timestamp: healthRisk.timestamp
        };
    }
}

// Create a global instance of the environmental data manager
const environmentalDataManager = new EnvironmentalDataManager();

// Initialize the environment module when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEnvironmentModule();
});

/**
 * Initialize the environment module
 */
function initializeEnvironmentModule() {
    // Initialize the environmental data manager
    environmentalDataManager.initialize();
    
    // Set up event listeners
    setupEnvironmentEventListeners();
    
    // Load initial environmental data
    loadEnvironmentalData();
    
    console.log('Environment module initialized');
}

/**
 * Set up event listeners for environment module
 */
function setupEnvironmentEventListeners() {
    // Location selector
    const locationSelect = document.getElementById('environment-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            updateEnvironmentalDisplay();
        });
    }
    
    // Demographic group selector
    const demographicSelect = document.getElementById('demographic-group');
    if (demographicSelect) {
        demographicSelect.addEventListener('change', function() {
            updateHealthRiskDisplay();
        });
    }
    
    // Forecast time range selector
    const forecastRangeSelect = document.getElementById('forecast-range');
    if (forecastRangeSelect) {
        forecastRangeSelect.addEventListener('change', function() {
            updateForecastDisplay();
        });
    }
    
    // Pollution source filter checkboxes
    const sourceFilters = document.querySelectorAll('.pollution-source-filter');
    sourceFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updatePollutionSourcesDisplay();
        });
    });
}

/**
 * Load environmental data and update the UI
 */
function loadEnvironmentalData() {
    // Get all sensors
    const sensors = environmentalDataManager.getAllSensors();
    
    // Populate location selector
    populateLocationSelector(sensors);
    
    // Update the environmental display
    updateEnvironmentalDisplay();
    
    // Update the pollution sources display
    updatePollutionSourcesDisplay();
    
    // Update the map if the map function is available
    if (typeof switchMapLayer === 'function') {
        switchMapLayer('airQuality');
    }
}

/**
 * Populate the location selector dropdown
 * @param {Array} sensors - Array of sensor objects
 */
function populateLocationSelector(sensors) {
    const locationSelect = document.getElementById('environment-location');
    if (!locationSelect) return;
    
    // Clear existing options
    locationSelect.innerHTML = '';
    
    // Add options for each sensor location
    sensors.forEach(sensor => {
        const option = document.createElement('option');
        option.value = sensor.id;
        option.textContent = sensor.location.name;
        locationSelect.appendChild(option);
    });
}

/**
 * Update the environmental display based on selected location
 */
function updateEnvironmentalDisplay() {
    // Get selected location
    const locationSelect = document.getElementById('environment-location');
    if (!locationSelect) return;
    
    const sensorId = locationSelect.value;
    if (!sensorId) return;
    
    // Get sensor data
    const sensor = environmentalDataManager.getSensorById(sensorId);
    if (!sensor) return;
    
    // Update air quality display
    updateAirQualityDisplay(sensor);
    
    // Update health risk display
    updateHealthRiskDisplay();
    
    // Update forecast display
    updateForecastDisplay();
}

/**
 * Update the air quality display
 * @param {Object} sensor - Sensor object
 */
function updateAirQualityDisplay(sensor) {
    const airQualityContainer = document.getElementById('air-quality-data');
    if (!airQualityContainer) return;
    
    // Get AQI data
    const aqi = sensor.readings.aqi.value;
    const aqiCategory = sensor.readings.aqi.category;
    const aqiColor = getAQIColor(aqiCategory);
    
    // Format AQI category
    const formattedCategory = formatAQICategory(aqiCategory);
    
    // Create air quality card
    airQualityContainer.innerHTML = `
        <div class="air-quality-card">
            <div class="air-quality-header">
                <h3>Air Quality at ${sensor.location.name}</h3>
                <p>Last updated: ${formatDateTime(new Date(sensor.lastUpdated))}</p>
            </div>
            <div class="aqi-display">
                <div class="aqi-value" style="color: ${aqiColor}">${aqi}</div>
                <div class="aqi-category" style="color: ${aqiColor}">${formattedCategory}</div>
            </div>
            <div class="pollutant-details">
                <h4>Pollutant Levels</h4>
                <div class="pollutant-grid">
                    <div class="pollutant-item">
                        <div class="pollutant-name">PM2.5</div>
                        <div class="pollutant-value">${sensor.readings.pm25.value} ${sensor.readings.pm25.unit}</div>
                    </div>
                    <div class="pollutant-item">
                        <div class="pollutant-name">PM10</div>
                        <div class="pollutant-value">${sensor.readings.pm10.value} ${sensor.readings.pm10.unit}</div>
                    </div>
                    <div class="pollutant-item">
                        <div class="pollutant-name">NO₂</div>
                        <div class="pollutant-value">${sensor.readings.no2.value} ${sensor.readings.no2.unit}</div>
                    </div>
                    <div class="pollutant-item">
                        <div class="pollutant-name">SO₂</div>
                        <div class="pollutant-value">${sensor.readings.so2.value} ${sensor.readings.so2.unit}</div>
                    </div>
                    <div class="pollutant-item">
                        <div class="pollutant-name">CO</div>
                        <div class="pollutant-value">${sensor.readings.co.value} ${sensor.readings.co.unit}</div>
                    </div>
                    <div class="pollutant-item">
                        <div class="pollutant-name">O₃</div>
                        <div class="pollutant-value">${sensor.readings.o3.value} ${sensor.readings.o3.unit}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for air quality display if not already in the stylesheet
    if (!document.getElementById('air-quality-styles')) {
        const style = document.createElement('style');
        style.id = 'air-quality-styles';
        style.innerHTML = `
            .air-quality-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .air-quality-header h3 {
                margin-top: 0;
                margin-bottom: 5px;
            }
            .air-quality-header p {
                color: #666;
                font-size: 0.9em;
                margin: 0 0 15px 0;
            }
            .aqi-display {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                margin-bottom: 20px;
            }
            .aqi-value {
                font-size: 3em;
                font-weight: bold;
                line-height: 1;
            }
            .aqi-category {
                font-size: 1.2em;
                font-weight: 600;
                margin-top: 5px;
            }
            .pollutant-details h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .pollutant-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }
            .pollutant-item {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 10px;
            }
            .pollutant-name {
                font-size: 0.9em;
                color: #666;
                margin-bottom: 5px;
            }
            .pollutant-value {
                font-size: 1.2em;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Update the health risk display
 */
function updateHealthRiskDisplay() {
    // Get selected location
    const locationSelect = document.getElementById('environment-location');
    if (!locationSelect) return;
    
    const sensorId = locationSelect.value;
    if (!sensorId) return;
    
    // Get selected demographic group
    const demographicSelect = document.getElementById('demographic-group');
    if (!demographicSelect) return;
    
    const demographicGroup = demographicSelect.value || 'general';
    
    // Get health risk data
    const recommendations = environmentalDataManager.getPersonalizedRecommendations(sensorId, demographicGroup);
    if (!recommendations) return;
    
    // Update health risk display
    const healthRiskContainer = document.getElementById('health-risk-data');
    if (!healthRiskContainer) return;
    
    // Determine risk color
    let riskColor;
    switch (recommendations.riskLevel) {
        case 'minimal': riskColor = '#009966'; break; // Green
        case 'low': riskColor = '#ffde33'; break; // Yellow
        case 'moderate': riskColor = '#ff9933'; break; // Orange
        case 'high': riskColor = '#cc0033'; break; // Red
        case 'very_high': riskColor = '#660099'; break; // Purple
        case 'severe': riskColor = '#7e0023'; break; // Maroon
        default: riskColor = '#808080'; // Gray
    }
    
    // Format demographic group
    const formattedGroup = capitalizeFirstLetter(demographicGroup);
    
    // Format risk level
    const formattedRiskLevel = formatRiskLevel(recommendations.riskLevel);
    
    // Create health risk card
    healthRiskContainer.innerHTML = `
        <div class="health-risk-card">
            <div class="health-risk-header">
                <h3>Health Risk Assessment</h3>
                <p>For ${formattedGroup} at ${recommendations.location}</p>
            </div>
            <div class="risk-display">
                <div class="risk-level" style="color: ${riskColor}">${formattedRiskLevel}</div>
                <div class="risk-score">
                    <div class="risk-score-bar">
                        <div class="risk-score-fill" style="width: ${recommendations.riskScore}%; background-color: ${riskColor}"></div>
                    </div>
                    <div class="risk-score-value">${recommendations.riskScore}/100</div>
                </div>
            </div>
            <div class="recommendations">
                <h4>Health Recommendations</h4>
                <ul>
                    ${recommendations.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Add CSS for health risk display if not already in the stylesheet
    if (!document.getElementById('health-risk-styles')) {
        const style = document.createElement('style');
        style.id = 'health-risk-styles';
        style.innerHTML = `
            .health-risk-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .health-risk-header h3 {
                margin-top: 0;
                margin-bottom: 5px;
            }
            .health-risk-header p {
                color: #666;
                font-size: 0.9em;
                margin: 0 0 15px 0;
            }
            .risk-display {
                margin-bottom: 20px;
            }
            .risk-level {
                font-size: 1.5em;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .risk-score {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .risk-score-bar {
                flex-grow: 1;
                height: 10px;
                background-color: #f0f0f0;
                border-radius: 5px;
                overflow: hidden;
            }
            .risk-score-fill {
                height: 100%;
                border-radius: 5px;
            }
            .risk-score-value {
                font-weight: 600;
                min-width: 60px;
                text-align: right;
            }
            .recommendations h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .recommendations ul {
                margin: 0;
                padding-left: 20px;
            }
            .recommendations li {
                margin-bottom: 8px;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Update the forecast display
 */
function updateForecastDisplay() {
    // Get selected location
    const locationSelect = document.getElementById('environment-location');
    if (!locationSelect) return;
    
    const sensorId = locationSelect.value;
    if (!sensorId) return;
    
    // Get selected forecast range
    const forecastRangeSelect = document.getElementById('forecast-range');
    if (!forecastRangeSelect) return;
    
    const forecastRange = parseInt(forecastRangeSelect.value) || 24;
    
    // Get forecast data
    const forecast = environmentalDataManager.getForecast(sensorId);
    if (!forecast) return;
    
    // Update forecast display
    const forecastContainer = document.getElementById('forecast-data');
    if (!forecastContainer) return;
    
    // Limit forecast data to selected range
    const forecastData = forecast.hourly.slice(0, forecastRange);
    
    // Create forecast card
    forecastContainer.innerHTML = `
        <div class="forecast-card">
            <div class="forecast-header">
                <h3>Air Quality Forecast</h3>
                <p>Next ${forecastRange} hours for ${forecast.location}</p>
            </div>
            <div class="forecast-chart-container">
                <canvas id="forecast-chart"></canvas>
            </div>
            <div class="forecast-table-container">
                <table class="forecast-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>AQI</th>
                            <th>Category</th>
                            <th>Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${forecastData.map((hour, index) => {
                            const date = new Date(hour.timestamp);
                            const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            const aqiColor = getAQIColor(hour.category);
                            const formattedCategory = formatAQICategory(hour.category);
                            
                            return `
                                <tr>
                                    <td>${timeString}</td>
                                    <td style="color: ${aqiColor}; font-weight: bold;">${hour.aqi}</td>
                                    <td style="color: ${aqiColor};">${formattedCategory}</td>
                                    <td>${hour.confidence}%</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Add CSS for forecast display if not already in the stylesheet
    if (!document.getElementById('forecast-styles')) {
        const style = document.createElement('style');
        style.id = 'forecast-styles';
        style.innerHTML = `
            .forecast-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .forecast-header h3 {
                margin-top: 0;
                margin-bottom: 5px;
            }
            .forecast-header p {
                color: #666;
                font-size: 0.9em;
                margin: 0 0 15px 0;
            }
            .forecast-chart-container {
                height: 250px;
                margin-bottom: 20px;
            }
            .forecast-table-container {
                max-height: 300px;
                overflow-y: auto;
            }
            .forecast-table {
                width: 100%;
                border-collapse: collapse;
            }
            .forecast-table th, .forecast-table td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .forecast-table th {
                background-color: #f5f5f5;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create forecast chart if Chart.js is available
    if (typeof Chart === 'undefined') {
        // Add a message that Chart.js is required
        const chartContainer = document.getElementById('forecast-chart');
        if (chartContainer) {
            chartContainer.outerHTML = '<p>Chart.js is required to display forecast charts. Please include Chart.js in your project.</p>';
        }
    } else {
        createForecastChart(forecastData);
    }
}

/**
 * Create a forecast chart
 * @param {Array} forecastData - Array of forecast data points
 */
function createForecastChart(forecastData) {
    const ctx = document.getElementById('forecast-chart').getContext('2d');
    
    // Prepare data for chart
    const labels = [];
    const aqiData = [];
    const backgroundColors = [];
    const borderColors = [];
    
    forecastData.forEach(hour => {
        const date = new Date(hour.timestamp);
        labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        aqiData.push(hour.aqi);
        
        const color = getAQIColor(hour.category);
        backgroundColors.push(color + '40'); // Add transparency
        borderColors.push(color);
    });
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Forecasted AQI',
                data: aqiData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AQI Value'
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
                    text: 'Air Quality Forecast'
                }
            }
        }
    });
}

/**
 * Update the pollution sources display
 */
function updatePollutionSourcesDisplay() {
    // Get all pollution sources
    const sources = environmentalDataManager.getAllPollutionSources();
    
    // Get filter states
    const filters = {};
    const sourceFilters = document.querySelectorAll('.pollution-source-filter');
    sourceFilters.forEach(filter => {
        filters[filter.value] = filter.checked;
    });
    
    // If no filters are checked, show all sources
    const anyFilterChecked = Object.values(filters).some(checked => checked);
    
    // Filter sources based on selected types
    const filteredSources = anyFilterChecked
        ? sources.filter(source => filters[source.type])
        : sources;
    
    // Update pollution sources display
    const sourcesContainer = document.getElementById('pollution-sources');
    if (!sourcesContainer) return;
    
    // Create sources list
    sourcesContainer.innerHTML = `
        <div class="sources-card">
            <div class="sources-header">
                <h3>Pollution Sources</h3>
                <p>${filteredSources.length} sources found</p>
            </div>
            <div class="sources-list">
                ${filteredSources.map(source => {
                    // Determine emission level color
                    let emissionColor;
                    switch (source.emissionLevel) {
                        case 'high': emissionColor = '#cc0033'; break; // Red
                        case 'medium': emissionColor = '#ff9933'; break; // Orange
                        case 'low': emissionColor = '#ffde33'; break; // Yellow
                        default: emissionColor = '#808080'; // Gray
                    }
                    
                    // Format source type
                    const formattedType = capitalizeFirstLetter(source.type);
                    
                    // Format emission level
                    const formattedEmissionLevel = capitalizeFirstLetter(source.emissionLevel);
                    
                    return `
                        <div class="source-item">
                            <div class="source-header">
                                <div class="source-name">${source.name}</div>
                                <div class="source-type">${formattedType}</div>
                            </div>
                            <div class="source-details">
                                <div class="source-emission" style="color: ${emissionColor}">
                                    <strong>Emission Level:</strong> ${formattedEmissionLevel}
                                </div>
                                <div class="source-pollutants">
                                    <strong>Pollutants:</strong> ${source.pollutants.map(p => formatPollutantName(p)).join(', ')}
                                </div>
                                ${source.operatingHours ? `
                                    <div class="source-hours">
                                        <strong>Operating Hours:</strong> ${source.operatingHours}
                                    </div>
                                ` : ''}
                                ${source.lastInspection ? `
                                    <div class="source-inspection">
                                        <strong>Last Inspection:</strong> ${formatDate(new Date(source.lastInspection))}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // Add CSS for pollution sources display if not already in the stylesheet
    if (!document.getElementById('sources-styles')) {
        const style = document.createElement('style');
        style.id = 'sources-styles';
        style.innerHTML = `
            .sources-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .sources-header h3 {
                margin-top: 0;
                margin-bottom: 5px;
            }
            .sources-header p {
                color: #666;
                font-size: 0.9em;
                margin: 0 0 15px 0;
            }
            .sources-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .source-item {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 12px;
            }
            .source-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .source-name {
                font-weight: 600;
                font-size: 1.1em;
            }
            .source-type {
                background-color: #e0e0e0;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 0.8em;
            }
            .source-details {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 8px;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update the map if the map function is available
    if (typeof cityMap !== 'undefined') {
        // In a real application, this would update the map with pollution sources
        console.log('Updating map with pollution sources');
    }
}

/**
 * Format pollutant name for display
 * @param {string} pollutant - Pollutant code
 * @returns {string} - Formatted pollutant name
 */
function formatPollutantName(pollutant) {
    switch (pollutant) {
        case 'pm25': return 'PM2.5';
        case 'pm10': return 'PM10';
        case 'no2': return 'NO₂';
        case 'so2': return 'SO₂';
        case 'co': return 'CO';
        case 'o3': return 'O₃';
        default: return pollutant.toUpperCase();
    }
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
        default: return 'Unknown';
    }
}

/**
 * Format risk level for display
 * @param {string} level - The risk level
 * @returns {string} - Formatted risk level
 */
function formatRiskLevel(level) {
    switch (level.toLowerCase()) {
        case 'minimal': return 'Minimal Risk';
        case 'low': return 'Low Risk';
        case 'moderate': return 'Moderate Risk';
        case 'high': return 'High Risk';
        case 'very_high': return 'Very High Risk';
        case 'severe': return 'Severe Risk';
        default: return 'Unknown Risk';
    }
}

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format date and time for display
 * @param {Date} date - Date object
 * @returns {string} - Formatted date and time string
 */
function formatDateTime(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - Input string
 * @returns {string} - String with first letter capitalized
 */
function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}