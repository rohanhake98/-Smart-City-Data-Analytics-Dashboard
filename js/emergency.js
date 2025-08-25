/**
 * Smart City Data Analytics Dashboard - Emergency Module
 * This file contains the implementation of the Emergency Response Coordinator
 */

// Emergency Response Manager class for incident management and resource allocation
class EmergencyManager {
    constructor() {
        this.incidents = [];
        this.resources = [];
        this.evacuationRoutes = [];
        this.riskZones = [];
        this.responseStats = {};
        this.initialized = false;
    }
    
    /**
     * Initialize the emergency manager with sample data
     */
    initialize() {
        if (this.initialized) return;
        
        // Load sample incidents
        this.loadSampleIncidents();
        
        // Load sample resources
        this.loadSampleResources();
        
        // Load sample evacuation routes
        this.loadSampleEvacuationRoutes();
        
        // Load sample risk zones
        this.loadSampleRiskZones();
        
        // Generate response statistics
        this.generateResponseStats();
        
        this.initialized = true;
        console.log('Emergency Manager initialized');
    }
    
    /**
     * Load sample incidents
     */
    loadSampleIncidents() {
        // Define incident types and severities
        const incidentTypes = ['fire', 'medical', 'police', 'traffic', 'weather', 'infrastructure'];
        const severityLevels = ['low', 'medium', 'high', 'critical'];
        const statusOptions = ['reported', 'responding', 'in_progress', 'resolved'];
        
        // Generate 10-15 random incidents
        const numIncidents = 10 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < numIncidents; i++) {
            // Generate random incident data
            const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
            const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            
            // Generate random location within city bounds
            const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
            const lng = -74.006 + (Math.random() - 0.5) * 0.1;
            
            // Generate random timestamp within the last 24 hours
            const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
            
            // Create incident object
            const incident = {
                id: `incident_${(i + 1).toString().padStart(3, '0')}`,
                type: incidentType,
                subtype: this.getIncidentSubtype(incidentType),
                severity: severity,
                status: status,
                location: {
                    lat: lat,
                    lng: lng,
                    address: this.generateRandomAddress()
                },
                timestamp: timestamp,
                description: this.generateIncidentDescription(incidentType),
                affectedArea: {
                    radius: 50 + Math.floor(Math.random() * 450), // 50-500 meters
                    impactLevel: Math.floor(Math.random() * 101) // 0-100%
                },
                assignedResources: [],
                updates: this.generateIncidentUpdates(status),
                estimatedResolutionTime: status === 'resolved' ? null : this.generateEstimatedResolutionTime(severity)
            };
            
            // Add incident to the list
            this.incidents.push(incident);
        }
        
        // Sort incidents by timestamp (newest first)
        this.incidents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    /**
     * Get incident subtype based on type
     * @param {string} type - Incident type
     * @returns {string} - Incident subtype
     */
    getIncidentSubtype(type) {
        const subtypes = {
            fire: ['building_fire', 'vehicle_fire', 'wildfire', 'hazmat', 'gas_leak'],
            medical: ['cardiac_arrest', 'trauma', 'respiratory', 'stroke', 'overdose'],
            police: ['theft', 'assault', 'vandalism', 'domestic_dispute', 'suspicious_activity'],
            traffic: ['collision', 'road_closure', 'traffic_signal_failure', 'congestion', 'roadwork'],
            weather: ['flooding', 'storm_damage', 'power_outage', 'fallen_tree', 'ice_hazard'],
            infrastructure: ['water_main_break', 'power_line_down', 'structural_damage', 'sinkhole', 'gas_leak']
        };
        
        const typeSubtypes = subtypes[type] || ['general'];
        return typeSubtypes[Math.floor(Math.random() * typeSubtypes.length)];
    }
    
    /**
     * Generate a random address
     * @returns {string} - Random address
     */
    generateRandomAddress() {
        const streets = ['Main St', 'Broadway', 'Park Ave', 'Oak St', 'Maple Ave', 'Washington Blvd', 'Cedar Ln', 'River Rd'];
        const streetNumber = Math.floor(Math.random() * 1000) + 1;
        const street = streets[Math.floor(Math.random() * streets.length)];
        return `${streetNumber} ${street}`;
    }
    
    /**
     * Generate incident description based on type
     * @param {string} type - Incident type
     * @returns {string} - Incident description
     */
    generateIncidentDescription(type) {
        const descriptions = {
            fire: [
                'Building fire reported with visible smoke.',
                'Vehicle fire in parking lot, no injuries reported.',
                'Small fire in residential kitchen.',
                'Smoke detected in commercial building.',
                'Possible gas leak with fire risk.'
            ],
            medical: [
                'Person experiencing chest pain, possible cardiac event.',
                'Elderly person fallen and unable to get up.',
                'Unconscious person reported at location.',
                'Multiple people with symptoms of food poisoning.',
                'Person with severe allergic reaction.'
            ],
            police: [
                'Suspicious activity reported by neighbors.',
                'Theft in progress at retail location.',
                'Vandalism reported at public property.',
                'Domestic dispute with loud shouting.',
                'Trespassing on private property.'
            ],
            traffic: [
                'Two-vehicle collision, unknown injuries.',
                'Vehicle struck pedestrian in crosswalk.',
                'Traffic signal malfunction causing congestion.',
                'Disabled vehicle blocking right lane.',
                'Multi-car accident on main thoroughfare.'
            ],
            weather: [
                'Flooding reported in low-lying area.',
                'Tree down blocking roadway.',
                'Power lines down due to high winds.',
                'Lightning strike caused small fire.',
                'Ice accumulation causing hazardous conditions.'
            ],
            infrastructure: [
                'Water main break flooding street.',
                'Power outage affecting multiple blocks.',
                'Sinkhole appeared in roadway.',
                'Building showing signs of structural damage.',
                'Gas leak detected in residential area.'
            ]
        };
        
        const typeDescriptions = descriptions[type] || ['Incident reported at location.'];
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    }
    
    /**
     * Generate incident updates based on status
     * @param {string} status - Incident status
     * @returns {Array} - Array of update objects
     */
    generateIncidentUpdates(status) {
        const updates = [];
        
        // Always add initial report
        updates.push({
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            status: 'reported',
            message: 'Incident reported to emergency services.'
        });
        
        // Add responding update if status is beyond reported
        if (status !== 'reported') {
            updates.push({
                timestamp: new Date(new Date(updates[0].timestamp).getTime() + 5 * 60 * 1000 + Math.random() * 10 * 60 * 1000).toISOString(),
                status: 'responding',
                message: 'Emergency units dispatched to the scene.'
            });
        }
        
        // Add in_progress update if status is beyond responding
        if (status === 'in_progress' || status === 'resolved') {
            updates.push({
                timestamp: new Date(new Date(updates[1].timestamp).getTime() + 5 * 60 * 1000 + Math.random() * 15 * 60 * 1000).toISOString(),
                status: 'in_progress',
                message: 'Emergency units on scene and addressing the incident.'
            });
        }
        
        // Add resolved update if status is resolved
        if (status === 'resolved') {
            updates.push({
                timestamp: new Date(new Date(updates[2].timestamp).getTime() + 15 * 60 * 1000 + Math.random() * 60 * 60 * 1000).toISOString(),
                status: 'resolved',
                message: 'Incident has been resolved. Units clearing the scene.'
            });
        }
        
        return updates;
    }
    
    /**
     * Generate estimated resolution time based on severity
     * @param {string} severity - Incident severity
     * @returns {string} - ISO timestamp for estimated resolution
     */
    generateEstimatedResolutionTime(severity) {
        let resolutionMinutes;
        
        switch (severity) {
            case 'low':
                resolutionMinutes = 30 + Math.floor(Math.random() * 30); // 30-60 minutes
                break;
            case 'medium':
                resolutionMinutes = 60 + Math.floor(Math.random() * 60); // 60-120 minutes
                break;
            case 'high':
                resolutionMinutes = 120 + Math.floor(Math.random() * 120); // 2-4 hours
                break;
            case 'critical':
                resolutionMinutes = 240 + Math.floor(Math.random() * 240); // 4-8 hours
                break;
            default:
                resolutionMinutes = 60 + Math.floor(Math.random() * 60); // 1-2 hours
        }
        
        return new Date(Date.now() + resolutionMinutes * 60 * 1000).toISOString();
    }
    
    /**
     * Load sample emergency resources
     */
    loadSampleResources() {
        // Define resource types
        const resourceTypes = ['fire_truck', 'ambulance', 'police_car', 'hazmat_unit', 'utility_vehicle'];
        
        // Generate 20-30 random resources
        const numResources = 20 + Math.floor(Math.random() * 11);
        
        for (let i = 0; i < numResources; i++) {
            // Generate random resource data
            const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
            
            // Generate random location within city bounds
            const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
            const lng = -74.006 + (Math.random() - 0.5) * 0.1;
            
            // Determine status (70% available, 30% busy)
            const status = Math.random() < 0.7 ? 'available' : 'busy';
            
            // Create resource object
            const resource = {
                id: `${resourceType}_${(i + 1).toString().padStart(3, '0')}`,
                type: resourceType,
                name: this.generateResourceName(resourceType, i),
                status: status,
                location: {
                    lat: lat,
                    lng: lng,
                    address: status === 'busy' ? this.generateRandomAddress() : this.generateStationAddress(resourceType)
                },
                capabilities: this.generateResourceCapabilities(resourceType),
                personnel: this.generateResourcePersonnel(resourceType),
                lastUpdated: new Date().toISOString()
            };
            
            // If resource is busy, assign it to a random incident
            if (status === 'busy' && this.incidents.length > 0) {
                const activeIncidents = this.incidents.filter(incident => incident.status !== 'resolved');
                if (activeIncidents.length > 0) {
                    const randomIncident = activeIncidents[Math.floor(Math.random() * activeIncidents.length)];
                    resource.assignedIncidentId = randomIncident.id;
                    randomIncident.assignedResources.push(resource.id);
                }
            }
            
            // Add resource to the list
            this.resources.push(resource);
        }
    }
    
    /**
     * Generate resource name based on type and index
     * @param {string} type - Resource type
     * @param {number} index - Resource index
     * @returns {string} - Resource name
     */
    generateResourceName(type, index) {
        switch (type) {
            case 'fire_truck':
                return `Engine ${index % 10 + 1}`;
            case 'ambulance':
                return `Medic ${index % 10 + 1}`;
            case 'police_car':
                return `Unit ${(index % 10 + 1) * 10}`;
            case 'hazmat_unit':
                return `HazMat ${index % 5 + 1}`;
            case 'utility_vehicle':
                return `Utility ${index % 5 + 1}`;
            default:
                return `Resource ${index + 1}`;
        }
    }
    
    /**
     * Generate station address based on resource type
     * @param {string} type - Resource type
     * @returns {string} - Station address
     */
    generateStationAddress(type) {
        const stations = {
            fire_truck: ['123 Fire Station Rd', '456 Emergency Ave', '789 Rescue St'],
            ambulance: ['123 Hospital Dr', '456 Medical Center Blvd', '789 Emergency Care Ln'],
            police_car: ['123 Police HQ', '456 Precinct Ave', '789 Law Enforcement Blvd'],
            hazmat_unit: ['123 HazMat Center', '456 Special Operations Facility', '789 Emergency Response HQ'],
            utility_vehicle: ['123 Utility Depot', '456 Public Works Facility', '789 City Maintenance Yard']
        };
        
        const typeStations = stations[type] || ['123 Emergency Services Rd'];
        return typeStations[Math.floor(Math.random() * typeStations.length)];
    }
    
    /**
     * Generate resource capabilities based on type
     * @param {string} type - Resource type
     * @returns {Array} - Array of capability strings
     */
    generateResourceCapabilities(type) {
        const capabilities = {
            fire_truck: ['water_pump', 'ladder', 'fire_suppression', 'rescue_equipment'],
            ambulance: ['basic_life_support', 'advanced_life_support', 'patient_transport'],
            police_car: ['patrol', 'pursuit', 'crowd_control', 'investigation'],
            hazmat_unit: ['chemical_containment', 'decontamination', 'air_monitoring', 'specialized_suits'],
            utility_vehicle: ['power_restoration', 'water_management', 'debris_removal', 'road_repair']
        };
        
        const typeCapabilities = capabilities[type] || ['general_emergency_response'];
        
        // Return 2-4 random capabilities from the list
        const numCapabilities = 2 + Math.floor(Math.random() * 3);
        const shuffled = [...typeCapabilities].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(numCapabilities, typeCapabilities.length));
    }
    
    /**
     * Generate resource personnel based on type
     * @param {string} type - Resource type
     * @returns {number} - Number of personnel
     */
    generateResourcePersonnel(type) {
        switch (type) {
            case 'fire_truck':
                return 4 + Math.floor(Math.random() * 3); // 4-6 personnel
            case 'ambulance':
                return 2 + Math.floor(Math.random() * 2); // 2-3 personnel
            case 'police_car':
                return 1 + Math.floor(Math.random() * 2); // 1-2 personnel
            case 'hazmat_unit':
                return 3 + Math.floor(Math.random() * 3); // 3-5 personnel
            case 'utility_vehicle':
                return 2 + Math.floor(Math.random() * 3); // 2-4 personnel
            default:
                return 2 + Math.floor(Math.random() * 3); // 2-4 personnel
        }
    }
    
    /**
     * Load sample evacuation routes
     */
    loadSampleEvacuationRoutes() {
        // Generate 3-5 evacuation routes
        const numRoutes = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numRoutes; i++) {
            // Generate random route data
            const routeId = `evac_route_${(i + 1).toString().padStart(3, '0')}`;
            
            // Generate random start and end points
            const startLat = 40.7128 + (Math.random() - 0.5) * 0.05;
            const startLng = -74.006 + (Math.random() - 0.5) * 0.05;
            const endLat = 40.7128 + (Math.random() - 0.5) * 0.1;
            const endLng = -74.006 + (Math.random() - 0.5) * 0.1;
            
            // Generate 3-6 waypoints for the route
            const numWaypoints = 3 + Math.floor(Math.random() * 4);
            const waypoints = [];
            
            for (let j = 0; j < numWaypoints; j++) {
                // Interpolate between start and end points
                const progress = (j + 1) / (numWaypoints + 1);
                const waypointLat = startLat + (endLat - startLat) * progress + (Math.random() - 0.5) * 0.02;
                const waypointLng = startLng + (endLng - startLng) * progress + (Math.random() - 0.5) * 0.02;
                
                waypoints.push({
                    lat: waypointLat,
                    lng: waypointLng,
                    name: this.generateRandomAddress()
                });
            }
            
            // Create route object
            const route = {
                id: routeId,
                name: `Evacuation Route ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
                type: Math.random() > 0.5 ? 'primary' : 'secondary',
                status: Math.random() > 0.2 ? 'open' : 'restricted',
                startPoint: {
                    lat: startLat,
                    lng: startLng,
                    name: this.generateRandomAddress()
                },
                endPoint: {
                    lat: endLat,
                    lng: endLng,
                    name: this.generateRandomAddress()
                },
                waypoints: waypoints,
                estimatedTravelTime: 15 + Math.floor(Math.random() * 46), // 15-60 minutes
                lastUpdated: new Date().toISOString()
            };
            
            // Add route to the list
            this.evacuationRoutes.push(route);
        }
    }
    
    /**
     * Load sample risk zones
     */
    loadSampleRiskZones() {
        // Define risk zone types
        const zoneTypes = ['flood', 'fire', 'chemical', 'structural', 'weather'];
        
        // Generate 3-7 risk zones
        const numZones = 3 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numZones; i++) {
            // Generate random zone data
            const zoneType = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
            
            // Generate random center point
            const centerLat = 40.7128 + (Math.random() - 0.5) * 0.1;
            const centerLng = -74.006 + (Math.random() - 0.5) * 0.1;
            
            // Generate random radius (100-1000 meters)
            const radius = 100 + Math.floor(Math.random() * 901);
            
            // Generate random risk level (1-5)
            const riskLevel = 1 + Math.floor(Math.random() * 5);
            
            // Create zone object
            const zone = {
                id: `risk_zone_${(i + 1).toString().padStart(3, '0')}`,
                type: zoneType,
                name: this.generateZoneName(zoneType, i),
                center: {
                    lat: centerLat,
                    lng: centerLng
                },
                radius: radius,
                riskLevel: riskLevel,
                description: this.generateZoneDescription(zoneType, riskLevel),
                affectedPopulation: Math.floor(radius * radius * Math.PI * 0.0001 * (0.5 + Math.random())), // Rough estimate
                evacuationRequired: riskLevel >= 4,
                lastUpdated: new Date().toISOString()
            };
            
            // Add zone to the list
            this.riskZones.push(zone);
        }
    }
    
    /**
     * Generate zone name based on type and index
     * @param {string} type - Zone type
     * @param {number} index - Zone index
     * @returns {string} - Zone name
     */
    generateZoneName(type, index) {
        switch (type) {
            case 'flood':
                return `Flood Risk Zone ${index + 1}`;
            case 'fire':
                return `Fire Hazard Area ${index + 1}`;
            case 'chemical':
                return `Chemical Exposure Zone ${index + 1}`;
            case 'structural':
                return `Structural Risk Area ${index + 1}`;
            case 'weather':
                return `Severe Weather Impact Zone ${index + 1}`;
            default:
                return `Risk Zone ${index + 1}`;
        }
    }
    
    /**
     * Generate zone description based on type and risk level
     * @param {string} type - Zone type
     * @param {number} riskLevel - Risk level (1-5)
     * @returns {string} - Zone description
     */
    generateZoneDescription(type, riskLevel) {
        const riskDescriptions = {
            1: 'Low risk with minimal impact expected.',
            2: 'Moderate risk with potential for limited impact.',
            3: 'Significant risk with moderate impact expected.',
            4: 'High risk with substantial impact expected. Evacuation recommended.',
            5: 'Severe risk with major impact expected. Immediate evacuation required.'
        };
        
        const typeDescriptions = {
            flood: [
                'Area prone to flooding due to heavy rainfall.',
                'Low-lying area near water bodies with flood potential.',
                'Urban flooding risk due to drainage issues.',
                'Flash flood risk area with rapid water accumulation potential.',
                'Major flood plain with history of significant flooding events.'
            ],
            fire: [
                'Area with dry vegetation and fire risk.',
                'Urban-wildland interface with potential fire spread.',
                'Zone with limited fire hydrant access.',
                'Area with history of fire incidents.',
                'High-density area with significant fire load.'
            ],
            chemical: [
                'Proximity to industrial facilities with chemical storage.',
                'Potential chemical exposure from transportation routes.',
                'Area downwind from chemical processing facilities.',
                'Zone with history of chemical incidents.',
                'High-risk area for hazardous material exposure.'
            ],
            structural: [
                'Area with aging infrastructure.',
                'Zone with buildings susceptible to damage.',
                'Area with history of structural failures.',
                'High-density area with interconnected structural risks.',
                'Zone with critical infrastructure vulnerabilities.'
            ],
            weather: [
                'Area prone to high winds.',
                'Zone susceptible to lightning strikes.',
                'Area with history of weather-related damage.',
                'Coastal area with storm surge potential.',
                'Zone with extreme weather vulnerability.'
            ]
        };
        
        const riskDescription = riskDescriptions[riskLevel] || 'Risk level undetermined.';
        const typeDescription = typeDescriptions[type] ? typeDescriptions[type][riskLevel - 1] : 'Area with potential hazards.';
        
        return `${typeDescription} ${riskDescription}`;
    }
    
    /**
     * Generate response statistics
     */
    generateResponseStats() {
        // Calculate average response times by incident type
        const responseTimesByType = {};
        const resolutionTimesByType = {};
        const incidentCountsByType = {};
        const severityCounts = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0
        };
        
        // Process incidents to calculate statistics
        this.incidents.forEach(incident => {
            // Count by severity
            if (severityCounts.hasOwnProperty(incident.severity)) {
                severityCounts[incident.severity]++;
            }
            
            // Count by type
            if (!incidentCountsByType[incident.type]) {
                incidentCountsByType[incident.type] = 0;
            }
            incidentCountsByType[incident.type]++;
            
            // Calculate response time if available
            if (incident.updates.length >= 2) {
                const reportTime = new Date(incident.updates[0].timestamp);
                const responseTime = new Date(incident.updates[1].timestamp);
                const responseMinutes = (responseTime - reportTime) / (60 * 1000);
                
                if (!responseTimesByType[incident.type]) {
                    responseTimesByType[incident.type] = [];
                }
                responseTimesByType[incident.type].push(responseMinutes);
            }
            
            // Calculate resolution time if resolved
            if (incident.status === 'resolved' && incident.updates.length >= 2) {
                const reportTime = new Date(incident.updates[0].timestamp);
                const resolveTime = new Date(incident.updates[incident.updates.length - 1].timestamp);
                const resolutionMinutes = (resolveTime - reportTime) / (60 * 1000);
                
                if (!resolutionTimesByType[incident.type]) {
                    resolutionTimesByType[incident.type] = [];
                }
                resolutionTimesByType[incident.type].push(resolutionMinutes);
            }
        });
        
        // Calculate averages
        const avgResponseTimes = {};
        Object.keys(responseTimesByType).forEach(type => {
            const times = responseTimesByType[type];
            avgResponseTimes[type] = times.reduce((sum, time) => sum + time, 0) / times.length;
        });
        
        const avgResolutionTimes = {};
        Object.keys(resolutionTimesByType).forEach(type => {
            const times = resolutionTimesByType[type];
            avgResolutionTimes[type] = times.reduce((sum, time) => sum + time, 0) / times.length;
        });
        
        // Calculate resource utilization
        const resourceUtilization = {};
        const resourceTypes = ['fire_truck', 'ambulance', 'police_car', 'hazmat_unit', 'utility_vehicle'];
        
        resourceTypes.forEach(type => {
            const totalResources = this.resources.filter(r => r.type === type).length;
            const busyResources = this.resources.filter(r => r.type === type && r.status === 'busy').length;
            resourceUtilization[type] = totalResources > 0 ? (busyResources / totalResources) * 100 : 0;
        });
        
        // Store statistics
        this.responseStats = {
            incidentCounts: {
                total: this.incidents.length,
                byType: incidentCountsByType,
                bySeverity: severityCounts,
                active: this.incidents.filter(i => i.status !== 'resolved').length,
                resolved: this.incidents.filter(i => i.status === 'resolved').length
            },
            responseTimes: {
                overall: Object.values(avgResponseTimes).reduce((sum, time) => sum + time, 0) / Object.values(avgResponseTimes).length || 0,
                byType: avgResponseTimes
            },
            resolutionTimes: {
                overall: Object.values(avgResolutionTimes).reduce((sum, time) => sum + time, 0) / Object.values(avgResolutionTimes).length || 0,
                byType: avgResolutionTimes
            },
            resourceUtilization: resourceUtilization,
            lastUpdated: new Date().toISOString()
        };
    }
    
    /**
     * Get all incidents
     * @param {Object} filters - Optional filters for incidents
     * @returns {Array} - Array of incident objects
     */
    getAllIncidents(filters = {}) {
        let filteredIncidents = [...this.incidents];
        
        // Apply type filter
        if (filters.type) {
            filteredIncidents = filteredIncidents.filter(incident => incident.type === filters.type);
        }
        
        // Apply severity filter
        if (filters.severity) {
            filteredIncidents = filteredIncidents.filter(incident => incident.severity === filters.severity);
        }
        
        // Apply status filter
        if (filters.status) {
            filteredIncidents = filteredIncidents.filter(incident => incident.status === filters.status);
        }
        
        // Apply time range filter
        if (filters.timeRange) {
            const now = new Date();
            let startTime;
            
            switch (filters.timeRange) {
                case '1h':
                    startTime = new Date(now.getTime() - 60 * 60 * 1000);
                    break;
                case '6h':
                    startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
                    break;
                case '24h':
                    startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startTime = new Date(0); // Beginning of time
            }
            
            filteredIncidents = filteredIncidents.filter(incident => new Date(incident.timestamp) >= startTime);
        }
        
        return filteredIncidents;
    }
    
    /**
     * Get incident by ID
     * @param {string} incidentId - Incident ID
     * @returns {Object|null} - Incident object or null if not found
     */
    getIncidentById(incidentId) {
        return this.incidents.find(incident => incident.id === incidentId) || null;
    }
    
    /**
     * Get all resources
     * @param {Object} filters - Optional filters for resources
     * @returns {Array} - Array of resource objects
     */
    getAllResources(filters = {}) {
        let filteredResources = [...this.resources];
        
        // Apply type filter
        if (filters.type) {
            filteredResources = filteredResources.filter(resource => resource.type === filters.type);
        }
        
        // Apply status filter
        if (filters.status) {
            filteredResources = filteredResources.filter(resource => resource.status === filters.status);
        }
        
        // Apply capability filter
        if (filters.capability) {
            filteredResources = filteredResources.filter(resource => 
                resource.capabilities.includes(filters.capability)
            );
        }
        
        return filteredResources;
    }
    
    /**
     * Get resource by ID
     * @param {string} resourceId - Resource ID
     * @returns {Object|null} - Resource object or null if not found
     */
    getResourceById(resourceId) {
        return this.resources.find(resource => resource.id === resourceId) || null;
    }
    
    /**
     * Get all evacuation routes
     * @returns {Array} - Array of evacuation route objects
     */
    getAllEvacuationRoutes() {
        return this.evacuationRoutes;
    }
    
    /**
     * Get evacuation route by ID
     * @param {string} routeId - Route ID
     * @returns {Object|null} - Route object or null if not found
     */
    getEvacuationRouteById(routeId) {
        return this.evacuationRoutes.find(route => route.id === routeId) || null;
    }
    
    /**
     * Get all risk zones
     * @param {Object} filters - Optional filters for risk zones
     * @returns {Array} - Array of risk zone objects
     */
    getAllRiskZones(filters = {}) {
        let filteredZones = [...this.riskZones];
        
        // Apply type filter
        if (filters.type) {
            filteredZones = filteredZones.filter(zone => zone.type === filters.type);
        }
        
        // Apply minimum risk level filter
        if (filters.minRiskLevel) {
            filteredZones = filteredZones.filter(zone => zone.riskLevel >= filters.minRiskLevel);
        }
        
        // Apply evacuation required filter
        if (filters.evacuationRequired !== undefined) {
            filteredZones = filteredZones.filter(zone => zone.evacuationRequired === filters.evacuationRequired);
        }
        
        return filteredZones;
    }
    
    /**
     * Get risk zone by ID
     * @param {string} zoneId - Zone ID
     * @returns {Object|null} - Zone object or null if not found
     */
    getRiskZoneById(zoneId) {
        return this.riskZones.find(zone => zone.id === zoneId) || null;
    }
    
    /**
     * Get response statistics
     * @returns {Object} - Response statistics object
     */
    getResponseStats() {
        return this.responseStats;
    }
    
    /**
     * Find optimal resource allocation for an incident
     * @param {string} incidentId - Incident ID
     * @returns {Array} - Array of recommended resource IDs
     */
    findOptimalResourceAllocation(incidentId) {
        const incident = this.getIncidentById(incidentId);
        if (!incident) return [];
        
        // Determine required resource types based on incident type and severity
        const requiredResourceTypes = this.determineRequiredResourceTypes(incident);
        
        // Find available resources of required types
        const availableResources = this.resources.filter(resource => 
            requiredResourceTypes.includes(resource.type) && 
            resource.status === 'available'
        );
        
        // Sort resources by distance to incident (in a real application)
        // For this demo, we'll just select the first available resources of each type
        const recommendedResources = [];
        
        requiredResourceTypes.forEach(type => {
            const resourcesOfType = availableResources.filter(resource => resource.type === type);
            if (resourcesOfType.length > 0) {
                recommendedResources.push(resourcesOfType[0].id);
            }
        });
        
        return recommendedResources;
    }
    
    /**
     * Determine required resource types based on incident
     * @param {Object} incident - Incident object
     * @returns {Array} - Array of required resource types
     */
    determineRequiredResourceTypes(incident) {
        const requiredTypes = [];
        
        // Determine base resource types by incident type
        switch (incident.type) {
            case 'fire':
                requiredTypes.push('fire_truck');
                if (incident.severity === 'high' || incident.severity === 'critical') {
                    requiredTypes.push('ambulance');
                }
                if (incident.subtype === 'hazmat' || incident.subtype === 'gas_leak') {
                    requiredTypes.push('hazmat_unit');
                }
                break;
            case 'medical':
                requiredTypes.push('ambulance');
                if (incident.severity === 'critical') {
                    // Add a second ambulance for critical cases
                    requiredTypes.push('ambulance');
                }
                break;
            case 'police':
                requiredTypes.push('police_car');
                if (incident.severity === 'high' || incident.severity === 'critical') {
                    // Add a second police unit for serious cases
                    requiredTypes.push('police_car');
                }
                break;
            case 'traffic':
                requiredTypes.push('police_car');
                if (incident.subtype === 'collision') {
                    requiredTypes.push('ambulance');
                }
                break;
            case 'weather':
                if (incident.subtype === 'flooding' || incident.subtype === 'fallen_tree') {
                    requiredTypes.push('utility_vehicle');
                }
                if (incident.severity === 'high' || incident.severity === 'critical') {
                    requiredTypes.push('fire_truck');
                }
                break;
            case 'infrastructure':
                requiredTypes.push('utility_vehicle');
                if (incident.subtype === 'gas_leak' || incident.subtype === 'structural_damage') {
                    requiredTypes.push('fire_truck');
                }
                if (incident.subtype === 'power_line_down') {
                    requiredTypes.push('police_car');
                }
                break;
            default:
                requiredTypes.push('police_car'); // Default response
        }
        
        return requiredTypes;
    }
    
    /**
     * Find evacuation route for a location
     * @param {Object} location - Location object with lat and lng
     * @returns {Object|null} - Recommended evacuation route or null if none found
     */
    findEvacuationRoute(location) {
        if (!location || !location.lat || !location.lng) return null;
        
        // Find open evacuation routes
        const openRoutes = this.evacuationRoutes.filter(route => route.status === 'open');
        if (openRoutes.length === 0) return null;
        
        // Find nearest route (in a real application, this would use actual routing algorithms)
        // For this demo, we'll find the route with the nearest start point
        let nearestRoute = null;
        let shortestDistance = Infinity;
        
        openRoutes.forEach(route => {
            const distance = this.calculateDistance(
                location.lat, location.lng,
                route.startPoint.lat, route.startPoint.lng
            );
            
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestRoute = route;
            }
        });
        
        return nearestRoute;
    }
    
    /**
     * Calculate distance between two points using Haversine formula
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lng1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lng2 - Longitude of point 2
     * @returns {number} - Distance in kilometers
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        return distance;
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
     * Add a new incident
     * @param {Object} incidentData - Incident data
     * @returns {Object} - Created incident object
     */
    addIncident(incidentData) {
        // Generate ID
        const incidentId = `incident_${(this.incidents.length + 1).toString().padStart(3, '0')}`;
        
        // Create incident object
        const incident = {
            id: incidentId,
            type: incidentData.type || 'other',
            subtype: incidentData.subtype || this.getIncidentSubtype(incidentData.type || 'other'),
            severity: incidentData.severity || 'medium',
            status: 'reported',
            location: incidentData.location || {
                lat: 40.7128,
                lng: -74.006,
                address: incidentData.address || 'Unknown location'
            },
            timestamp: new Date().toISOString(),
            description: incidentData.description || this.generateIncidentDescription(incidentData.type || 'other'),
            affectedArea: incidentData.affectedArea || {
                radius: 100,
                impactLevel: 50
            },
            assignedResources: [],
            updates: [
                {
                    timestamp: new Date().toISOString(),
                    status: 'reported',
                    message: 'Incident reported to emergency services.'
                }
            ],
            estimatedResolutionTime: this.generateEstimatedResolutionTime(incidentData.severity || 'medium')
        };
        
        // Add incident to the list
        this.incidents.push(incident);
        
        // Update statistics
        this.generateResponseStats();
        
        return incident;
    }
    
    /**
     * Update incident status
     * @param {string} incidentId - Incident ID
     * @param {string} status - New status
     * @param {string} message - Update message
     * @returns {Object|null} - Updated incident or null if not found
     */
    updateIncidentStatus(incidentId, status, message) {
        const incident = this.getIncidentById(incidentId);
        if (!incident) return null;
        
        // Update status
        incident.status = status;
        
        // Add update
        incident.updates.push({
            timestamp: new Date().toISOString(),
            status: status,
            message: message || `Incident status updated to ${status}.`
        });
        
        // If resolved, clear estimated resolution time
        if (status === 'resolved') {
            incident.estimatedResolutionTime = null;
        }
        
        // Update statistics
        this.generateResponseStats();
        
        return incident;
    }
    
    /**
     * Assign resources to an incident
     * @param {string} incidentId - Incident ID
     * @param {Array} resourceIds - Array of resource IDs
     * @returns {Object|null} - Updated incident or null if not found
     */
    assignResourcesToIncident(incidentId, resourceIds) {
        const incident = this.getIncidentById(incidentId);
        if (!incident) return null;
        
        // Update incident
        incident.assignedResources = [...new Set([...incident.assignedResources, ...resourceIds])];
        
        // Update resources
        resourceIds.forEach(resourceId => {
            const resource = this.getResourceById(resourceId);
            if (resource) {
                resource.status = 'busy';
                resource.assignedIncidentId = incidentId;
            }
        });
        
        // Add update
        incident.updates.push({
            timestamp: new Date().toISOString(),
            status: incident.status,
            message: `Resources assigned to incident: ${resourceIds.join(', ')}.`
        });
        
        // Update statistics
        this.generateResponseStats();
        
        return incident;
    }
    
    /**
     * Release resources from an incident
     * @param {string} incidentId - Incident ID
     * @param {Array} resourceIds - Array of resource IDs
     * @returns {Object|null} - Updated incident or null if not found
     */
    releaseResourcesFromIncident(incidentId, resourceIds) {
        const incident = this.getIncidentById(incidentId);
        if (!incident) return null;
        
        // Update incident
        incident.assignedResources = incident.assignedResources.filter(id => !resourceIds.includes(id));
        
        // Update resources
        resourceIds.forEach(resourceId => {
            const resource = this.getResourceById(resourceId);
            if (resource && resource.assignedIncidentId === incidentId) {
                resource.status = 'available';
                resource.assignedIncidentId = null;
            }
        });
        
        // Add update
        incident.updates.push({
            timestamp: new Date().toISOString(),
            status: incident.status,
            message: `Resources released from incident: ${resourceIds.join(', ')}.`
        });
        
        // Update statistics
        this.generateResponseStats();
        
        return incident;
    }
}

// Create a global instance of the emergency manager
const emergencyManager = new EmergencyManager();

// Initialize the emergency module when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEmergencyModule();
});

/**
 * Initialize the emergency module
 */
function initializeEmergencyModule() {
    // Initialize the emergency manager
    emergencyManager.initialize();
    
    // Set up event listeners
    setupEmergencyEventListeners();
    
    // Load initial emergency data
    loadEmergencyData();
    
    console.log('Emergency module initialized');
}

/**
 * Set up event listeners for emergency module
 */
function setupEmergencyEventListeners() {
    // Incident type filter
    const incidentTypeFilter = document.getElementById('incident-type-filter');
    if (incidentTypeFilter) {
        incidentTypeFilter.addEventListener('change', function() {
            updateIncidentList();
        });
    }
    
    // Incident severity filter
    const incidentSeverityFilter = document.getElementById('incident-severity-filter');
    if (incidentSeverityFilter) {
        incidentSeverityFilter.addEventListener('change', function() {
            updateIncidentList();
        });
    }
    
    // Incident status filter
    const incidentStatusFilter = document.getElementById('incident-status-filter');
    if (incidentStatusFilter) {
        incidentStatusFilter.addEventListener('change', function() {
            updateIncidentList();
        });
    }
    
    // Incident time range filter
    const incidentTimeFilter = document.getElementById('incident-time-filter');
    if (incidentTimeFilter) {
        incidentTimeFilter.addEventListener('change', function() {
            updateIncidentList();
        });
    }
    
    // Resource type filter
    const resourceTypeFilter = document.getElementById('resource-type-filter');
    if (resourceTypeFilter) {
        resourceTypeFilter.addEventListener('change', function() {
            updateResourceList();
        });
    }
    
    // Resource status filter
    const resourceStatusFilter = document.getElementById('resource-status-filter');
    if (resourceStatusFilter) {
        resourceStatusFilter.addEventListener('change', function() {
            updateResourceList();
        });
    }
    
    // Risk zone type filter
    const riskZoneTypeFilter = document.getElementById('risk-zone-type-filter');
    if (riskZoneTypeFilter) {
        riskZoneTypeFilter.addEventListener('change', function() {
            updateRiskZoneList();
        });
    }
    
    // Risk level filter
    const riskLevelFilter = document.getElementById('risk-level-filter');
    if (riskLevelFilter) {
        riskLevelFilter.addEventListener('change', function() {
            updateRiskZoneList();
        });
    }
    
    // Report incident form
    const reportIncidentForm = document.getElementById('report-incident-form');
    if (reportIncidentForm) {
        reportIncidentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            reportIncident();
        });
    }
    
    // Find evacuation route form
    const evacuationRouteForm = document.getElementById('evacuation-route-form');
    if (evacuationRouteForm) {
        evacuationRouteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            findEvacuationRoute();
        });
    }
}

/**
 * Load emergency data and update the UI
 */
function loadEmergencyData() {
    // Update incident list
    updateIncidentList();
    
    // Update resource list
    updateResourceList();
    
    // Update risk zone list
    updateRiskZoneList();
    
    // Update response statistics
    updateResponseStats();
    
    // Update the map if the map function is available
    if (typeof switchMapLayer === 'function') {
        switchMapLayer('emergency');
    }
}

/**
 * Update the incident list based on filters
 */
function updateIncidentList() {
    // Get filter values
    const typeFilter = document.getElementById('incident-type-filter');
    const severityFilter = document.getElementById('incident-severity-filter');
    const statusFilter = document.getElementById('incident-status-filter');
    const timeFilter = document.getElementById('incident-time-filter');
    
    const filters = {
        type: typeFilter && typeFilter.value !== 'all' ? typeFilter.value : null,
        severity: severityFilter && severityFilter.value !== 'all' ? severityFilter.value : null,
        status: statusFilter && statusFilter.value !== 'all' ? statusFilter.value : null,
        timeRange: timeFilter && timeFilter.value !== 'all' ? timeFilter.value : null
    };
    
    // Get filtered incidents
    const incidents = emergencyManager.getAllIncidents(filters);
    
    // Update incident list in UI
    const incidentListContainer = document.getElementById('incident-list');
    if (!incidentListContainer) return;
    
    // Clear existing content
    incidentListContainer.innerHTML = '';
    
    // Add incidents to the list
    if (incidents.length === 0) {
        incidentListContainer.innerHTML = '<div class="no-data">No incidents match the selected filters.</div>';
    } else {
        incidents.forEach(incident => {
            // Create incident card
            const incidentCard = document.createElement('div');
            incidentCard.className = `incident-card ${incident.severity} ${incident.status}`;
            incidentCard.setAttribute('data-incident-id', incident.id);
            
            // Determine icon based on type
            let typeIcon;
            switch (incident.type) {
                case 'fire': typeIcon = '🔥'; break;
                case 'medical': typeIcon = '🚑'; break;
                case 'police': typeIcon = '👮'; break;
                case 'traffic': typeIcon = '🚗'; break;
                case 'weather': typeIcon = '⛈️'; break;
                case 'infrastructure': typeIcon = '🏗️'; break;
                default: typeIcon = '⚠️';
            }
            
            // Format timestamp
            const timestamp = new Date(incident.timestamp);
            const formattedTime = timestamp.toLocaleString();
            
            // Determine status badge
            let statusBadge;
            switch (incident.status) {
                case 'reported': statusBadge = '<span class="status-badge reported">Reported</span>'; break;
                case 'responding': statusBadge = '<span class="status-badge responding">Responding</span>'; break;
                case 'in_progress': statusBadge = '<span class="status-badge in-progress">In Progress</span>'; break;
                case 'resolved': statusBadge = '<span class="status-badge resolved">Resolved</span>'; break;
                default: statusBadge = '<span class="status-badge">Unknown</span>';
            }
            
            // Determine severity badge
            let severityBadge;
            switch (incident.severity) {
                case 'low': severityBadge = '<span class="severity-badge low">Low</span>'; break;
                case 'medium': severityBadge = '<span class="severity-badge medium">Medium</span>'; break;
                case 'high': severityBadge = '<span class="severity-badge high">High</span>'; break;
                case 'critical': severityBadge = '<span class="severity-badge critical">Critical</span>'; break;
                default: severityBadge = '<span class="severity-badge">Unknown</span>';
            }
            
            // Build card content
            incidentCard.innerHTML = `
                <div class="incident-header">
                    <div class="incident-type">
                        <span class="type-icon">${typeIcon}</span>
                        <span class="type-name">${incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}</span>
                    </div>
                    <div class="incident-badges">
                        ${statusBadge}
                        ${severityBadge}
                    </div>
                </div>
                <div class="incident-body">
                    <div class="incident-description">${incident.description}</div>
                    <div class="incident-location">
                        <i class="fas fa-map-marker-alt"></i> ${incident.location.address}
                    </div>
                    <div class="incident-time">
                        <i class="fas fa-clock"></i> ${formattedTime}
                    </div>
                </div>
                <div class="incident-footer">
                    <button class="btn-details" onclick="showIncidentDetails('${incident.id}')">View Details</button>
                    ${incident.status !== 'resolved' ? 
                        `<button class="btn-respond" onclick="respondToIncident('${incident.id}')">Respond</button>` : 
                        ''}
                </div>
            `;
            
            incidentListContainer.appendChild(incidentCard);
        });
    }
    
    // Update the map if the map function is available
    if (typeof updateIncidentsOnMap === 'function') {
        updateIncidentsOnMap(incidents);
    }
}

/**
 * Update the resource list based on filters
 */
function updateResourceList() {
    // Get filter values
    const typeFilter = document.getElementById('resource-type-filter');
    const statusFilter = document.getElementById('resource-status-filter');
    
    const filters = {
        type: typeFilter && typeFilter.value !== 'all' ? typeFilter.value : null,
        status: statusFilter && statusFilter.value !== 'all' ? statusFilter.value : null
    };
    
    // Get filtered resources
    const resources = emergencyManager.getAllResources(filters);
    
    // Update resource list in UI
    const resourceListContainer = document.getElementById('resource-list');
    if (!resourceListContainer) return;
    
    // Clear existing content
    resourceListContainer.innerHTML = '';
    
    // Add resources to the list
    if (resources.length === 0) {
        resourceListContainer.innerHTML = '<div class="no-data">No resources match the selected filters.</div>';
    } else {
        resources.forEach(resource => {
            // Create resource card
            const resourceCard = document.createElement('div');
            resourceCard.className = `resource-card ${resource.status}`;
            resourceCard.setAttribute('data-resource-id', resource.id);
            
            // Determine icon based on type
            let typeIcon;
            switch (resource.type) {
                case 'fire_truck': typeIcon = '🚒'; break;
                case 'ambulance': typeIcon = '🚑'; break;
                case 'police_car': typeIcon = '🚓'; break;
                case 'hazmat_unit': typeIcon = '☣️'; break;
                case 'utility_vehicle': typeIcon = '🚚'; break;
                default: typeIcon = '🚗';
            }
            
            // Determine status badge
            let statusBadge;
            switch (resource.status) {
                case 'available': statusBadge = '<span class="status-badge available">Available</span>'; break;
                case 'busy': statusBadge = '<span class="status-badge busy">Busy</span>'; break;
                default: statusBadge = '<span class="status-badge">Unknown</span>';
            }
            
            // Build card content
            resourceCard.innerHTML = `
                <div class="resource-header">
                    <div class="resource-type">
                        <span class="type-icon">${typeIcon}</span>
                        <span class="type-name">${resource.name}</span>
                    </div>
                    <div class="resource-badges">
                        ${statusBadge}
                    </div>
                </div>
                <div class="resource-body">
                    <div class="resource-capabilities">
                        <strong>Capabilities:</strong> ${resource.capabilities.join(', ')}
                    </div>
                    <div class="resource-personnel">
                        <strong>Personnel:</strong> ${resource.personnel}
                    </div>
                    <div class="resource-location">
                        <i class="fas fa-map-marker-alt"></i> ${resource.location.address}
                    </div>
                </div>
                <div class="resource-footer">
                    <button class="btn-details" onclick="showResourceDetails('${resource.id}')">View Details</button>
                    ${resource.status === 'available' ? 
                        `<button class="btn-assign" onclick="assignResource('${resource.id}')">Assign</button>` : 
                        `<button class="btn-release" onclick="releaseResource('${resource.id}')">Release</button>`}
                </div>
            `;
            
            resourceListContainer.appendChild(resourceCard);
        });
    }
    
    // Update the map if the map function is available
    if (typeof updateResourcesOnMap === 'function') {
        updateResourcesOnMap(resources);
    }
}

/**
 * Update the risk zone list based on filters
 */
function updateRiskZoneList() {
    // Get filter values
    const typeFilter = document.getElementById('risk-zone-type-filter');
    const riskLevelFilter = document.getElementById('risk-level-filter');
    
    const filters = {
        type: typeFilter && typeFilter.value !== 'all' ? typeFilter.value : null,
        minRiskLevel: riskLevelFilter && riskLevelFilter.value !== 'all' ? parseInt(riskLevelFilter.value) : null
    };
    
    // Get filtered risk zones
    const riskZones = emergencyManager.getAllRiskZones(filters);
    
    // Update risk zone list in UI
    const riskZoneListContainer = document.getElementById('risk-zone-list');
    if (!riskZoneListContainer) return;
    
    // Clear existing content
    riskZoneListContainer.innerHTML = '';
    
    // Add risk zones to the list
    if (riskZones.length === 0) {
        riskZoneListContainer.innerHTML = '<div class="no-data">No risk zones match the selected filters.</div>';
    } else {
        riskZones.forEach(zone => {
            // Create risk zone card
            const zoneCard = document.createElement('div');
            zoneCard.className = `risk-zone-card risk-level-${zone.riskLevel}`;
            zoneCard.setAttribute('data-zone-id', zone.id);
            
            // Determine icon based on type
            let typeIcon;
            switch (zone.type) {
                case 'flood': typeIcon = '🌊'; break;
                case 'fire': typeIcon = '🔥'; break;
                case 'chemical': typeIcon = '☣️'; break;
                case 'structural': typeIcon = '🏗️'; break;
                case 'weather': typeIcon = '⛈️'; break;
                default: typeIcon = '⚠️';
            }
            
            // Build card content
            zoneCard.innerHTML = `
                <div class="zone-header">
                    <div class="zone-type">
                        <span class="type-icon">${typeIcon}</span>
                        <span class="type-name">${zone.name}</span>
                    </div>
                    <div class="zone-badges">
                        <span class="risk-level-badge level-${zone.riskLevel}">Risk Level ${zone.riskLevel}</span>
                        ${zone.evacuationRequired ? 
                            '<span class="evacuation-badge">Evacuation Required</span>' : 
                            ''}
                    </div>
                </div>
                <div class="zone-body">
                    <div class="zone-description">${zone.description}</div>
                    <div class="zone-affected">
                        <strong>Affected Population:</strong> ~${zone.affectedPopulation.toLocaleString()} people
                    </div>
                    <div class="zone-radius">
                        <strong>Affected Radius:</strong> ${zone.radius} meters
                    </div>
                </div>
                <div class="zone-footer">
                    <button class="btn-details" onclick="showRiskZoneDetails('${zone.id}')">View Details</button>
                    ${zone.evacuationRequired ? 
                        `<button class="btn-evacuate" onclick="showEvacuationRoutes('${zone.id}')">Evacuation Routes</button>` : 
                        ''}
                </div>
            `;
            
            riskZoneListContainer.appendChild(zoneCard);
        });
    }
    
    // Update the map if the map function is available
    if (typeof updateRiskZonesOnMap === 'function') {
        updateRiskZonesOnMap(riskZones);
    }
}