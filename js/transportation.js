/**
 * Smart City Data Analytics Dashboard - Transportation Module
 * This file contains the implementation of the Public Transportation Optimizer
 */

// Transportation Data Manager class for public transit optimization
class TransportationManager {
    constructor() {
        this.vehicles = [];
        this.routes = [];
        this.stops = [];
        this.schedules = {};
        this.delays = {};
        this.crowdLevels = {};
        this.initialized = false;
    }
    
    /**
     * Initialize the transportation manager with sample data
     */
    initialize() {
        if (this.initialized) return;
        
        // Load sample stops
        this.loadSampleStops();
        
        // Load sample routes
        this.loadSampleRoutes();
        
        // Load sample vehicles
        this.loadSampleVehicles();
        
        // Generate schedules
        this.generateSchedules();
        
        // Generate delays
        this.generateDelays();
        
        // Generate crowd levels
        this.generateCrowdLevels();
        
        this.initialized = true;
        console.log('Transportation Manager initialized');
    }
    
    /**
     * Load sample stops
     */
    loadSampleStops() {
        // Sample stop locations around the city
        const stopLocations = [
            { lat: 40.7128, lng: -74.006, name: 'Downtown Terminal' },
            { lat: 40.7138, lng: -74.013, name: 'Westside Station' },
            { lat: 40.7118, lng: -74.009, name: 'Eastside Hub' },
            { lat: 40.7148, lng: -74.016, name: 'North Square' },
            { lat: 40.7108, lng: -74.002, name: 'South Junction' },
            { lat: 40.7158, lng: -74.008, name: 'Central Park Station' },
            { lat: 40.7168, lng: -74.018, name: 'Industrial Zone Terminal' },
            { lat: 40.7098, lng: -74.019, name: 'Residential Area Stop' },
            { lat: 40.7135, lng: -74.010, name: 'City Center' },
            { lat: 40.7145, lng: -74.005, name: 'University Station' },
            { lat: 40.7115, lng: -74.015, name: 'Hospital Stop' },
            { lat: 40.7125, lng: -74.020, name: 'Shopping District' }
        ];
        
        // Generate stop data
        stopLocations.forEach((location, index) => {
            const stopId = `stop_${(index + 1).toString().padStart(3, '0')}`;
            
            // Determine accessibility features
            const hasElevator = Math.random() > 0.3; // 70% chance of having an elevator
            const hasRamp = Math.random() > 0.2; // 80% chance of having a ramp
            const hasTactilePaving = Math.random() > 0.4; // 60% chance of having tactile paving
            
            // Determine amenities
            const amenities = [];
            if (Math.random() > 0.3) amenities.push('shelter');
            if (Math.random() > 0.5) amenities.push('seating');
            if (Math.random() > 0.7) amenities.push('real_time_display');
            if (Math.random() > 0.8) amenities.push('ticket_machine');
            if (Math.random() > 0.9) amenities.push('wifi');
            
            // Create stop object
            const stop = {
                id: stopId,
                name: location.name,
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                type: index < 3 ? 'terminal' : (index < 8 ? 'station' : 'stop'),
                accessibility: {
                    wheelchair: hasElevator || hasRamp,
                    elevator: hasElevator,
                    ramp: hasRamp,
                    tactilePaving: hasTactilePaving
                },
                amenities: amenities,
                connections: []
            };
            
            this.stops.push(stop);
        });
        
        // Add connections between stops
        this.stops.forEach(stop => {
            // Each stop connects to 2-4 other stops
            const numConnections = 2 + Math.floor(Math.random() * 3);
            const otherStops = this.stops.filter(s => s.id !== stop.id);
            
            // Shuffle and take the first numConnections
            const shuffled = otherStops.sort(() => 0.5 - Math.random());
            const connections = shuffled.slice(0, numConnections);
            
            // Add connections
            connections.forEach(connectedStop => {
                // Calculate distance between stops
                const distance = this.calculateDistance(
                    stop.location.lat, stop.location.lng,
                    connectedStop.location.lat, connectedStop.location.lng
                );
                
                // Add connection
                stop.connections.push({
                    stopId: connectedStop.id,
                    distance: distance,
                    travelTime: Math.round(distance / 30 * 60) // Assuming 30 km/h average speed
                });
            });
        });
    }
    
    /**
     * Calculate distance between two points using Haversine formula
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lon1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lon2 - Longitude of point 2
     * @returns {number} - Distance in kilometers
     */
CalculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        return parseFloat(distance.toFixed(2));
    }
    
    /**
     * Convert degrees to radians
     * @param {number} deg - Degrees
     * @returns {number} - Radians
     */
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    /**
     * Load sample routes
     */
    loadSampleRoutes() {
        // Define route types
        const routeTypes = ['bus', 'subway', 'tram', 'train'];
        
        // Generate 5 routes
        for (let i = 0; i < 5; i++) {
            const routeId = `route_${(i + 1).toString().padStart(3, '0')}`;
            const routeType = routeTypes[i % routeTypes.length];
            
            // Determine route color based on type
            let routeColor;
            switch (routeType) {
                case 'bus': routeColor = '#0066CC'; break; // Blue
                case 'subway': routeColor = '#CC0000'; break; // Red
                case 'tram': routeColor = '#009933'; break; // Green
                case 'train': routeColor = '#FF6600'; break; // Orange
                default: routeColor = '#666666'; // Gray
            }
            
            // Select stops for this route (5-8 stops per route)
            const numStops = 5 + Math.floor(Math.random() * 4);
            const shuffledStops = [...this.stops].sort(() => 0.5 - Math.random());
            const routeStops = shuffledStops.slice(0, numStops);
            
            // Sort stops to create a logical route
            // In a real application, this would use a more sophisticated algorithm
            routeStops.sort((a, b) => a.location.lat - b.location.lat);
            
            // Create route object
            const route = {
                id: routeId,
                name: this.generateRouteName(routeType, i),
                type: routeType,
                color: routeColor,
                stops: routeStops.map(stop => stop.id),
                frequency: this.generateFrequency(routeType),
                operatingHours: this.generateOperatingHours(routeType),
                accessibility: routeType !== 'bus' // Assume all except buses are fully accessible
            };
            
            this.routes.push(route);
        }
    }
    
    /**
     * Generate a route name based on type and index
     * @param {string} type - Route type
     * @param {number} index - Route index
     * @returns {string} - Route name
     */
    generateRouteName(type, index) {
        switch (type) {
            case 'bus':
                return `Bus Line ${index + 1}`;
            case 'subway':
                return `Metro Line ${String.fromCharCode(65 + index)}`; // A, B, C, etc.
            case 'tram':
                return `Tram ${index + 1}`;
            case 'train':
                return `Express Train ${index + 1}`;
            default:
                return `Route ${index + 1}`;
        }
    }
    
    /**
     * Generate frequency based on route type
     * @param {string} type - Route type
     * @returns {Object} - Frequency object
     */
    generateFrequency(type) {
        let peakMinutes, offPeakMinutes;
        
        switch (type) {
            case 'subway':
                peakMinutes = 5;
                offPeakMinutes = 10;
                break;
            case 'train':
                peakMinutes = 15;
                offPeakMinutes = 30;
                break;
            case 'tram':
                peakMinutes = 8;
                offPeakMinutes = 15;
                break;
            case 'bus':
            default:
                peakMinutes = 10;
                offPeakMinutes = 20;
                break;
        }
        
        return {
            peak: peakMinutes,
            offPeak: offPeakMinutes
        };
    }
    
    /**
     * Generate operating hours based on route type
     * @param {string} type - Route type
     * @returns {Object} - Operating hours object
     */
    generateOperatingHours(type) {
        let weekdayStart, weekdayEnd, weekendStart, weekendEnd;
        
        switch (type) {
            case 'subway':
                weekdayStart = '05:00';
                weekdayEnd = '01:00';
                weekendStart = '06:00';
                weekendEnd = '01:00';
                break;
            case 'train':
                weekdayStart = '05:30';
                weekdayEnd = '23:30';
                weekendStart = '06:30';
                weekendEnd = '22:30';
                break;
            case 'tram':
                weekdayStart = '06:00';
                weekdayEnd = '00:00';
                weekendStart = '07:00';
                weekendEnd = '00:00';
                break;
            case 'bus':
            default:
                weekdayStart = '05:30';
                weekdayEnd = '23:00';
                weekendStart = '06:30';
                weekendEnd = '22:00';
                break;
        }
        
        return {
            weekday: {
                start: weekdayStart,
                end: weekdayEnd
            },
            weekend: {
                start: weekendStart,
                end: weekendEnd
            }
        };
    }
    
    /**
     * Load sample vehicles
     */
    loadSampleVehicles() {
        // Generate vehicles for each route
        this.routes.forEach(route => {
            // Determine number of vehicles based on route type
            let numVehicles;
            switch (route.type) {
                case 'subway': numVehicles = 8; break;
                case 'train': numVehicles = 5; break;
                case 'tram': numVehicles = 6; break;
                case 'bus': numVehicles = 10; break;
                default: numVehicles = 5;
            }
            
            // Generate vehicles
            for (let i = 0; i < numVehicles; i++) {
                const vehicleId = `${route.type}_${(this.vehicles.length + 1).toString().padStart(3, '0')}`;
                
                // Determine vehicle capacity based on type
                let capacity;
                switch (route.type) {
                    case 'subway': capacity = 800; break;
                    case 'train': capacity = 500; break;
                    case 'tram': capacity = 200; break;
                    case 'bus': capacity = 80; break;
                    default: capacity = 100;
                }
                
                // Determine current location (random stop on the route)
                const currentStopIndex = Math.floor(Math.random() * route.stops.length);
                const currentStop = route.stops[currentStopIndex];
                
                // Determine next stop
                const nextStopIndex = (currentStopIndex + 1) % route.stops.length;
                const nextStop = route.stops[nextStopIndex];
                
                // Create vehicle object
                const vehicle = {
                    id: vehicleId,
                    routeId: route.id,
                    type: route.type,
                    capacity: capacity,
                    status: Math.random() > 0.9 ? 'out_of_service' : 'in_service',
                    location: {
                        currentStop: currentStop,
                        nextStop: nextStop,
                        progress: Math.random() // 0-1 progress between stops
                    },
                    accessibility: {
                        wheelchair: route.type !== 'bus' || Math.random() > 0.3, // 70% of buses are wheelchair accessible
                        visualAnnouncements: Math.random() > 0.2, // 80% have visual announcements
                        audioAnnouncements: Math.random() > 0.1 // 90% have audio announcements
                    },
                    occupancy: Math.floor(Math.random() * capacity), // Current number of passengers
                    lastUpdated: new Date().toISOString()
                };
                
                this.vehicles.push(vehicle);
            }
        });
    }
    
    /**
     * Generate schedules for all routes
     */
    generateSchedules() {
        this.routes.forEach(route => {
            const routeSchedule = {
                weekday: this.generateDailySchedule(route, 'weekday'),
                weekend: this.generateDailySchedule(route, 'weekend')
            };
            
            this.schedules[route.id] = routeSchedule;
        });
    }
    
    /**
     * Generate daily schedule for a route
     * @param {Object} route - Route object
     * @param {string} dayType - Day type (weekday or weekend)
     * @returns {Array} - Array of departure times for each stop
     */
    generateDailySchedule(route, dayType) {
        const schedule = [];
        
        // Get operating hours
        const operatingHours = route.operatingHours[dayType];
        const startTime = this.timeToMinutes(operatingHours.start);
        const endTime = this.timeToMinutes(operatingHours.end);
        
        // Adjust end time if it's past midnight
        const adjustedEndTime = endTime < startTime ? endTime + 24 * 60 : endTime;
        
        // Get frequency
        const peakStart = 7 * 60; // 7:00 AM
        const peakEnd = 9 * 60; // 9:00 AM
        const peakStart2 = 16 * 60; // 4:00 PM
        const peakEnd2 = 19 * 60; // 7:00 PM
        
        // Generate departures for each stop
        route.stops.forEach((stopId, stopIndex) => {
            const stopDepartures = [];
            
            // Calculate base travel time to this stop from the start of the route
            let baseTravelTime = 0;
            for (let i = 0; i < stopIndex; i++) {
                // In a real application, this would use actual travel times between stops
                baseTravelTime += 5; // Assume 5 minutes between stops for simplicity
            }
            
            // Generate departures throughout the day
            let currentTime = startTime;
            while (currentTime < adjustedEndTime) {
                // Determine frequency based on time of day
                let frequency;
                if ((currentTime >= peakStart && currentTime <= peakEnd) ||
                    (currentTime >= peakStart2 && currentTime <= peakEnd2)) {
                    frequency = route.frequency.peak;
                } else {
                    frequency = route.frequency.offPeak;
                }
                
                // Add departure time
                const departureTime = currentTime + baseTravelTime;
                
                // Format time (handle times past midnight)
                let hours = Math.floor(departureTime / 60) % 24;
                let minutes = departureTime % 60;
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                
                stopDepartures.push(formattedTime);
                
                // Move to next departure
                currentTime += frequency;
            }
            
            schedule.push({
                stopId: stopId,
                departures: stopDepartures
            });
        });
        
        return schedule;
    }
    
    /**
     * Convert time string to minutes
     * @param {string} timeStr - Time string (HH:MM)
     * @returns {number} - Minutes since midnight
     */
    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    
    /**
     * Generate delays for vehicles
     */
    generateDelays() {
        this.vehicles.forEach(vehicle => {
            // 30% chance of delay
            if (Math.random() < 0.3) {
                // Generate random delay (1-15 minutes)
                const delayMinutes = 1 + Math.floor(Math.random() * 15);
                
                // Determine reason for delay
                const delayReasons = [
                    'Traffic congestion',
                    'Technical issues',
                    'Weather conditions',
                    'High passenger volume',
                    'Road maintenance',
                    'Signal problems'
                ];
                const reason = delayReasons[Math.floor(Math.random() * delayReasons.length)];
                
                // Create delay object
                this.delays[vehicle.id] = {
                    minutes: delayMinutes,
                    reason: reason,
                    timestamp: new Date().toISOString()
                };
            }
        });
    }
    
    /**
     * Generate crowd levels for stops
     */
    generateCrowdLevels() {
        this.stops.forEach(stop => {
            // Generate crowd level (0-100%)
            const crowdLevel = Math.floor(Math.random() * 101);
            
            // Determine crowd category
            let category;
            if (crowdLevel < 30) {
                category = 'low';
            } else if (crowdLevel < 70) {
                category = 'moderate';
            } else if (crowdLevel < 90) {
                category = 'high';
            } else {
                category = 'very_high';
            }
            
            // Create crowd level object
            this.crowdLevels[stop.id] = {
                level: crowdLevel,
                category: category,
                timestamp: new Date().toISOString()
            };
        });
    }
    
    /**
     * Get all routes
     * @returns {Array} - Array of route objects
     */
    getAllRoutes() {
        return this.routes;
    }
    
    /**
     * Get route by ID
     * @param {string} routeId - Route ID
     * @returns {Object|null} - Route object or null if not found
     */
    getRouteById(routeId) {
        return this.routes.find(route => route.id === routeId) || null;
    }
    
    /**
     * Get all stops
     * @returns {Array} - Array of stop objects
     */
    getAllStops() {
        return this.stops;
    }
    
    /**
     * Get stop by ID
     * @param {string} stopId - Stop ID
     * @returns {Object|null} - Stop object or null if not found
     */
    getStopById(stopId) {
        return this.stops.find(stop => stop.id === stopId) || null;
    }
    
    /**
     * Get all vehicles
     * @returns {Array} - Array of vehicle objects
     */
    getAllVehicles() {
        return this.vehicles;
    }
    
    /**
     * Get vehicles by route
     * @param {string} routeId - Route ID
     * @returns {Array} - Array of vehicle objects
     */
    getVehiclesByRoute(routeId) {
        return this.vehicles.filter(vehicle => vehicle.routeId === routeId);
    }
    
    /**
     * Get schedule for a route
     * @param {string} routeId - Route ID
     * @returns {Object|null} - Schedule object or null if not found
     */
    getRouteSchedule(routeId) {
        return this.schedules[routeId] || null;
    }
    
    /**
     * Get delay for a vehicle
     * @param {string} vehicleId - Vehicle ID
     * @returns {Object|null} - Delay object or null if not found
     */
    getVehicleDelay(vehicleId) {
        return this.delays[vehicleId] || null;
    }
    
    /**
     * Get crowd level for a stop
     * @param {string} stopId - Stop ID
     * @returns {Object|null} - Crowd level object or null if not found
     */
    getStopCrowdLevel(stopId) {
        return this.crowdLevels[stopId] || null;
    }
    
    /**
     * Find optimal route between two stops
     * @param {string} startStopId - Starting stop ID
     * @param {string} endStopId - Ending stop ID
     * @param {Object} options - Routing options
     * @returns {Object} - Optimal route object
     */
    findOptimalRoute(startStopId, endStopId, options = {}) {
        // Default options
        const defaultOptions = {
            preferAccessible: false,
            avoidCrowded: false,
            maxTransfers: 2,
            departureTime: new Date()
        };
        
        // Merge options
        const routeOptions = { ...defaultOptions, ...options };
        
        // In a real application, this would use a pathfinding algorithm like Dijkstra's or A*
        // For this demo, we'll create a simplified route
        
        // Get start and end stops
        const startStop = this.getStopById(startStopId);
        const endStop = this.getStopById(endStopId);
        
        if (!startStop || !endStop) {
            return {
                success: false,
                error: 'Invalid stop ID'
            };
        }
        
        // Find routes that include these stops
        const routesWithStart = this.routes.filter(route => route.stops.includes(startStopId));
        const routesWithEnd = this.routes.filter(route => route.stops.includes(endStopId));
        
        // Check if there's a direct route
        const directRoutes = routesWithStart.filter(route => route.stops.includes(endStopId));
        
        if (directRoutes.length > 0) {
            // Use the first direct route
            const route = directRoutes[0];
            
            // Calculate travel time
            const startIndex = route.stops.indexOf(startStopId);
            const endIndex = route.stops.indexOf(endStopId);
            const travelTime = Math.abs(endIndex - startIndex) * 5; // Assume 5 minutes between stops
            
            return {
                success: true,
                journeyType: 'direct',
                route: {
                    routeId: route.id,
                    routeName: route.name,
                    routeType: route.type,
                    routeColor: route.color,
                    startStop: startStop.name,
                    endStop: endStop.name,
                    travelTime: travelTime,
                    distance: travelTime * 0.5, // Rough estimate: 0.5 km per minute
                    departureTime: this.formatTime(routeOptions.departureTime),
                    arrivalTime: this.formatTime(new Date(routeOptions.departureTime.getTime() + travelTime * 60000)),
                    stops: route.stops.slice(
                        Math.min(startIndex, endIndex),
                        Math.max(startIndex, endIndex) + 1
                    ).map(stopId => this.getStopById(stopId).name),
                    accessibility: route.accessibility
                }
            };
        } else if (routesWithStart.length > 0 && routesWithEnd.length > 0 && routeOptions.maxTransfers > 0) {
            // Need to transfer
            // In a real application, this would find common stops between routes
            // For simplicity, we'll assume a transfer at a central hub
            
            const transferStop = this.stops.find(stop => stop.name === 'City Center');
            
            if (!transferStop) {
                return {
                    success: false,
                    error: 'No transfer stop found'
                };
            }
            
            // Find routes that include the transfer stop
            const routesWithTransfer = this.routes.filter(route => 
                route.stops.includes(transferStop.id) && 
                (route.stops.includes(startStopId) || route.stops.includes(endStopId))
            );
            
            if (routesWithTransfer.length < 2) {
                return {
                    success: false,
                    error: 'No viable transfer route found'
                };
            }
            
            // Select first route from start to transfer
            const firstRoute = routesWithTransfer.find(route => route.stops.includes(startStopId));
            
            // Select second route from transfer to end
            const secondRoute = routesWithTransfer.find(route => 
                route.id !== firstRoute.id && route.stops.includes(endStopId)
            );
            
            // Calculate travel times
            const firstStartIndex = firstRoute.stops.indexOf(startStopId);
            const firstEndIndex = firstRoute.stops.indexOf(transferStop.id);
            const firstTravelTime = Math.abs(firstEndIndex - firstStartIndex) * 5;
            
            const secondStartIndex = secondRoute.stops.indexOf(transferStop.id);
            const secondEndIndex = secondRoute.stops.indexOf(endStopId);
            const secondTravelTime = Math.abs(secondEndIndex - secondStartIndex) * 5;
            
            // Add transfer time
            const transferTime = 10; // 10 minutes for transfer
            
            // Calculate total time
            const totalTime = firstTravelTime + transferTime + secondTravelTime;
            
            // Calculate departure and arrival times
            const transferArrivalTime = new Date(routeOptions.departureTime.getTime() + firstTravelTime * 60000);
            const secondDepartureTime = new Date(transferArrivalTime.getTime() + transferTime * 60000);
            const arrivalTime = new Date(secondDepartureTime.getTime() + secondTravelTime * 60000);
            
            return {
                success: true,
                journeyType: 'transfer',
                route: {
                    segments: [
                        {
                            routeId: firstRoute.id,
                            routeName: firstRoute.name,
                            routeType: firstRoute.type,
                            routeColor: firstRoute.color,
                            startStop: startStop.name,
                            endStop: transferStop.name,
                            travelTime: firstTravelTime,
                            departureTime: this.formatTime(routeOptions.departureTime),
                            arrivalTime: this.formatTime(transferArrivalTime),
                            accessibility: firstRoute.accessibility
                        },
                        {
                            routeId: secondRoute.id,
                            routeName: secondRoute.name,
                            routeType: secondRoute.type,
                            routeColor: secondRoute.color,
                            startStop: transferStop.name,
                            endStop: endStop.name,
                            travelTime: secondTravelTime,
                            departureTime: this.formatTime(secondDepartureTime),
                            arrivalTime: this.formatTime(arrivalTime),
                            accessibility: secondRoute.accessibility
                        }
                    ],
                    totalTravelTime: totalTime,
                    totalDistance: totalTime * 0.5, // Rough estimate
                    transferTime: transferTime,
                    transferLocation: transferStop.name,
                    departureTime: this.formatTime(routeOptions.departureTime),
                    arrivalTime: this.formatTime(arrivalTime),
                    accessibility: firstRoute.accessibility && secondRoute.accessibility
                }
            };
        }
        
        // No viable route found
        return {
            success: false,
            error: 'No viable route found'
        };
    }
    
    /**
     * Format time for display
     * @param {Date} date - Date object
     * @returns {string} - Formatted time string
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * Update vehicle positions (simulate movement)
     */
    updateVehiclePositions() {
        this.vehicles.forEach(vehicle => {
            // Skip vehicles that are out of service
            if (vehicle.status === 'out_of_service') return;
            
            // Get route
            const route = this.getRouteById(vehicle.routeId);
            if (!route) return;
            
            // Update progress
            vehicle.location.progress += 0.05;
            
            // If reached next stop
            if (vehicle.location.progress >= 1) {
                // Reset progress
                vehicle.location.progress = 0;
                
                // Update current stop
                vehicle.location.currentStop = vehicle.location.nextStop;
                
                // Find index of current stop in route
                const currentStopIndex = route.stops.indexOf(vehicle.location.currentStop);
                
                // Determine next stop
                const nextStopIndex = (currentStopIndex + 1) % route.stops.length;
                vehicle.location.nextStop = route.stops[nextStopIndex];
                
                // Update occupancy (simulate passengers getting on/off)
                const maxChange = Math.floor(vehicle.capacity * 0.2); // Max 20% change
                const change = Math.floor(Math.random() * maxChange) * (Math.random() > 0.5 ? 1 : -1);
                vehicle.occupancy = Math.max(0, Math.min(vehicle.capacity, vehicle.occupancy + change));
            }
            
            // Update timestamp
            vehicle.lastUpdated = new Date().toISOString();
        });
    }
}

// Create a global instance of the transportation manager
const transportationManager = new TransportationManager();

// Initialize the transportation module when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTransportationModule();
});

/**
 * Initialize the transportation module
 */
function initializeTransportationModule() {
    // Initialize the transportation manager
    transportationManager.initialize();
    
    // Set up event listeners
    setupTransportationEventListeners();
    
    // Load initial transportation data
    loadTransportationData();
    
    // Start vehicle position updates
    setInterval(() => {
        transportationManager.updateVehiclePositions();
        updateVehicleMarkers();
    }, 5000); // Update every 5 seconds
    
    console.log('Transportation module initialized');
}

/**
 * Set up event listeners for transportation module
 */
function setupTransportationEventListeners() {
    // Route selector
    const routeSelect = document.getElementById('transport-route');
    if (routeSelect) {
        routeSelect.addEventListener('change', function() {
            updateRouteDisplay();
        });
    }
    
    // Route type filters
    const routeTypeFilters = document.querySelectorAll('.route-type-filter');
    routeTypeFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateRouteFilters();
        });
    });
    
    // Journey planner form
    const journeyForm = document.getElementById('journey-planner-form');
    if (journeyForm) {
        journeyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            planJourney();
        });
    }
    
    // Accessibility toggle
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('change', function() {
            updateJourneyOptions();
        });
    }
    
    // Avoid crowded toggle
    const crowdedToggle = document.getElementById('avoid-crowded-toggle');
    if (crowdedToggle) {
        crowdedToggle.addEventListener('change', function() {
            updateJourneyOptions();
        });
    }
}

/**
 * Load transportation data and update the UI
 */
function loadTransportationData() {
    // Get all routes
    const routes = transportationManager.getAllRoutes();
    
    // Populate route selector
    populateRouteSelector(routes);
    
    // Populate stop selectors for journey planner
    populateStopSelectors();
    
    // Update the route display
    updateRouteDisplay();
    
    // Update the map if the map function is available
    if (typeof switchMapLayer === 'function') {
        switchMapLayer('transport');
    }
}

/**
 * Populate the route selector dropdown
 * @param {Array} routes - Array of route objects
 */
function populateRouteSelector(routes) {
    const routeSelect = document.getElementById('transport-route');
    if (!routeSelect) return;
    
    // Clear existing options
    routeSelect.innerHTML = '';
    
    // Add options for each route
    routes.forEach(route => {
        const option = document.createElement('option');
        option.value = route.id;
        option.textContent = route.name;
        option.style.color = route.color;
        routeSelect.appendChild(option);
    });
}

/**
 * Populate stop selectors for journey planner
 */
function populateStopSelectors() {
    const startStopSelect = document.getElementById('journey-start');
    const endStopSelect = document.getElementById('journey-end');
    
    if (!startStopSelect || !endStopSelect) return;
    
    // Get all stops
    const stops = transportationManager.getAllStops();
    
    // Clear existing options
    startStopSelect.innerHTML = '';
    endStopSelect.innerHTML = '';
    
    // Add default option
    const startDefaultOption = document.createElement('option');
    startDefaultOption.value = '';
    startDefaultOption.textContent = 'Select start location';
    startStopSelect.appendChild(startDefaultOption);
    
    const endDefaultOption = document.createElement('option');
    endDefaultOption.value = '';
    endDefaultOption.textContent = 'Select destination';
    endStopSelect.appendChild(endDefaultOption);
    
    // Add options for each stop
    stops.forEach(stop => {
        // Start stop option
        const startOption = document.createElement('option');
        startOption.value = stop.id;
        startOption.textContent = stop.name;
        startStopSelect.appendChild(startOption);
        
        // End stop option
        const endOption = document.createElement('option');
        endOption.value = stop.id;
        endOption.textContent = stop.name;
        endStopSelect.appendChild(endOption);
    });
}

/**
 * Update route filters based on checkboxes
 */
function updateRouteFilters() {
    // Get filter states
    const filters = {};
    const routeTypeFilters = document.querySelectorAll('.route-type-filter');
    routeTypeFilters.forEach(filter => {
        filters[filter.value] = filter.checked;
    });
    
    // Get all routes
    const routes = transportationManager.getAllRoutes();
    
    // Filter routes based on selected types
    const filteredRoutes = routes.filter(route => filters[route.type]);
    
    // Update route selector
    populateRouteSelector(filteredRoutes);
    
    // Update route display
    updateRouteDisplay();
    
    // Update the map if the map function is available
    if (typeof updateTransportLayer === 'function') {
        updateTransportLayer(filteredRoutes);
    }
}

/**
 * Update the route display based on selected route
 */
function updateRouteDisplay() {
    // Get selected route
    const routeSelect = document.getElementById('transport-route');
    if (!routeSelect) return;
    
    const routeId = routeSelect.value;
    if (!routeId) return;
    
    // Get route data
    const route = transportationManager.getRouteById(routeId);
    if (!route) return;
    
    // Get vehicles for this route
    const vehicles = transportationManager.getVehiclesByRoute(routeId);
    
    // Get schedule for this route
    const schedule = transportationManager.getRouteSchedule(routeId);
    
    // Update route info display
    updateRouteInfo(route, vehicles, schedule);
    
    // Update vehicle display
    updateVehicleDisplay(vehicles);
    
    // Update the map if the map function is available
    if (typeof highlightRoute === 'function') {
        highlightRoute(route);
    }
}

/**
 * Update the route info display
 * @param {Object} route - Route object
 * @param {Array} vehicles - Array of vehicle objects for this route
 * @param {Object} schedule - Schedule object for this route
 */
function updateRouteInfo(route, vehicles, schedule) {
    const routeInfoContainer = document.getElementById('route-info');
    if (!routeInfoContainer) return;
    
    // Determine route type icon
    let routeTypeIcon;
    switch (route.type) {
        case 'bus': routeTypeIcon = '🚌'; break;
        case 'subway': routeTypeIcon = '🚇'; break;
        case 'tram': routeTypeIcon = '🚊'; break;
        case 'train': routeTypeIcon = '🚆'; break;
        default: routeTypeIcon = '🚌';
    }
    
    // Get stops for this route
    const stops = route.stops.map(stopId => transportationManager.getStopById(stopId));
    
    // Determine if it's a weekday or weekend
    const today = new Date();
    const dayType = today.getDay() === 0 || today.getDay() === 6 ? 'weekend' : 'weekday';
    
    // Create route info card
    routeInfoContainer.innerHTML = `
        <div class="route-card" style="border-color: ${route.color}">
            <div class="route-header" style="background-color: ${route.color}">
                <div class="route-icon">${routeTypeIcon}</div>
                <div class="route-name">${route.name}</div>
            </div>
            <div class="route-details">
                <div class="route-stats">
                    <div class="route-stat">
                        <div class="stat-label">Stops</div>
                        <div class="stat-value">${route.stops.length}</div>
                    </div>
                    <div class="route-stat">
                        <div class="stat-label">Vehicles</div>
                        <div class="stat-value">${vehicles.length}</div>
                    </div>
                    <div class="route-stat">
                        <div class="stat-label">Frequency</div>
                        <div class="stat-value">${route.frequency.peak} min (peak)</div>
                    </div>
                </div>
                <div class="route-hours">
                    <div class="hours-label">Operating Hours:</div>
                    <div class="hours-value">
                        <div>Weekdays: ${route.operatingHours.weekday.start} - ${route.operatingHours.weekday.end}</div>
                        <div>Weekends: ${route.operatingHours.weekend.start} - ${route.operatingHours.weekend.end}</div>
                    </div>
                </div>
                <div class="route-accessibility">
                    <div class="accessibility-label">Accessibility:</div>
                    <div class="accessibility-value">
                        ${route.accessibility ? 
                            '<span class="accessible">♿ Fully accessible</span>' : 
                            '<span class="not-accessible">⚠️ Limited accessibility</span>'}
                    </div>
                </div>
            </div>
            <div class="route-stops">
                <h4>Stops</h4>
                <div class="stops-list">
                    ${stops.map((stop, index) => {
                        // Get next departure time
                        let nextDeparture = '';
                        if (schedule && schedule[dayType]) {
                            const stopSchedule = schedule[dayType].find(s => s.stopId === stop.id);
                            if (stopSchedule) {
                                const now = new Date();
                                const currentHour = now.getHours();
                                const currentMinute = now.getMinutes();
                                const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                                
                                // Find next departure
                                const nextDepartureTime = stopSchedule.departures.find(time => time > currentTimeStr);
                                if (nextDepartureTime) {
                                    nextDeparture = nextDepartureTime;
                                }
                            }
                        }
                        
                        // Get crowd level
                        const crowdLevel = transportationManager.getStopCrowdLevel(stop.id);
                        let crowdIndicator = '';
                        if (crowdLevel) {
                            let crowdIcon;
                            switch (crowdLevel.category) {
                                case 'low': crowdIcon = '🟢'; break;
                                case 'moderate': crowdIcon = '🟡'; break;
                                case 'high': crowdIcon = '🟠'; break;
                                case 'very_high': crowdIcon = '🔴'; break;
                                default: crowdIcon = '⚪';
                            }
                            crowdIndicator = `<span class="crowd-indicator" title="Crowd level: ${crowdLevel.level}%">${crowdIcon}</span>`;
                        }
                        
                        return `
                            <div class="stop-item">
                                <div class="stop-number">${index + 1}</div>
                                <div class="stop-details">
                                    <div class="stop-name">${stop.name} ${crowdIndicator}</div>
                                    ${nextDeparture ? `<div class="next-departure">Next: ${nextDeparture}</div>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for route info display if not already in the stylesheet
    if (!document.getElementById('route-styles')) {
        const style = document.createElement('style');
        style.id = 'route-styles';
        style.innerHTML = `
            .route-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
                border-left: 5px solid #666;
                overflow: hidden;
            }
            .route-header {
                display: flex;
                align-items: center;
                padding: 15px;
                color: white;
            }
            .route-icon {
                font-size: 1.5em;
                margin-right: 10px;
            }
            .route-name {
                font-size: 1.2em;
                font-weight: 600;
            }
            .route-details {
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            .route-stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            .route-stat {
                text-align: center;
            }
            .stat-label {
                font-size: 0.9em;
                color: #666;
                margin-bottom: 5px;
            }
            .stat-value {
                font-size: 1.1em;
                font-weight: 600;
            }
            .route-hours, .route-accessibility {
                margin-bottom: 10px;
                display: flex;
            }
            .hours-label, .accessibility-label {
                font-weight: 600;
                margin-right: 10px;
                min-width: 120px;
            }
            .accessible {
                color: #009933;
            }
            .not-accessible {
                color: #cc0033;
            }
            .route-stops {
                padding: 15px;
            }
            .route-stops h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .stops-list {
                max-height: 300px;
                overflow-y: auto;
            }
            .stop-item {
                display: flex;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .stop-item:last-child {
                border-bottom: none;
            }
            .stop-number {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                margin-right: 10px;
            }
            .stop-details {
                flex-grow: 1;
            }
            .stop-name {
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .next-departure {
                font-size: 0.9em;
                color: #666;
                margin-top: 3px;
            }
            .crowd-indicator {
                margin-left: 5px;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Update the vehicle display
 * @param {Array} vehicles - Array of vehicle objects
 */
function updateVehicleDisplay(vehicles) {
    const vehicleContainer = document.getElementById('vehicle-status');
    if (!vehicleContainer) return;
    
    // Create vehicle status card
    vehicleContainer.innerHTML = `
        <div class="vehicle-card">
            <h4>Vehicle Status (${vehicles.length})</h4>
            <div class="vehicle-list">
                ${vehicles.map(vehicle => {
                    // Get delay information
                    const delay = transportationManager.getVehicleDelay(vehicle.id);
                    
                    // Calculate occupancy percentage
                    const occupancyPercent = Math.round((vehicle.occupancy / vehicle.capacity) * 100);
                    
                    // Determine occupancy color
                    let occupancyColor;
                    if (occupancyPercent < 50) {
                        occupancyColor = '#009933'; // Green
                    } else if (occupancyPercent < 80) {
                        occupancyColor = '#ff9933'; // Orange
                    } else {
                        occupancyColor = '#cc0033'; // Red
                    }
                    
                    // Get current and next stop names
                    const currentStop = transportationManager.getStopById(vehicle.location.currentStop);
                    const nextStop = transportationManager.getStopById(vehicle.location.nextStop);
                    
                    return `
                        <div class="vehicle-item ${vehicle.status === 'out_of_service' ? 'out-of-service' : ''}">
                            <div class="vehicle-header">
                                <div class="vehicle-id">${vehicle.id}</div>
                                <div class="vehicle-status ${vehicle.status === 'out_of_service' ? 'status-out' : 'status-in'}">
                                    ${vehicle.status === 'out_of_service' ? 'Out of Service' : 'In Service'}
                                </div>
                            </div>
                            ${vehicle.status === 'in_service' ? `
                                <div class="vehicle-location">
                                    <div class="location-label">Location:</div>
                                    <div class="location-value">
                                        ${currentStop ? currentStop.name : 'Unknown'} → ${nextStop ? nextStop.name : 'Unknown'}
                                    </div>
                                </div>
                                <div class="vehicle-occupancy">
                                    <div class="occupancy-label">Occupancy:</div>
                                    <div class="occupancy-value">
                                        <div class="occupancy-bar">
                                            <div class="occupancy-fill" style="width: ${occupancyPercent}%; background-color: ${occupancyColor}"></div>
                                        </div>
                                        <div class="occupancy-text">${vehicle.occupancy}/${vehicle.capacity} (${occupancyPercent}%)</div>
                                    </div>
                                </div>
                                ${delay ? `
                                    <div class="vehicle-delay">
                                        <div class="delay-label">Delay:</div>
                                        <div class="delay-value">
                                            <span class="delay-minutes">${delay.minutes} min</span>
                                            <span class="delay-reason">${delay.reason}</span>
                                        </div>
                                    </div>
                                ` : ''}
                                <div class="vehicle-accessibility">
                                    <div class="accessibility-icons">
                                        ${vehicle.accessibility.wheelchair ? '<span title="Wheelchair accessible">♿</span>' : ''}
                                        ${vehicle.accessibility.visualAnnouncements ? '<span title="Visual announcements">👁️</span>' : ''}
                                        ${vehicle.accessibility.audioAnnouncements ? '<span title="Audio announcements">🔊</span>' : ''}
                                    </div>
                                </div>
                            ` : `
                                <div class="out-of-service-message">This vehicle is currently not in operation.</div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // Add CSS for vehicle display if not already in the stylesheet
    if (!document.getElementById('vehicle-styles')) {
        const style = document.createElement('style');
        style.id = 'vehicle-styles';
        style.innerHTML = `
            .vehicle-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .vehicle-card h4 {
                margin-top: 0;
                margin-bottom: 15px;
            }
            .vehicle-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
            }
            .vehicle-item {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 12px;
                border-left: 3px solid #0066CC;
            }
            .vehicle-item.out-of-service {
                border-left-color: #cc0033;
                opacity: 0.7;
            }
            .vehicle-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .vehicle-id {
                font-weight: 600;
            }
            .vehicle-status {
                font-size: 0.8em;
                padding: 3px 8px;
                border-radius: 4px;
            }
            .status-in {
                background-color: #e6f7e6;
                color: #009933;
            }
            .status-out {
                background-color: #ffebeb;
                color: #cc0033;
            }
            .vehicle-location, .vehicle-occupancy, .vehicle-delay {
                margin-bottom: 8px;
                display: flex;
            }
            .location-label, .occupancy-label, .delay-label {
                font-weight: 600;
                margin-right: 10px;
                min-width: 80px;
            }
            .location-value, .occupancy-value, .delay-value {
                flex-grow: 1;
            }
            .occupancy-bar {
                height: 8px;
                background-color: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            .occupancy-fill {
                height: 100%;
                border-radius: 4px;
            }
            .occupancy-text {
                font-size: 0.9em;
            }
            .delay-minutes {
                color: #cc0033;
                font-weight: 600;
                margin-right: 5px;
            }
            .delay-reason {
                font-size: 0.9em;
                color: #666;
            }
            .vehicle-accessibility {
                display: flex;
                justify-content: flex-end;
                margin-top: 5px;
            }
            .accessibility-icons {
                display: flex;
                gap: 5px;
            }
            .accessibility-icons span {
                font-size: 1.2em;
            }
            .out-of-service-message {
                color: #666;
                font-style: italic;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Update journey options based on toggles
 */
function updateJourneyOptions() {
    // This function would update any UI elements related to journey options
    // For now, we'll just log the current options
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const crowdedToggle = document.getElementById('avoid-crowded-toggle');
    
    const options = {
        preferAccessible: accessibilityToggle && accessibilityToggle.checked,
        avoidCrowded: crowdedToggle && crowdedToggle.checked
    };
    
    console.log('Journey options updated:', options);
}

/**
 * Plan a journey between two stops
 */
function planJourney() {
    // Get selected stops
    const startStopSelect = document.getElementById('journey-start');
    const endStopSelect = document.getElementById('journey-end');
    
    if (!startStopSelect || !endStopSelect) return;
    
    const startStopId = startStopSelect.value;
    const endStopId = endStopSelect.value;
    
    if (!startStopId || !endStopId) {
        // Show error message
        const journeyResultsContainer = document.getElementById('journey-results');
        if (journeyResultsContainer) {
            journeyResultsContainer.innerHTML = `
                <div class="journey-error">
                    Please select both start and destination locations.
                </div>
            `;
        }
        return;
    }
    
    // Get journey options
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const crowdedToggle = document.getElementById('avoid-crowded-toggle');
    
    const options = {
        preferAccessible: accessibilityToggle && accessibilityToggle.checked,
        avoidCrowded: crowdedToggle && crowdedToggle.checked,
        departureTime: new Date() // Current time
    };
    
    // Find optimal route
    const route = transportationManager.findOptimalRoute(startStopId, endStopId, options);
    
    // Display journey results
    displayJourneyResults(route);
}

/**
 * Display journey results
 * @param {Object} route - Route object returned by findOptimalRoute
 */
function displayJourneyResults(route) {
    const journeyResultsContainer = document.getElementById('journey-results');
    if (!journeyResultsContainer) return;
    
    if (!route.success) {
        // Show error message
        journeyResultsContainer.innerHTML = `
            <div class="journey-error">
                ${route.error || 'Unable to find a route between the selected locations.'}
            </div>
        `;
        return;
    }
    
    // Display journey results based on journey type
    if (route.journeyType === 'direct') {
        // Direct journey
        journeyResultsContainer.innerHTML = `
            <div class="journey-card">
                <div class="journey-header">
                    <div class="journey-title">Direct Route</div>
                    <div class="journey-time">${route.route.travelTime} min</div>
                </div>
                <div class="journey-route" style="border-left-color: ${route.route.routeColor}">
                    <div class="route-line" style="background-color: ${route.route.routeColor}"></div>
                    <div class="journey-stops">
                        <div class="journey-stop start">
                            <div class="stop-time">${route.route.departureTime}</div>
                            <div class="stop-name">${route.route.startStop}</div>
                        </div>
                        ${route.route.stops.length > 2 ? `
                            <div class="journey-stop intermediate">
                                <div class="stop-count">${route.route.stops.length - 2} stops</div>
                            </div>
                        ` : ''}
                        <div class="journey-stop end">
                            <div class="stop-time">${route.route.arrivalTime}</div>
                            <div class="stop-name">${route.route.endStop}</div>
                        </div>
                    </div>
                </div>
                <div class="journey-details">
                    <div class="journey-route-name">
                        <span class="route-badge" style="background-color: ${route.route.routeColor}">
                            ${route.route.routeName}
                        </span>
                    </div>
                    <div class="journey-info">
                        <div>Distance: ${route.route.distance.toFixed(1)} km</div>
                        <div>Accessibility: ${route.route.accessibility ? '♿ Accessible' : '⚠️ Limited accessibility'}</div>
                    </div>
                </div>
            </div>
        `;
    } else if (route.journeyType === 'transfer') {
        // Journey with transfer
        journeyResultsContainer.innerHTML = `
            <div class="journey-card">
                <div class="journey-header">
                    <div class="journey-title">Route with Transfer</div>
                    <div class="journey-time">${route.route.totalTravelTime} min</div>
                </div>
                ${route.route.segments.map((segment, index) => `
                    <div class="journey-route" style="border-left-color: ${segment.routeColor}">
                        <div class="route-line" style="background-color: ${segment.routeColor}"></div>
                        <div class="journey-stops">
                            <div class="journey-stop ${index === 0 ? 'start' : 'transfer'}">
                                <div class="stop-time">${segment.departureTime}</div>
                                <div class="stop-name">${segment.startStop}</div>
                            </div>
                            <div class="journey-stop ${index === route.route.segments.length - 1 ? 'end' : 'transfer'}">
                                <div class="stop-time">${segment.arrivalTime}</div>
                                <div class="stop-name">${segment.endStop}</div>
                            </div>
                        </div>
                    </div>
                    ${index < route.route.segments.length - 1 ? `
                        <div class="transfer-info">
                            <div class="transfer-icon">🔄</div>
                            <div class="transfer-text">Transfer (${route.route.transferTime} min)</div>
                        </div>
                    ` : ''}
                `).join('')}
                <div class="journey-details">
                    <div class="journey-route-name">
                        ${route.route.segments.map(segment => `
                            <span class="route-badge" style="background-color: ${segment.routeColor}">
                                ${segment.routeName}
                            </span>
                        `).join(' → ')}
                    </div>
                    <div class="journey-info">
                        <div>Total Distance: ${route.route.totalDistance.toFixed(1)} km</div>
                        <div>Accessibility: ${route.route.accessibility ? '♿ Accessible' : '⚠️ Limited accessibility'}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add CSS for journey results if not already in the stylesheet
    if (!document.getElementById('journey-styles')) {
        const style = document.createElement('style');
        style.id = 'journey-styles';
        style.innerHTML = `
            .journey-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                margin-bottom: 20px;
            }
            .journey-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .journey-title {
                font-weight: 600;
                font-size: 1.1em;
            }
            .journey-time {
                font-weight: 600;
                font-size: 1.2em;
                color: #0066CC;
            }
            .journey-route {
                position: relative;
                padding-left: 30px;
                margin-bottom: 15px;
                border-left: 3px solid #ccc;
            }
            .route-line {
                position: absolute;
                left: -3px;
                top: 0;
                bottom: 0;
                width: 3px;
            }
            .journey-stops {
                position: relative;
            }
            .journey-stop {
                padding: 10px 0;
                position: relative;
            }
            .journey-stop:before {
                content: '';
                position: absolute;
                left: -36px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: white;
                border: 3px solid #ccc;
            }
            .journey-stop.start:before {
                background-color: #009933;
                border-color: #009933;
            }
            .journey-stop.end:before {
                background-color: #cc0033;
                border-color: #cc0033;
            }
            .journey-stop.transfer:before {
                background-color: #ff9933;
                border-color: #ff9933;
            }
            .stop-time {
                font-weight: 600;
                margin-bottom: 5px;
            }
            .stop-name {
                color: #333;
            }
            .stop-count {
                color: #666;
                font-style: italic;
            }
            .transfer-info {
                display: flex;
                align-items: center;
                padding: 5px 0 5px 30px;
                margin-bottom: 15px;
                color: #666;
            }
            .transfer-icon {
                margin-right: 5px;
            }
            .journey-details {
                padding-top: 10px;
                border-top: 1px solid #eee;
            }
            .journey-route-name {
                margin-bottom: 10px;
            }
            .route-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                color: white;
                font-weight: 600;
                margin-right: 5px;
            }
            .journey-info {
                display: flex;
                justify-content: space-between;
                color: #666;
                font-size: 0.9em;
            }
            .journey-error {
                background-color: #ffebeb;
                color: #cc0033;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #cc0033;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update the map if the map function is available
    if (typeof showJourneyOnMap === 'function') {
        showJourneyOnMap(route);
    }
}

/**
 * Update vehicle markers on the map
 */
function updateVehicleMarkers() {
    // This function would update vehicle markers on the map
    // It would be called periodically to show vehicle movement
    
    // If the map function is available
    if (typeof updateVehiclesOnMap === 'function') {
        updateVehiclesOnMap(transportationManager.getAllVehicles());
    }
}

// Export functions for use in other modules
window.transportationManager = transportationManager;
window.initializeTransportationModule = initializeTransportationModule;
window.updateRouteDisplay = updateRouteDisplay;
window.planJourney = planJourney;