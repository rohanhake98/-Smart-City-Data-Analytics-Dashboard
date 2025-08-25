/**
 * Smart City Data Analytics Dashboard - Citizen Engagement Module
 * This file contains the implementation of the Citizen Engagement Portal
 */

// Citizen Engagement Manager class for issue reporting and community engagement
class CitizenEngagementManager {
    constructor() {
        this.reportedIssues = [];
        this.communityProjects = [];
        this.userFeedback = [];
        this.notifications = [];
        this.initialized = false;
    }
    
    /**
     * Initialize the citizen engagement manager with sample data
     */
    initialize() {
        if (this.initialized) return;
        
        // Load sample reported issues
        this.loadSampleReportedIssues();
        
        // Load sample community projects
        this.loadSampleCommunityProjects();
        
        // Load sample user feedback
        this.loadSampleUserFeedback();
        
        // Load sample notifications
        this.loadSampleNotifications();
        
        this.initialized = true;
        console.log('Citizen Engagement Manager initialized');
    }
    
    /**
     * Load sample reported issues
     */
    loadSampleReportedIssues() {
        // Define issue types and statuses
        const issueTypes = ['pothole', 'streetlight', 'graffiti', 'trash', 'sidewalk', 'water_leak', 'traffic_signal', 'noise', 'other'];
        const statusOptions = ['reported', 'under_review', 'in_progress', 'resolved', 'closed'];
        
        // Generate 15-25 random issues
        const numIssues = 15 + Math.floor(Math.random() * 11);
        
        for (let i = 0; i < numIssues; i++) {
            // Generate random issue data
            const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            
            // Generate random location within city bounds
            const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
            const lng = -74.006 + (Math.random() - 0.5) * 0.1;
            
            // Generate random timestamp within the last 30 days
            const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
            
            // Generate random votes (0-50)
            const votes = Math.floor(Math.random() * 51);
            
            // Create issue object
            const issue = {
                id: `issue_${(i + 1).toString().padStart(3, '0')}`,
                type: issueType,
                title: this.generateIssueTitle(issueType),
                description: this.generateIssueDescription(issueType),
                status: status,
                location: {
                    lat: lat,
                    lng: lng,
                    address: this.generateRandomAddress()
                },
                reportedBy: this.generateRandomUser(),
                reportedAt: timestamp,
                votes: votes,
                images: this.generateIssueImages(issueType),
                updates: this.generateIssueUpdates(status),
                estimatedResolutionDate: status === 'resolved' || status === 'closed' ? null : this.generateEstimatedResolutionDate(),
                priority: this.calculateIssuePriority(issueType, votes, status)
            };
            
            // Add issue to the list
            this.reportedIssues.push(issue);
        }
        
        // Sort issues by votes (highest first)
        this.reportedIssues.sort((a, b) => b.votes - a.votes);
    }
    
    /**
     * Generate issue title based on type
     * @param {string} type - Issue type
     * @returns {string} - Issue title
     */
    generateIssueTitle(type) {
        const titles = {
            pothole: [
                'Large pothole damaging vehicles',
                'Deep pothole after recent rain',
                'Multiple potholes on street',
                'Pothole at intersection causing hazard',
                'Growing pothole needs immediate repair'
            ],
            streetlight: [
                'Streetlight out for several days',
                'Flickering streetlight causing concern',
                'Dark area due to multiple broken lights',
                'Streetlight damaged by vehicle',
                'New streetlight needed in dark area'
            ],
            graffiti: [
                'Offensive graffiti on public building',
                'Graffiti vandalism on park equipment',
                'Gang-related graffiti in neighborhood',
                'Graffiti on historic monument',
                'Multiple buildings tagged with graffiti'
            ],
            trash: [
                'Illegal dumping in vacant lot',
                'Overflowing public trash cans',
                'Trash scattered across park',
                'Abandoned furniture on sidewalk',
                'Recurring trash problem at location'
            ],
            sidewalk: [
                'Cracked sidewalk creating tripping hazard',
                'Sidewalk blocked by overgrown vegetation',
                'Uneven sidewalk needs repair',
                'Missing section of sidewalk',
                'Sidewalk flooding during rain'
            ],
            water_leak: [
                'Water main break flooding street',
                'Continuous water leak from pipe',
                'Water leaking from fire hydrant',
                'Sewage leak creating health hazard',
                'Water bubbling up through pavement'
            ],
            traffic_signal: [
                'Traffic light stuck on red',
                'Pedestrian crossing signal not working',
                'Traffic light out after storm',
                'Blinking yellow light causing confusion',
                'Traffic signal timing needs adjustment'
            ],
            noise: [
                'Excessive construction noise at night',
                'Loud music from business after hours',
                'Industrial noise affecting residential area',
                'Recurring loud parties at address',
                'Early morning garbage collection noise'
            ],
            other: [
                'Abandoned vehicle not moved for weeks',
                'Dangerous intersection needs crosswalk',
                'Playground equipment damaged and unsafe',
                'Excessive speeding on residential street',
                'Public bench in need of repair'
            ]
        };
        
        const typeTitles = titles[type] || ['Issue reported by citizen'];
        return typeTitles[Math.floor(Math.random() * typeTitles.length)];
    }
    
    /**
     * Generate issue description based on type
     * @param {string} type - Issue type
     * @returns {string} - Issue description
     */
    generateIssueDescription(type) {
        const descriptions = {
            pothole: [
                'There is a large pothole approximately 2 feet wide and 6 inches deep. It has already damaged multiple car tires and is a hazard for cyclists.',
                'After the recent heavy rain, a pothole has formed and is growing larger. It is located in the right lane and causes vehicles to swerve dangerously.',
                'Multiple potholes have formed along this stretch of road, making it difficult to navigate without damaging vehicles. The largest is about 3 feet wide.'
            ],
            streetlight: [
                'The streetlight has been out for over a week, creating a very dark and unsafe area at night. Several residents have expressed safety concerns.',
                'This streetlight flickers on and off throughout the night, creating a disorienting effect for drivers and pedestrians. It may be an electrical issue.',
                'Three consecutive streetlights are not working, creating a completely dark section of road that feels unsafe to walk through at night.'
            ],
            graffiti: [
                'There is offensive graffiti containing inappropriate language and symbols on the wall of the public building. It is clearly visible from the main street.',
                'Someone has spray-painted graffiti all over the children\'s playground equipment. The paint contains inappropriate images not suitable for children.',
                'There appears to be gang-related graffiti that has appeared on several buildings in the neighborhood over the past week. This is causing concern among residents.'
            ],
            trash: [
                'Someone has illegally dumped a large amount of construction debris and household trash in this vacant lot. It\'s attracting pests and creating an eyesore.',
                'The public trash cans in this area have not been emptied for what seems like weeks. They are overflowing and trash is blowing throughout the park.',
                'There is a large amount of trash scattered across the park, including broken glass which is hazardous to children and pets who use this area.'
            ],
            sidewalk: [
                'The sidewalk has a large crack with about a 3-inch height difference between sections, creating a significant tripping hazard, especially for elderly residents.',
                'The sidewalk is completely blocked by overgrown bushes and tree branches, forcing pedestrians to walk in the busy street, which is very dangerous.',
                'This section of sidewalk is extremely uneven and has multiple broken sections. It\'s virtually impossible to navigate with a wheelchair or stroller.'
            ],
            water_leak: [
                'There is a major water main break flooding the entire street. Water is gushing out and flowing down the hill, potentially causing damage to homes.',
                'Water has been continuously leaking from this pipe for several days, creating a constant stream down the gutter and wasting a significant amount of water.',
                'The fire hydrant appears to be damaged and is leaking water constantly. The area around it is always wet and is starting to cause erosion.'
            ],
            traffic_signal: [
                'The traffic light at this busy intersection has been stuck on red in all directions for over an hour, causing significant traffic backup and confusion.',
                'The pedestrian crossing signal button doesn\'t work, making it dangerous for people trying to cross this busy street, especially those with mobility issues.',
                'After the storm last night, this traffic light is completely out. Cars are treating it as a four-way stop, but it\'s creating confusion and near-accidents.'
            ],
            noise: [
                'Construction work is regularly occurring after permitted hours (past 10 PM) and the noise is making it impossible for nearby residents to sleep.',
                'This bar/restaurant has been playing extremely loud music until 2-3 AM on weeknights, violating noise ordinances and disturbing the entire neighborhood.',
                'The industrial facility is producing loud, disruptive noise at all hours, well above what seems to be legally permitted in a mixed-use zone so close to homes.'
            ],
            other: [
                'This vehicle appears to be abandoned. It has not moved for at least 3 weeks, has a flat tire, expired registration, and is collecting trash underneath it.',
                'This is a dangerous intersection where I\'ve witnessed multiple near-accidents. There is no crosswalk or stop sign, and cars travel at high speeds.',
                'Several pieces of equipment at this playground are broken and have sharp edges exposed. Children could easily be injured on the damaged equipment.'
            ]
        };
        
        const typeDescriptions = descriptions[type] || ['Issue reported by citizen requiring attention from city services.'];
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
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
     * Generate a random user
     * @returns {Object} - User object
     */
    generateRandomUser() {
        const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer', 'William', 'Elizabeth'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return {
            id: `user_${Math.floor(Math.random() * 1000)}`,
            name: `${firstName} ${lastName}`,
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
        };
    }
    
    /**
     * Generate issue images based on type
     * @param {string} type - Issue type
     * @returns {Array} - Array of image URLs
     */
    generateIssueImages(type) {
        // In a real application, these would be actual image URLs
        // For this demo, we'll generate placeholder URLs
        const numImages = 1 + Math.floor(Math.random() * 3); // 1-3 images
        const images = [];
        
        for (let i = 0; i < numImages; i++) {
            images.push(`https://placehold.co/600x400?text=${type}_issue_${i + 1}`);
        }
        
        return images;
    }
    
    /**
     * Generate issue updates based on status
     * @param {string} status - Issue status
     * @returns {Array} - Array of update objects
     */
    generateIssueUpdates(status) {
        const updates = [];
        
        // Always add initial report
        updates.push({
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'reported',
            message: 'Issue reported by citizen.',
            updatedBy: 'system'
        });
        
        // Add under_review update if status is beyond reported
        if (status !== 'reported') {
            updates.push({
                timestamp: new Date(new Date(updates[0].timestamp).getTime() + 1 * 24 * 60 * 60 * 1000 + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'under_review',
                message: 'Issue is under review by city services.',
                updatedBy: 'admin'
            });
        }
        
        // Add in_progress update if status is beyond under_review
        if (status === 'in_progress' || status === 'resolved' || status === 'closed') {
            updates.push({
                timestamp: new Date(new Date(updates[1].timestamp).getTime() + 2 * 24 * 60 * 60 * 1000 + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'in_progress',
                message: 'Work has begun to address this issue.',
                updatedBy: 'admin'
            });
        }
        
        // Add resolved update if status is resolved or closed
        if (status === 'resolved' || status === 'closed') {
            updates.push({
                timestamp: new Date(new Date(updates[2].timestamp).getTime() + 3 * 24 * 60 * 60 * 1000 + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'resolved',
                message: 'This issue has been resolved. Thank you for your report.',
                updatedBy: 'admin'
            });
        }
        
        // Add closed update if status is closed
        if (status === 'closed') {
            updates.push({
                timestamp: new Date(new Date(updates[3].timestamp).getTime() + 1 * 24 * 60 * 60 * 1000 + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'closed',
                message: 'This issue has been verified as resolved and the case is now closed.',
                updatedBy: 'admin'
            });
        }
        
        return updates;
    }
    
    /**
     * Generate estimated resolution date
     * @returns {string} - ISO timestamp for estimated resolution
     */
    generateEstimatedResolutionDate() {
        // Generate a date 5-30 days in the future
        const daysToAdd = 5 + Math.floor(Math.random() * 26);
        return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
    }
    
    /**
     * Calculate issue priority based on type, votes, and status
     * @param {string} type - Issue type
     * @param {number} votes - Number of votes
     * @param {string} status - Issue status
     * @returns {string} - Priority level (high, medium, low)
     */
    calculateIssuePriority(type, votes, status) {
        // Define high-priority issue types
        const highPriorityTypes = ['water_leak', 'traffic_signal'];
        
        // Define medium-priority issue types
        const mediumPriorityTypes = ['pothole', 'streetlight', 'sidewalk'];
        
        // If issue is resolved or closed, priority is low
        if (status === 'resolved' || status === 'closed') {
            return 'low';
        }
        
        // If issue type is high priority, or has many votes, priority is high
        if (highPriorityTypes.includes(type) || votes >= 30) {
            return 'high';
        }
        
        // If issue type is medium priority, or has moderate votes, priority is medium
        if (mediumPriorityTypes.includes(type) || votes >= 10) {
            return 'medium';
        }
        
        // Otherwise, priority is low
        return 'low';
    }
    
    /**
     * Load sample community projects
     */
    loadSampleCommunityProjects() {
        // Define project types and statuses
        const projectTypes = ['park', 'infrastructure', 'community', 'environment', 'safety', 'education'];
        const statusOptions = ['proposed', 'planning', 'in_progress', 'completed'];
        
        // Generate 5-10 random projects
        const numProjects = 5 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < numProjects; i++) {
            // Generate random project data
            const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            
            // Generate random location within city bounds
            const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
            const lng = -74.006 + (Math.random() - 0.5) * 0.1;
            
            // Generate random start date within the last 6 months
            const startDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString();
            
            // Generate random end date (if completed) or estimated end date
            let endDate = null;
            if (status === 'completed') {
                endDate = new Date(new Date(startDate).getTime() + (30 + Math.random() * 150) * 24 * 60 * 60 * 1000).toISOString();
            } else if (status !== 'proposed') {
                endDate = new Date(Date.now() + (30 + Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString();
            }
            
            // Generate random budget
            const budget = Math.floor((50000 + Math.random() * 950000) / 1000) * 1000; // $50k-$1M in $1k increments
            
            // Generate random votes (0-200)
            const votes = Math.floor(Math.random() * 201);
            
            // Create project object
            const project = {
                id: `project_${(i + 1).toString().padStart(3, '0')}`,
                type: projectType,
                title: this.generateProjectTitle(projectType),
                description: this.generateProjectDescription(projectType),
                status: status,
                location: {
                    lat: lat,
                    lng: lng,
                    address: this.generateRandomAddress()
                },
                proposedBy: status === 'proposed' ? this.generateRandomUser() : null,
                managedBy: status !== 'proposed' ? 'City Planning Department' : null,
                startDate: startDate,
                endDate: endDate,
                budget: budget,
                votes: votes,
                images: this.generateProjectImages(projectType),
                updates: this.generateProjectUpdates(status),
                impact: this.generateProjectImpact(projectType)
            };
            
            // Add project to the list
            this.communityProjects.push(project);
        }
        
        // Sort projects by votes (highest first)
        this.communityProjects.sort((a, b) => b.votes - a.votes);
    }
    
    /**
     * Generate project title based on type
     * @param {string} type - Project type
     * @returns {string} - Project title
     */
    generateProjectTitle(type) {
        const titles = {
            park: [
                'Community Garden Expansion',
                'Playground Renovation',
                'Dog Park Installation',
                'Park Lighting Improvement',
                'Accessible Playground Project'
            ],
            infrastructure: [
                'Main Street Revitalization',
                'Bike Lane Network Expansion',
                'Pedestrian Bridge Construction',
                'Sidewalk Improvement Initiative',
                'Smart Traffic Signal Upgrade'
            ],
            community: [
                'Community Center Renovation',
                'Public Art Installation Project',
                'Neighborhood Watch Program',
                'Cultural Festival Series',
                'Community Wifi Network'
            ],
            environment: [
                'Urban Tree Planting Initiative',
                'Rain Garden Installation Project',
                'Solar Panel Installation on Public Buildings',
                'Waterway Cleanup Project',
                'Composting Education Program'
            ],
            safety: [
                'Crosswalk Safety Enhancement',
                'Emergency Preparedness Program',
                'Street Lighting Expansion',
                'Traffic Calming Measures',
                'School Zone Safety Project'
            ],
            education: [
                'Public Library Expansion',
                'STEM Education Center',
                'After-School Program Facility',
                'Adult Education Workshop Series',
                'Digital Literacy Program'
            ]
        };
        
        const typeTitles = titles[type] || ['Community Improvement Project'];
        return typeTitles[Math.floor(Math.random() * typeTitles.length)];
    }
    
    /**
     * Generate project description based on type
     * @param {string} type - Project type
     * @returns {string} - Project description
     */
    generateProjectDescription(type) {
        const descriptions = {
            park: [
                'This project will expand the existing community garden by adding 20 new plots, a water-efficient irrigation system, and a communal herb garden. The expansion will allow more residents to grow their own food and participate in community gardening activities.',
                'A complete renovation of the outdated playground equipment at Central Park. The new playground will feature inclusive equipment for children of all abilities, safety surfacing, shade structures, and seating areas for parents and caregivers.',
                'Creation of a dedicated off-leash dog park with separate areas for large and small dogs, water stations, waste disposal facilities, and agility equipment. This will provide a safe space for dogs to exercise and socialize.'
            ],
            infrastructure: [
                'A comprehensive revitalization of Main Street including sidewalk widening, street tree planting, facade improvements, pedestrian lighting, and public seating areas. This project aims to create a more vibrant and walkable downtown area.',
                'Expansion of the city\'s bike lane network by adding 5 miles of protected bike lanes connecting residential neighborhoods to downtown, parks, and schools. The project includes lane markings, barriers, signage, and bike parking facilities.',
                'Construction of a pedestrian bridge over Highway 101 to connect the eastern and western portions of the city that are currently divided by the highway. This will provide safe passage for pedestrians and cyclists.'
            ],
            community: [
                'Renovation of the aging community center to include updated meeting spaces, a commercial kitchen for community events, improved accessibility features, energy-efficient systems, and technology upgrades for digital inclusion programs.',
                'Installation of five public art pieces throughout the city, created by local artists and reflecting the community\'s cultural heritage. The project includes interactive elements and educational plaques about the artwork and artists.',
                'Establishment of a comprehensive Neighborhood Watch program including training sessions, communication systems, signage, and coordination with local law enforcement to improve community safety and engagement.'
            ],
            environment: [
                'Planting 500 native trees throughout urban areas with low tree canopy coverage. The project includes site selection, species selection for maximum environmental benefit, planting, initial maintenance, and community education about tree care.',
                'Installation of 15 rain gardens in strategic locations to manage stormwater runoff, reduce flooding, and filter pollutants. The project includes site preparation, native plant installation, and educational signage about green infrastructure.',
                'Installation of solar panels on five public buildings to reduce energy costs and carbon emissions. The project includes system design, installation, monitoring equipment, and public education displays showing energy production and savings.'
            ],
            safety: [
                'Enhancement of 25 high-traffic crosswalks with high-visibility markings, pedestrian-activated flashing beacons, accessible curb ramps, and pedestrian refuge islands where appropriate to improve pedestrian safety.',
                'Development of a comprehensive emergency preparedness program including community training sessions, emergency supply caches, communication systems, and coordination plans for various emergency scenarios.',
                'Installation of additional street lighting in neighborhoods with high pedestrian activity and insufficient current lighting. The project uses energy-efficient LED fixtures and is designed to improve visibility while minimizing light pollution.'
            ],
            education: [
                'Expansion of the main public library to include a larger children\'s area, teen space, digital media lab, additional meeting rooms, and updated technology infrastructure to better serve community educational needs.',
                'Creation of a STEM Education Center with hands-on exhibits, workshop space, and technology resources. The center will offer programs for students, teacher training, and community workshops to promote science and technology education.',
                'Establishment of an after-school program facility offering homework help, enrichment activities, mentoring, and skill development for school-age children. The program will operate in an underserved neighborhood to support working families.'
            ]
        };
        
        const typeDescriptions = descriptions[type] || ['A community improvement project proposed to enhance quality of life for residents.'];
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    }
    
    /**
     * Generate project images based on type
     * @param {string} type - Project type
     * @returns {Array} - Array of image URLs
     */
    generateProjectImages(type) {
        // In a real application, these would be actual image URLs
        // For this demo, we'll generate placeholder URLs
        const numImages = 2 + Math.floor(Math.random() * 3); // 2-4 images
        const images = [];
        
        for (let i = 0; i < numImages; i++) {
            images.push(`https://placehold.co/800x600?text=${type}_project_${i + 1}`);
        }
        
        return images;
    }
    
    /**
     * Generate project updates based on status
     * @param {string} status - Project status
     * @returns {Array} - Array of update objects
     */
    generateProjectUpdates(status) {
        const updates = [];
        
        // Always add proposed update
        updates.push({
            timestamp: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'proposed',
            message: 'Project proposed for community consideration.',
            updatedBy: status === 'proposed' ? 'citizen' : 'admin'
        });
        
        // Add planning update if status is beyond proposed
        if (status !== 'proposed') {
            updates.push({
                timestamp: new Date(new Date(updates[0].timestamp).getTime() + 30 * 24 * 60 * 60 * 1000 + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'planning',
                message: 'Project approved for planning phase. Budget allocated and design work beginning.',
                updatedBy: 'admin'
            });
        }
        
        // Add in_progress update if status is beyond planning
        if (status === 'in_progress' || status === 'completed') {
            updates.push({
                timestamp: new Date(new Date(updates[1].timestamp).getTime() + 30 * 24 * 60 * 60 * 1000 + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'in_progress',
                message: 'Project implementation has begun. Construction/work is underway.',
                updatedBy: 'admin'
            });
        }
        
        // Add completed update if status is completed
        if (status === 'completed') {
            updates.push({
                timestamp: new Date(new Date(updates[2].timestamp).getTime() + 30 * 24 * 60 * 60 * 1000 + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                message: 'Project has been completed successfully. Thank you for your support.',
                updatedBy: 'admin'
            });
        }
        
        return updates;
    }
    
    /**
     * Generate project impact metrics
     * @param {string} type - Project type
     * @returns {Object} - Impact metrics object
     */
    generateProjectImpact(type) {
        // Generate appropriate impact metrics based on project type
        switch (type) {
            case 'park':
                return {
                    environmentalBenefit: Math.floor(Math.random() * 51) + 50, // 50-100%
                    communityBenefit: Math.floor(Math.random() * 31) + 70, // 70-100%
                    economicBenefit: Math.floor(Math.random() * 41) + 30, // 30-70%
                    peopleServed: Math.floor(Math.random() * 5000) + 1000, // 1000-6000
                    metrics: {
                        greenSpaceAdded: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 sq ft
                        treesPlanted: Math.floor(Math.random() * 50) + 10, // 10-60
                        recreationalValue: Math.floor(Math.random() * 50000) + 50000 // $50k-$100k
                    }
                };
            case 'infrastructure':
                return {
                    environmentalBenefit: Math.floor(Math.random() * 41) + 30, // 30-70%
                    communityBenefit: Math.floor(Math.random() * 31) + 60, // 60-90%
                    economicBenefit: Math.floor(Math.random() * 31) + 60, // 60-90%
                    peopleServed: Math.floor(Math.random() * 10000) + 5000, // 5000-15000
                    metrics: {
                        trafficFlowImprovement: Math.floor(Math.random() * 31) + 20, // 20-50%
                        maintenanceCostReduction: Math.floor(Math.random() * 31) + 10, // 10-40%
                        propertyValueIncrease: Math.floor(Math.random() * 16) + 5 // 5-20%
                    }
                };
            case 'community':
                return {
                    environmentalBenefit: Math.floor(Math.random() * 41) + 10, // 10-50%
                    communityBenefit: Math.floor(Math.random() * 21) + 80, // 80-100%
                    economicBenefit: Math.floor(Math.random() * 41) + 40, // 40-80%
                    peopleServed: Math.floor(Math.random() * 5000) + 2000, // 2000-7000
                    metrics: {
                        programsOffered: Math.floor(Math.random() * 20) + 5, // 5-25
                        volunteerHours: Math.floor(Math.random() * 1000) + 500, // 500-1500
                        communityEngagement: Math.floor(Math.random() * 31) + 70 // 70-100%
                    }
                };
            case 'environment':
                return {
                    environmentalBenefit: Math.floor(Math.random() * 21) + 80, // 80-100%
                    communityBenefit: Math.floor(Math.random() * 31) + 60, // 60-90%
                    economicBenefit: Math.floor(Math.random() * 41) + 30, // 30-70%
                    peopleServed: Math.floor(Math.random() * 20000) + 10000, // 10000-30000
                    metrics: {
                        carbonReduction: Math.floor(Math.random() * 500) + 100, // 100-600 tons
                        energySaved: Math.floor(Math.random() * 50000) + 10000, // 10000-60000 kWh
                        wasteReduction: Math.floor(Math.random() * 31) + 20 // 20-50%
                    }
                };
            case 'safety':
                return {
                    environmentalBenefit: Math.floor(Math.random() * 31) + 10, // 10-40%
                    communityBenefit: Math.floor(Math.random() * 21) + 80, // 80-100%
                    economicBenefit: Math.floor(Math.random() * 41) + 40, // 40-80%
                    peopleServed: Math.floor(Math.random() * 15000) + 5000, // 5000-20000
                    metrics: {
                        accidentReduction: Math.floor(Math.random() * 41) + 30, // 30-70%
                        responseTimeImprovement: Math.floor(Math.random() * 31) + 10, // 10-40%
                        crimeReduction: Math.floor(Math.random() * 26) + 5 // 5-30%
                    }
                };
            case 'education':
                return {
                    environmentalBenefit: Math.floor(Math.random() * 31) + 20, // 20-50%
                    communityBenefit: Math.floor(Math.random() * 21) + 80, // 80-100%
                    economicBenefit: Math.floor(Math.random() * 31) + 60, // 60-90%
                    peopleServed: Math.floor(Math.random() * 5000) + 1000, // 1000-6000
                    metrics: {
                        programParticipants: Math.floor(Math.random() * 1000) + 500, // 500-1500
                        educationalOutcomes: Math.floor(Math.random() * 31) + 40, // 40-70%
                        skillDevelopment: Math.floor(Math.random() * 31) + 50 // 50-80%
                    }
                };
            default:
                return {
                    environmentalBenefit: Math.floor(Math.random() * 101), // 0-100%
                    communityBenefit: Math.floor(Math.random() * 101), // 0-100%
                    economicBenefit: Math.floor(Math.random() * 101), // 0-100%
                    peopleServed: Math.floor(Math.random() * 10000) + 1000, // 1000-11000
                    metrics: {
                        generalImpact: Math.floor(Math.random() * 101) // 0-100%
                    }
                };
        }
    }
    
    /**
     * Load sample user feedback
     */
    loadSampleUserFeedback() {
        // Generate 10-20 random feedback items
        const numFeedback = 10 + Math.floor(Math.random() * 11);
        
        for (let i = 0; i < numFeedback; i++) {
            // Generate random feedback data
            const type = Math.random() > 0.3 ? 'issue' : 'project';
            const itemId = type === 'issue' ? 
                (this.reportedIssues.length > 0 ? this.reportedIssues[Math.floor(Math.random() * this.reportedIssues.length)].id : `issue_${Math.floor(Math.random() * 100)}`) : 
                (this.communityProjects.length > 0 ? this.communityProjects[Math.floor(Math.random() * this.communityProjects.length)].id : `project_${Math.floor(Math.random() * 100)}`);
            
            // Generate random timestamp within the last 30 days
            const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
            
            // Generate random rating (1-5)
            const rating = 1 + Math.floor(Math.random() * 5);
            
            // Create feedback object
            const feedback = {
                id: `feedback_${(i + 1).toString().padStart(3, '0')}`,
                type: type,
                itemId: itemId,
                user: this.generateRandomUser(),
                timestamp: timestamp,
                rating: rating,
                comment: this.generateFeedbackComment(type, rating),
                helpful: Math.floor(Math.random() * 21) // 0-20 people found this helpful
            };
            
            // Add feedback to the list
            this.userFeedback.push(feedback);
        }
        
        // Sort feedback by timestamp (newest first)
        this.userFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    /**
     * Generate feedback comment based on type and rating
     * @param {string} type - Feedback type (issue or project)
     * @param {number} rating - Rating (1-5)
     * @returns {string} - Feedback comment
     */
    generateFeedbackComment(type, rating) {
        if (type === 'issue') {
            if (rating >= 4) {
                const positiveComments = [
                    'Very satisfied with how quickly this issue was addressed. Thank you!',
                    'The city staff was responsive and kept me updated throughout the process.',
                    'Great job fixing this problem. The area looks much better now.',
                    'I appreciate the thorough work done to resolve this issue permanently.',
                    'The online reporting system made it easy to submit and track this issue.'
                ];
                return positiveComments[Math.floor(Math.random() * positiveComments.length)];
            } else if (rating >= 3) {
                const neutralComments = [
                    'The issue was fixed, but it took longer than I expected.',
                    'Adequate resolution, though communication could have been better.',
                    'Problem solved, but similar issues keep occurring in this area.',
                    'Satisfied with the result, but the process was confusing to navigate.',
                    'The fix seems temporary rather than addressing the root cause.'
                ];
                return neutralComments[Math.floor(Math.random() * neutralComments.length)];
            } else {
                const negativeComments = [
                    'Very disappointed with the response time. This issue affected many residents.',
                    'The problem was not fully resolved and is already recurring.',
                    'No updates were provided during the entire process.',
                    'Had to report multiple times before any action was taken.',
                    'The quality of the repair work was poor and inadequate.'
                ];
                return negativeComments[Math.floor(Math.random() * negativeComments.length)];
            }
        } else { // project
            if (rating >= 4) {
                const positiveComments = [
                    'This project has made a significant positive impact on our neighborhood!',
                    'Well-planned and executed. The new facilities are being well-used by the community.',
                    'Excellent use of city resources. This addresses a long-standing need in our area.',
                    'The community engagement throughout the project was impressive and inclusive.',
                    'The completed project exceeds expectations and improves quality of life.'
                ];
                return positiveComments[Math.floor(Math.random() * positiveComments.length)];
            } else if (rating >= 3) {
                const neutralComments = [
                    'The project is good overall, though some aspects could have been better planned.',
                    'Satisfied with the outcome, but the construction period was disruptive.',
                    'The project addresses the need, but at a higher cost than seemed necessary.',
                    'Good addition to the community, though maintenance concerns remain.',
                    'The project is useful but doesn\'t fully address all the community needs.'
                ];
                return neutralComments[Math.floor(Math.random() * neutralComments.length)];
            } else {
                const negativeComments = [
                    'This project seems like a waste of taxpayer money that could be better used elsewhere.',
                    'Poor planning has resulted in numerous problems that weren\'t anticipated.',
                    'The community input was largely ignored in the final implementation.',
                    'The project is already showing signs of poor construction and maintenance issues.',
                    'The disruption to the neighborhood wasn\'t worth the minimal benefits.'
                ];
                return negativeComments[Math.floor(Math.random() * negativeComments.length)];
            }
        }
    }
    
    /**
     * Load sample notifications
     */
    loadSampleNotifications() {
        // Define notification types
        const notificationTypes = ['issue_update', 'project_update', 'new_issue', 'new_project', 'survey', 'announcement'];
        
        // Generate 10-20 random notifications
        const numNotifications = 10 + Math.floor(Math.random() * 11);
        
        for (let i = 0; i < numNotifications; i++) {
            // Generate random notification data
            const notificationType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            
            // Generate random timestamp within the last 30 days
            const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
            
            // Create notification object
            const notification = {
                id: `notification_${(i + 1).toString().padStart(3, '0')}`,
                type: notificationType,
                timestamp: timestamp,
                title: this.generateNotificationTitle(notificationType),
                message: this.generateNotificationMessage(notificationType),
                read: Math.random() > 0.3, // 70% chance of being read
                relatedItemId: this.getRelatedItemId(notificationType),
                actionUrl: this.generateActionUrl(notificationType),
                priority: this.calculateNotificationPriority(notificationType)
            };
            
            // Add notification to the list
            this.notifications.push(notification);
        }
        
        // Sort notifications by timestamp (newest first)
        this.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    /**
     * Generate notification title based on type
     * @param {string} type - Notification type
     * @returns {string} - Notification title
     */
    generateNotificationTitle(type) {
        switch (type) {
            case 'issue_update':
                return 'Update on your reported issue';
            case 'project_update':
                return 'Community project update';
            case 'new_issue':
                return 'New issue reported in your area';
            case 'new_project':
                return 'New community project proposed';
            case 'survey':
                return 'Your input needed: Community survey';
            case 'announcement':
                return 'Important city announcement';
            default:
                return 'Notification from City Services';
        }
    }
    
    /**
     * Generate notification message based on type
     * @param {string} type - Notification type
     * @returns {string} - Notification message
     */
    generateNotificationMessage(type) {
        switch (type) {
            case 'issue_update':
                const issueStatuses = ['under review', 'in progress', 'resolved'];
                const issueStatus = issueStatuses[Math.floor(Math.random() * issueStatuses.length)];
                return `The issue you reported has been updated to status: ${issueStatus}. Click to view details.`;
            case 'project_update':
                const projectStatuses = ['planning phase', 'construction beginning', 'milestone reached', 'completed'];
                const projectStatus = projectStatuses[Math.floor(Math.random() * projectStatuses.length)];
                return `A community project in your area has reached a new stage: ${projectStatus}. Click to learn more.`;
            case 'new_issue':
                const issueTypes = ['pothole', 'streetlight outage', 'graffiti', 'water leak'];
                const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
                return `A new ${issueType} has been reported near your location. Click to view details.`;
            case 'new_project':
                const projectTypes = ['park improvement', 'road construction', 'community facility', 'public art'];
                const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
                return `A new ${projectType} project has been proposed in your neighborhood. Review and provide feedback.`;
            case 'survey':
                const surveyTopics = ['transportation needs', 'park facilities', 'community services', 'city budget priorities'];
                const surveyTopic = surveyTopics[Math.floor(Math.random() * surveyTopics.length)];
                return `Your input is requested on a new survey about ${surveyTopic}. Your feedback helps shape our city's future.`;
            case 'announcement':
                const announcements = [
                    'Upcoming road closures for scheduled maintenance',
                    'Changes to waste collection schedule',
                    'New city service available to residents',
                    'Public meeting scheduled for zoning changes',
                    'Emergency preparedness information'
                ];
                return announcements[Math.floor(Math.random() * announcements.length)];
            default:
                return 'You have a new notification from City Services. Click to view details.';
        }
    }
    
    /**
     * Get related item ID based on notification type
     * @param {string} type - Notification type
     * @returns {string|null} - Related item ID or null
     */
    getRelatedItemId(type) {
        if (type === 'issue_update' || type === 'new_issue') {
            return this.reportedIssues.length > 0 ? 
                this.reportedIssues[Math.floor(Math.random() * this.reportedIssues.length)].id : 
                `issue_${Math.floor(Math.random() * 100)}`;
        } else if (type === 'project_update' || type === 'new_project') {
            return this.communityProjects.length > 0 ? 
                this.communityProjects[Math.floor(Math.random() * this.communityProjects.length)].id : 
                `project_${Math.floor(Math.random() * 100)}`;
        } else {
            return null;
        }
    }
    
    /**
     * Generate action URL based on notification type
     * @param {string} type - Notification type
     * @returns {string} - Action URL
     */
    generateActionUrl(type) {
        switch (type) {
            case 'issue_update':
            case 'new_issue':
                return '#citizen-issues';
            case 'project_update':
            case 'new_project':
                return '#citizen-projects';
            case 'survey':
                return '#citizen-surveys';
            case 'announcement':
                return '#citizen-announcements';
            default:
                return '#citizen';
        }
    }
    
    /**
     * Calculate notification priority based on type
     * @param {string} type - Notification type
     * @returns {string} - Priority level (high, medium, low)
     */
    calculateNotificationPriority(type) {
        switch (type) {
            case 'issue_update':
                return 'medium';
            case 'project_update':
                return 'medium';
            case 'new_issue':
                return 'low';
            case 'new_project':
                return 'low';
            case 'survey':
                return 'medium';
            case 'announcement':
                return Math.random() > 0.7 ? 'high' : 'medium'; // 30% chance of high priority
            default:
                return 'low';
        }
    }
    
    /**
     * Get all reported issues
     * @param {Object} filters - Optional filters for issues
     * @returns {Array} - Array of issue objects
     */
    getAllReportedIssues(filters = {}) {
        let filteredIssues = [...this.reportedIssues];
        
        // Apply type filter
        if (filters.type) {
            filteredIssues = filteredIssues.filter(issue => issue.type === filters.type);
        }
        
        // Apply status filter
        if (filters.status) {
            filteredIssues = filteredIssues.filter(issue => issue.status === filters.status);
        }
        
        // Apply priority filter
        if (filters.priority) {
            filteredIssues = filteredIssues.filter(issue => issue.priority === filters.priority);
        }
        
        // Apply time range filter
        if (filters.timeRange) {
            const now = new Date();
            let startTime;
            
            switch (filters.timeRange) {
                case '7d':
                    startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case '90d':
                    startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startTime = new Date(0); // Beginning of time
            }
            
            filteredIssues = filteredIssues.filter(issue => new Date(issue.reportedAt) >= startTime);
        }
        
        return filteredIssues;
    }
    
    /**
     * Get issue by ID
     * @param {string} issueId - Issue ID
     * @returns {Object|null} - Issue object or null if not found
     */
    getIssueById(issueId) {
        return this.reportedIssues.find(issue => issue.id === issueId) || null;
    }
    
    /**
     * Get all community projects
     * @param {Object} filters - Optional filters for projects
     * @returns {Array} - Array of project objects
     */
    getAllCommunityProjects(filters = {}) {
        let filteredProjects = [...this.communityProjects];
        
        // Apply type filter
        if (filters.type) {
            filteredProjects = filteredProjects.filter(project => project.type === filters.type);
        }
        
        // Apply status filter
        if (filters.status) {
            filteredProjects = filteredProjects.filter(project => project.status === filters.status);
        }
        
        // Apply budget range filter
        if (filters.minBudget) {
            filteredProjects = filteredProjects.filter(project => project.budget >= filters.minBudget);
        }
        if (filters.maxBudget) {
            filteredProjects = filteredProjects.filter(project => project.budget <= filters.maxBudget);
        }
        
        return filteredProjects;
    }
    
    /**
     * Get project by ID
     * @param {string} projectId - Project ID
     * @returns {Object|null} - Project object or null if not found
     */
    getProjectById(projectId) {
        return this.communityProjects.find(project => project.id === projectId) || null;
    }
    
    /**
     * Get all user feedback
     * @param {Object} filters - Optional filters for feedback
     * @returns {Array} - Array of feedback objects
     */
    getAllUserFeedback(filters = {}) {
        let filteredFeedback = [...this.userFeedback];
        
        // Apply type filter
        if (filters.type) {
            filteredFeedback = filteredFeedback.filter(feedback => feedback.type === filters.type);
        }
        
        // Apply item ID filter
        if (filters.itemId) {
            filteredFeedback = filteredFeedback.filter(feedback => feedback.itemId === filters.itemId);
        }
        
        // Apply minimum rating filter
        if (filters.minRating) {
            filteredFeedback = filteredFeedback.filter(feedback => feedback.rating >= filters.minRating);
        }
        
        return filteredFeedback;
    }
    
    /**
     * Get all notifications
     * @param {Object} filters - Optional filters for notifications
     * @returns {Array} - Array of notification objects
     */
    getAllNotifications(filters = {}) {
        let filteredNotifications = [...this.notifications];
        
        // Apply type filter
        if (filters.type) {
            filteredNotifications = filteredNotifications.filter(notification => notification.type === filters.type);
        }
        
        // Apply read status filter
        if (filters.read !== undefined) {
            filteredNotifications = filteredNotifications.filter(notification => notification.read === filters.read);
        }
        
        // Apply priority filter
        if (filters.priority) {
            filteredNotifications = filteredNotifications.filter(notification => notification.priority === filters.priority);
        }
        
        return filteredNotifications;
    }
    
    /**
     * Add a new issue report
     * @param {Object} issueData - Issue data
     * @returns {Object} - Created issue object
     */
    addIssue(issueData) {
        // Generate ID
        const issueId = `issue_${(this.reportedIssues.length + 1).toString().padStart(3, '0')}`;
        
        // Create issue object
        const issue = {
            id: issueId,
            type: issueData.type || 'other',
            title: issueData.title || this.generateIssueTitle(issueData.type || 'other'),
            description: issueData.description || '',
            status: 'reported',
            location: issueData.location || {
                lat: 40.7128,
                lng: -74.006,
                address: issueData.address || 'Unknown location'
            },
            reportedBy: issueData.user || this.generateRandomUser(),
            reportedAt: new Date().toISOString(),
            votes: 0,
            images: issueData.images || [],
            updates: [
                {
                    timestamp: new Date().toISOString(),
                    status: 'reported',
                    message: 'Issue reported by citizen.',
                    updatedBy: 'system'
                }
            ],
            estimatedResolutionDate: this.generateEstimatedResolutionDate(),
            priority: 'medium' // Default priority, will be recalculated later
        };
        
        // Calculate priority
        issue.priority = this.calculateIssuePriority(issue.type, issue.votes, issue.status);
        
        // Add issue to the list
        this.reportedIssues.push(issue);
        
        // Sort issues by votes (highest first)
        this.reportedIssues.sort((a, b) => b.votes - a.votes);
        
        return issue;
    }
    
    /**
     * Update issue status
     * @param {string} issueId - Issue ID
     * @param {string} status - New status
     * @param {string} message - Update message
     * @returns {Object|null} - Updated issue or null if not found
     */
    updateIssueStatus(issueId, status, message) {
        const issue = this.getIssueById(issueId);
        if (!issue) return null;
        
        // Update status
        issue.status = status;
        
        // Add update
        issue.updates.push({
            timestamp: new Date().toISOString(),
            status: status,
            message: message || `Issue status updated to ${status}.`,
            updatedBy: 'admin'
        });
        
        // If resolved or closed, clear estimated resolution date
        if (status === 'resolved' || status === 'closed') {
            issue.estimatedResolutionDate = null;
        }
        
        // Recalculate priority
        issue.priority = this.calculateIssuePriority(issue.type, issue.votes, issue.status);
        
        return issue;
    }
    
    /**
     * Vote for an issue
     * @param {string} issueId - Issue ID
     * @returns {Object|null} - Updated issue or null if not found
     */
    voteForIssue(issueId) {
        const issue = this.getIssueById(issueId);
        if (!issue) return null;
        
        // Increment votes
        issue.votes++;
        
        // Recalculate priority
        issue.priority = this.calculateIssuePriority(issue.type, issue.votes, issue.status);
        
        // Sort issues by votes (highest first)
        this.reportedIssues.sort((a, b) => b.votes - a.votes);
        
        return issue;
    }
    
    /**
     * Add a new community project proposal
     * @param {Object} projectData - Project data
     * @returns {Object} - Created project object
     */
    addProject(projectData) {
        // Generate ID
        const projectId = `project_${(this.communityProjects.length + 1).toString().padStart(3, '0')}`;
        
        // Create project object
        const project = {
            id: projectId,
            type: projectData.type || 'community',
            title: projectData.title || this.generateProjectTitle(projectData.type || 'community'),
            description: projectData.description || '',
            status: 'proposed',
            location: projectData.location || {
                lat: 40.7128,
                lng: -74.006,
                address: projectData.address || 'Unknown location'
            },
            proposedBy: projectData.user || this.generateRandomUser(),
            managedBy: null,
            startDate: new Date().toISOString(),
            endDate: null,
            budget: projectData.budget || 100000,
            votes: 0,
            images: projectData.images || [],
            updates: [
                {
                    timestamp: new Date().toISOString(),
                    status: 'proposed',
                    message: 'Project proposed for community consideration.',
                    updatedBy: 'citizen'
                }
            ],
            impact: this.generateProjectImpact(projectData.type || 'community')
        };
        
        // Add project to the list
        this.communityProjects.push(project);
        
        // Sort projects by votes (highest first)
        this.communityProjects.sort((a, b) => b.votes - a.votes);
        
        return project;
    }
    
    /**
     * Update project status
     * @param {string} projectId - Project ID
     * @param {string} status - New status
     * @param {string} message - Update message
     * @returns {Object|null} - Updated project or null if not found
     */
    updateProjectStatus(projectId, status, message) {
        const project = this.getProjectById(projectId);
        if (!project) return null;
        
        // Update status
        project.status = status;
        
        // Add update
        project.updates.push({
            timestamp: new Date().toISOString(),
            status: status,
            message: message || `Project status updated to ${status}.`,
            updatedBy: 'admin'
        });
        
        // If status is beyond proposed, set managedBy
        if (status !== 'proposed' && !project.managedBy) {
            project.managedBy = 'City Planning Department';
        }
        
        // If completed, set endDate
        if (status === 'completed' && !project.endDate) {
            project.endDate = new Date().toISOString();
        }
        
        return project;
    }
    
    /**
     * Vote for a project
     * @param {string} projectId - Project ID
     * @returns {Object|null} - Updated project or null if not found
     */
    voteForProject(projectId) {
        const project = this.getProjectById(projectId);
        if (!project) return null;
        
        // Increment votes
        project.votes++;
        
        // Sort projects by votes (highest first)
        this.communityProjects.sort((a, b) => b.votes - a.votes);
        
        return project;
    }
    
    /**
     * Add feedback for an issue or project
     * @param {Object} feedbackData - Feedback data
     * @returns {Object} - Created feedback object
     */
    addFeedback(feedbackData) {
        // Generate ID
        const feedbackId = `feedback_${(this.userFeedback.length + 1).toString().padStart(3, '0')}`;
        
        // Create feedback object
        const feedback = {
            id: feedbackId,
            type: feedbackData.type || 'issue',
            itemId: feedbackData.itemId,
            user: feedbackData.user || this.generateRandomUser(),
            timestamp: new Date().toISOString(),
            rating: feedbackData.rating || 3,
            comment: feedbackData.comment || '',
            helpful: 0
        };
        
        // Add feedback to the list
        this.userFeedback.push(feedback);
        
        // Sort feedback by timestamp (newest first)
        this.userFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return feedback;
    }
    
    /**
     * Mark feedback as helpful
     * @param {string} feedbackId - Feedback ID
     * @returns {Object|null} - Updated feedback or null if not found
     */
    markFeedbackAsHelpful(feedbackId) {
        const feedback = this.userFeedback.find(f => f.id === feedbackId);
        if (!feedback) return null;
        
        // Increment helpful count
        feedback.helpful++;
        
        return feedback;
    }
    
    /**
     * Add a notification
     * @param {Object} notificationData - Notification data
     * @returns {Object} - Created notification object
     */
    addNotification(notificationData) {
        // Generate ID
        const notificationId = `notification_${(this.notifications.length + 1).toString().padStart(3, '0')}`;
        
        // Create notification object
        const notification = {
            id: notificationId,
            type: notificationData.type || 'announcement',
            timestamp: new Date().toISOString(),
            title: notificationData.title || 'New notification',
            message: notificationData.message || '',
            read: false,
            relatedItemId: notificationData.relatedItemId || null,
            actionUrl: notificationData.actionUrl || '#citizen',
            priority: notificationData.priority || 'medium'
        };
        
        // Add notification to the list
        this.notifications.push(notification);
        
        // Sort notifications by timestamp (newest first)
        this.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return notification;
    }
    
    /**
     * Mark notification as read
     * @param {string} notificationId - Notification ID
     * @returns {Object|null} - Updated notification or null if not found
     */
    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return null;
        
        // Mark as read
        notification.read = true;
        
        return notification;
    }
}

// Create a global instance of the Citizen Engagement Manager
const citizenManager = new CitizenEngagementManager();

/**
 * Initialize the citizen engagement module
 */
function initCitizenEngagement() {
    // Initialize the citizen engagement manager
    citizenManager.initialize();
    
    // Set up event listeners
    setupCitizenEventListeners();
    
    // Load initial data
    loadCitizenData();
    
    console.log('Citizen Engagement Module initialized');
}

/**
 * Set up event listeners for citizen engagement module
 */
function setupCitizenEventListeners() {
    // Tab navigation
    document.querySelectorAll('#citizen-tabs .tab-button').forEach(button => {
        button.addEventListener('click', () => {
            // Get the tab ID from the button's data attribute
            const tabId = button.getAttribute('data-tab');
            
            // Hide all tabs
            document.querySelectorAll('#citizen-content .tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Deactivate all tab buttons
            document.querySelectorAll('#citizen-tabs .tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show the selected tab
            document.getElementById(tabId).classList.add('active');
            
            // Activate the selected tab button
            button.classList.add('active');
        });
    });
    
    // Issue filters
    document.getElementById('issue-type-filter').addEventListener('change', filterIssues);
    document.getElementById('issue-status-filter').addEventListener('change', filterIssues);
    document.getElementById('issue-time-filter').addEventListener('change', filterIssues);
    
    // Project filters
    document.getElementById('project-type-filter').addEventListener('change', filterProjects);
    document.getElementById('project-status-filter').addEventListener('change', filterProjects);
    
    // Report issue button
    document.getElementById('report-issue-btn').addEventListener('click', () => {
        document.getElementById('report-issue-modal').classList.add('active');
    });
    
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Submit issue form
    document.getElementById('issue-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitIssueReport();
    });
    
    // Submit project form
    document.getElementById('project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitProjectProposal();
    });
    
    // Propose project button
    document.getElementById('propose-project-btn').addEventListener('click', () => {
        document.getElementById('propose-project-modal').classList.add('active');
    });
    
    // Notification mark all as read button
    document.getElementById('mark-all-read-btn').addEventListener('click', markAllNotificationsAsRead);
}

/**
 * Load initial citizen data
 */
function loadCitizenData() {
    // Load reported issues
    updateIssuesList();
    
    // Load community projects
    updateProjectsList();
    
    // Load notifications
    updateNotificationsList();
    
    // Update notification badge
    updateNotificationBadge();
}

/**
 * Update the issues list in the UI
 */
function updateIssuesList() {
    const issuesList = document.getElementById('issues-list');
    if (!issuesList) return;
    
    // Get filters
    const typeFilter = document.getElementById('issue-type-filter').value;
    const statusFilter = document.getElementById('issue-status-filter').value;
    const timeFilter = document.getElementById('issue-time-filter').value;
    
    // Create filters object
    const filters = {};
    if (typeFilter !== 'all') filters.type = typeFilter;
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (timeFilter !== 'all') filters.timeRange = timeFilter;
    
    // Get filtered issues
    const issues = citizenManager.getAllReportedIssues(filters);
    
    // Clear the list
    issuesList.innerHTML = '';
    
    // Add issues to the list
    if (issues.length === 0) {
        issuesList.innerHTML = '<div class="empty-state">No issues found matching your filters.</div>';
    } else {
        issues.forEach(issue => {
            const issueCard = createIssueCard(issue);
            issuesList.appendChild(issueCard);
        });
    }
}

/**
 * Create an issue card element
 * @param {Object} issue - Issue object
 * @returns {HTMLElement} - Issue card element
 */
function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.setAttribute('data-id', issue.id);
    
    // Set priority class
    card.classList.add(`priority-${issue.priority}`);
    
    // Format date
    const reportedDate = new Date(issue.reportedAt);
    const formattedDate = reportedDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Create card content
    card.innerHTML = `
        <div class="issue-header">
            <div class="issue-title">${issue.title}</div>
            <div class="issue-status status-${issue.status}">${formatStatus(issue.status)}</div>
        </div>
        <div class="issue-details">
            <div class="issue-location">
                <i class="fas fa-map-marker-alt"></i> ${issue.location.address}
            </div>
            <div class="issue-date">
                <i class="far fa-calendar-alt"></i> ${formattedDate}
            </div>
            <div class="issue-type">
                <i class="fas fa-tag"></i> ${formatIssueType(issue.type)}
            </div>
        </div>
        <div class="issue-description">${issue.description.substring(0, 150)}${issue.description.length > 150 ? '...' : ''}</div>
        <div class="issue-footer">
            <div class="issue-votes">
                <button class="vote-button" data-id="${issue.id}">
                    <i class="fas fa-arrow-up"></i> Upvote
                </button>
                <span class="vote-count">${issue.votes} votes</span>
            </div>
            <button class="view-details-button" data-id="${issue.id}">View Details</button>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.vote-button').addEventListener('click', (e) => {
        e.stopPropagation();
        voteForIssue(issue.id);
    });
    
    card.querySelector('.view-details-button').addEventListener('click', (e) => {
        e.stopPropagation();
        showIssueDetails(issue.id);
    });
    
    return card;
}

/**
 * Format issue type for display
 * @param {string} type - Issue type
 * @returns {string} - Formatted issue type
 */
function formatIssueType(type) {
    const types = {
        pothole: 'Pothole',
        streetlight: 'Street Light',
        graffiti: 'Graffiti',
        trash: 'Trash/Debris',
        sidewalk: 'Sidewalk Issue',
        water_leak: 'Water Leak',
        traffic_signal: 'Traffic Signal',
        noise: 'Noise Complaint',
        other: 'Other Issue'
    };
    
    return types[type] || 'Other Issue';
}

/**
 * Format status for display
 * @param {string} status - Status
 * @returns {string} - Formatted status
 */
function formatStatus(status) {
    const statuses = {
        reported: 'Reported',
        under_review: 'Under Review',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        closed: 'Closed',
        proposed: 'Proposed',
        planning: 'Planning',
        completed: 'Completed'
    };
    
    return statuses[status] || status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
}

/**
 * Filter issues based on selected filters
 */
function filterIssues() {
    updateIssuesList();
}

/**
 * Vote for an issue
 * @param {string} issueId - Issue ID
 */
function voteForIssue(issueId) {
    // Vote for the issue
    const updatedIssue = citizenManager.voteForIssue(issueId);
    
    if (updatedIssue) {
        // Update the UI
        updateIssuesList();
        
        // Show notification
        showNotification('Vote recorded', 'Your vote has been recorded. Thank you for your input!', 'success');
    }
}

/**
 * Show issue details
 * @param {string} issueId - Issue ID
 */
function showIssueDetails(issueId) {
    // Get the issue
    const issue = citizenManager.getIssueById(issueId);
    
    if (!issue) return;
    
    // Get the modal
    const modal = document.getElementById('issue-details-modal');
    
    // Format date
    const reportedDate = new Date(issue.reportedAt);
    const formattedDate = reportedDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create updates HTML
    let updatesHtml = '';
    issue.updates.forEach(update => {
        const updateDate = new Date(update.timestamp);
        const formattedUpdateDate = updateDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        updatesHtml += `
            <div class="update-item">
                <div class="update-header">
                    <div class="update-status status-${update.status}">${formatStatus(update.status)}</div>
                    <div class="update-date">${formattedUpdateDate}</div>
                </div>
                <div class="update-message">${update.message}</div>
            </div>
        `;
    });
    
    // Create images HTML
    let imagesHtml = '';
    if (issue.images && issue.images.length > 0) {
        imagesHtml = '<div class="issue-images">';
        issue.images.forEach(image => {
            imagesHtml += `<img src="${image}" alt="Issue image" class="issue-image">`;
        });
        imagesHtml += '</div>';
    }
    
    // Set modal content
    modal.querySelector('.modal-content').innerHTML = `
        <div class="modal-header">
            <h2>${issue.title}</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="issue-details-container">
                <div class="issue-info">
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value status-${issue.status}">${formatStatus(issue.status)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${formatIssueType(issue.type)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Location:</span>
                        <span class="info-value">${issue.location.address}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Reported:</span>
                        <span class="info-value">${formattedDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Reported By:</span>
                        <span class="info-value">${issue.reportedBy.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Votes:</span>
                        <span class="info-value">${issue.votes}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Priority:</span>
                        <span class="info-value priority-${issue.priority}">${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</span>
                    </div>
                    ${issue.estimatedResolutionDate ? `
                    <div class="info-item">
                        <span class="info-label">Estimated Resolution:</span>
                        <span class="info-value">${new Date(issue.estimatedResolutionDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric'
                        })}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="issue-description-full">
                    <h3>Description</h3>
                    <p>${issue.description}</p>
                </div>
                
                ${imagesHtml}
                
                <div class="issue-map" id="issue-detail-map"></div>
                
                <div class="issue-updates">
                    <h3>Updates</h3>
                    <div class="updates-list">
                        ${updatesHtml}
                    </div>
                </div>
                
                <div class="issue-actions">
                    <button class="vote-button" data-id="${issue.id}">
                        <i class="fas fa-arrow-up"></i> Upvote (${issue.votes})
                    </button>
                    <button class="add-comment-button" data-id="${issue.id}">
                        <i class="far fa-comment"></i> Add Comment
                    </button>
                    <button class="share-button" data-id="${issue.id}">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.querySelector('.vote-button').addEventListener('click', () => {
        voteForIssue(issue.id);
        // Update vote count in modal
        const updatedIssue = citizenManager.getIssueById(issue.id);
        if (updatedIssue) {
            modal.querySelector('.vote-button').innerHTML = `<i class="fas fa-arrow-up"></i> Upvote (${updatedIssue.votes})`;
        }
    });
    
    // Show the modal
    modal.classList.add('active');
    
    // Initialize map if available
    if (window.L && issue.location.lat && issue.location.lng) {
        setTimeout(() => {
            const map = L.map('issue-detail-map').setView([issue.location.lat, issue.location.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            
            L.marker([issue.location.lat, issue.location.lng])
                .addTo(map)
                .bindPopup(issue.title)
                .openPopup();
        }, 300);
    }
}

/**
 * Submit an issue report
 */
function submitIssueReport() {
    // Get form data
    const issueType = document.getElementById('issue-type').value;
    const issueTitle = document.getElementById('issue-title').value;
    const issueDescription = document.getElementById('issue-description').value;
    const issueAddress = document.getElementById('issue-address').value;
    
    // Validate form data
    if (!issueType || !issueTitle || !issueDescription || !issueAddress) {
        showNotification('Error', 'Please fill in all required fields.', 'error');
        return;
    }
    
    // Create issue data object
    const issueData = {
        type: issueType,
        title: issueTitle,
        description: issueDescription,
        address: issueAddress,
        // In a real app, we would get the actual user data
        user: {
            id: 'user_001',
            name: 'Current User',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
    };
    
    // Add the issue
    const newIssue = citizenManager.addIssue(issueData);
    
    if (newIssue) {
        // Update the UI
        updateIssuesList();
        
        // Close the modal
        document.getElementById('report-issue-modal').classList.remove('active');
        
        // Reset the form
        document.getElementById('issue-form').reset();
        
        // Show notification
        showNotification('Issue Reported', 'Your issue has been successfully reported. Thank you for your contribution!', 'success');
        
        // Show the issue details
        showIssueDetails(newIssue.id);
    }
}

/**
 * Update the projects list in the UI
 */
function updateProjectsList() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    // Get filters
    const typeFilter = document.getElementById('project-type-filter').value;
    const statusFilter = document.getElementById('project-status-filter').value;
    
    // Create filters object
    const filters = {};
    if (typeFilter !== 'all') filters.type = typeFilter;
    if (statusFilter !== 'all') filters.status = statusFilter;
    
    // Get filtered projects
    const projects = citizenManager.getAllCommunityProjects(filters);
    
    // Clear the list
    projectsList.innerHTML = '';
    
    // Add projects to the list
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="empty-state">No projects found matching your filters.</div>';
    } else {
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    }
}

/**
 * Create a project card element
 * @param {Object} project - Project object
 * @returns {HTMLElement} - Project card element
 */
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);
    
    // Format date
    const startDate = new Date(project.startDate);
    const formattedStartDate = startDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Format budget
    const formattedBudget = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(project.budget);
    
    // Create card content
    card.innerHTML = `
        <div class="project-header">
            <div class="project-title">${project.title}</div>
            <div class="project-status status-${project.status}">${formatStatus(project.status)}</div>
        </div>
        <div class="project-image">
            <img src="${project.images[0] || 'https://placehold.co/800x400?text=Project+Image'}" alt="${project.title}">
        </div>
        <div class="project-details">
            <div class="project-location">
                <i class="fas fa-map-marker-alt"></i> ${project.location.address}
            </div>
            <div class="project-date">
                <i class="far fa-calendar-alt"></i> ${formattedStartDate}
            </div>
            <div class="project-type">
                <i class="fas fa-tag"></i> ${formatProjectType(project.type)}
            </div>
            <div class="project-budget">
                <i class="fas fa-dollar-sign"></i> ${formattedBudget}
            </div>
        </div>
        <div class="project-description">${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</div>
        <div class="project-impact-preview">
            <div class="impact-item" title="Environmental Benefit">
                <i class="fas fa-leaf"></i> ${project.impact.environmentalBenefit}%
            </div>
            <div class="impact-item" title="Community Benefit">
                <i class="fas fa-users"></i> ${project.impact.communityBenefit}%
            </div>
            <div class="impact-item" title="Economic Benefit">
                <i class="fas fa-chart-line"></i> ${project.impact.economicBenefit}%
            </div>
        </div>
        <div class="project-footer">
            <div class="project-votes">
                <button class="vote-button" data-id="${project.id}">
                    <i class="fas fa-arrow-up"></i> Support
                </button>
                <span class="vote-count">${project.votes} supporters</span>
            </div>
            <button class="view-details-button" data-id="${project.id}">View Details</button>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.vote-button').addEventListener('click', (e) => {
        e.stopPropagation();
        voteForProject(project.id);
    });
    
    card.querySelector('.view-details-button').addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectDetails(project.id);
    });
    
    return card;
}

/**
 * Format project type for display
 * @param {string} type - Project type
 * @returns {string} - Formatted project type
 */
function formatProjectType(type) {
    const types = {
        park: 'Park & Recreation',
        infrastructure: 'Infrastructure',
        community: 'Community Facility',
        environment: 'Environmental',
        safety: 'Public Safety',
        education: 'Education'
    };
    
    return types[type] || 'Community Project';
}

/**
 * Filter projects based on selected filters
 */
function filterProjects() {
    updateProjectsList();
}

/**
 * Vote for a project
 * @param {string} projectId - Project ID
 */
function voteForProject(projectId) {
    // Vote for the project
    const updatedProject = citizenManager.voteForProject(projectId);
    
    if (updatedProject) {
        // Update the UI
        updateProjectsList();
        
        // Show notification
        showNotification('Support Recorded', 'Your support has been recorded. Thank you for your input!', 'success');
    }
}

/**
 * Show project details
 * @param {string} projectId - Project ID
 */
function showProjectDetails(projectId) {
    // Get the project
    const project = citizenManager.getProjectById(projectId);
    
    if (!project) return;
    
    // Get the modal
    const modal = document.getElementById('project-details-modal');
    
    // Format dates
    const startDate = new Date(project.startDate);
    const formattedStartDate = startDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    });
    
    let formattedEndDate = 'TBD';
    if (project.endDate) {
        const endDate = new Date(project.endDate);
        formattedEndDate = endDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    }
    
    // Format budget
    const formattedBudget = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(project.budget);
    
    // Create updates HTML
    let updatesHtml = '';
    project.updates.forEach(update => {
        const updateDate = new Date(update.timestamp);
        const formattedUpdateDate = updateDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        updatesHtml += `
            <div class="update-item">
                <div class="update-header">
                    <div class="update-status status-${update.status}">${formatStatus(update.status)}</div>
                    <div class="update-date">${formattedUpdateDate}</div>
                </div>
                <div class="update-message">${update.message}</div>
            </div>
        `;
    });
    
    // Create images HTML
    let imagesHtml = '';
    if (project.images && project.images.length > 0) {
        imagesHtml = '<div class="project-images-gallery">';
        project.images.forEach(image => {
            imagesHtml += `<img src="${image}" alt="Project image" class="project-image">`;
        });
        imagesHtml += '</div>';
    }
    
    // Create impact metrics HTML
    let impactMetricsHtml = '';
    for (const [key, value] of Object.entries(project.impact.metrics)) {
        const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase words
        
        impactMetricsHtml += `
            <div class="metric-item">
                <span class="metric-label">${formattedKey}:</span>
                <span class="metric-value">${typeof value === 'number' && !key.includes('Reduction') && !key.includes('Improvement') ? value.toLocaleString() : value}${key.includes('Reduction') || key.includes('Improvement') || key.includes('Increase') ? '%' : ''}</span>
            </div>
        `;
    }
    
    // Set modal content
    modal.querySelector('.modal-content').innerHTML = `
        <div class="modal-header">
            <h2>${project.title}</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="project-details-container">
                ${imagesHtml}
                
                <div class="project-info">
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value status-${project.status}">${formatStatus(project.status)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${formatProjectType(project.type)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Location:</span>
                        <span class="info-value">${project.location.address}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Start Date:</span>
                        <span class="info-value">${formattedStartDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">End Date:</span>
                        <span class="info-value">${formattedEndDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Budget:</span>
                        <span class="info-value">${formattedBudget}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Supporters:</span>
                        <span class="info-value">${project.votes}</span>
                    </div>
                    ${project.proposedBy ? `
                    <div class="info-item">
                        <span class="info-label">Proposed By:</span>
                        <span class="info-value">${project.proposedBy.name}</span>
                    </div>
                    ` : ''}
                    ${project.managedBy ? `
                    <div class="info-item">
                        <span class="info-label">Managed By:</span>
                        <span class="info-value">${project.managedBy}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="project-description-full">
                    <h3>Description</h3>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-map" id="project-detail-map"></div>
                
                <div class="project-impact">
                    <h3>Project Impact</h3>
                    <div class="impact-overview">
                        <div class="impact-chart">
                            <div class="chart-item">
                                <div class="chart-label">Environmental</div>
                                <div class="chart-bar">
                                    <div class="chart-fill" style="width: ${project.impact.environmentalBenefit}%;"></div>
                                </div>
                                <div class="chart-value">${project.impact.environmentalBenefit}%</div>
                            </div>
                            <div class="chart-item">
                                <div class="chart-label">Community</div>
                                <div class="chart-bar">
                                    <div class="chart-fill" style="width: ${project.impact.communityBenefit}%;"></div>
                                </div>
                                <div class="chart-value">${project.impact.communityBenefit}%</div>
                            </div>
                            <div class="chart-item">
                                <div class="chart-label">Economic</div>
                                <div class="chart-bar">
                                    <div class="chart-fill" style="width: ${project.impact.economicBenefit}%;"></div>
                                </div>
                                <div class="chart-value">${project.impact.economicBenefit}%</div>
                            </div>
                        </div>
                        <div class="impact-stats">
                            <div class="stat-item">
                                <div class="stat-value">${project.impact.peopleServed.toLocaleString()}</div>
                                <div class="stat-label">People Served</div>
                            </div>
                        </div>
                    </div>
                    <div class="impact-metrics">
                        <h4>Detailed Metrics</h4>
                        <div class="metrics-list">
                            ${impactMetricsHtml}
                        </div>
                    </div>
                </div>
                
                <div class="project-updates">
                    <h3>Project Updates</h3>
                    <div class="updates-list">
                        ${updatesHtml}
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="vote-button" data-id="${project.id}">
                        <i class="fas fa-arrow-up"></i> Support (${project.votes})
                    </button>
                    <button class="add-comment-button" data-id="${project.id}">
                        <i class="far fa-comment"></i> Add Comment
                    </button>
                    <button class="share-button" data-id="${project.id}">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.querySelector('.vote-button').addEventListener('click', () => {
        voteForProject(project.id);
        // Update vote count in modal
        const updatedProject = citizenManager.getProjectById(project.id);
        if (updatedProject) {
            modal.querySelector('.vote-button').innerHTML = `<i class="fas fa-arrow-up"></i> Support (${updatedProject.votes})`;
        }
    });
    
    // Show the modal
    modal.classList.add('active');
    
    // Initialize map if available
    if (window.L && project.location.lat && project.location.lng) {
        setTimeout(() => {
            const map = L.map('project-detail-map').setView([project.location.lat, project.location.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            
            L.marker([project.location.lat, project.location.lng])
                .addTo(map)
                .bindPopup(project.title)
                .openPopup();
        }, 300);
    }
}

/**
 * Submit a project proposal
 */
function submitProjectProposal() {
    // Get form data
    const projectType = document.getElementById('project-type').value;
    const projectTitle = document.getElementById('project-title').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectAddress = document.getElementById('project-address').value;
    const projectBudget = parseInt(document.getElementById('project-budget').value, 10) || 100000;
    
    // Validate form data
    if (!projectType || !projectTitle || !projectDescription || !projectAddress) {
        showNotification('Error', 'Please fill in all required fields.', 'error');
        return;
    }
    
    // Create project data object
    const projectData = {
        type: projectType,
        title: projectTitle,
        description: projectDescription,
        address: projectAddress,
        budget: projectBudget,
        // In a real app, we would get the actual user data
        user: {
            id: 'user_001',
            name: 'Current User',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
    };
    
    // Add the project
    const newProject = citizenManager.addProject(projectData);
    
    if (newProject) {
        // Update the UI
        updateProjectsList();
        
        // Close the modal
        document.getElementById('propose-project-modal').classList.remove('active');
        
        // Reset the form
        document.getElementById('project-form').reset();
        
        // Show notification
        showNotification('Project Proposed', 'Your project proposal has been submitted. Thank you for your contribution!', 'success');
        
        // Show the project details
        showProjectDetails(newProject.id);
    }
}

/**
 * Update the notifications list in the UI
 */
function updateNotificationsList() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;
    
    // Get notifications
    const notifications = citizenManager.getAllNotifications();
    
    // Clear the list
    notificationsList.innerHTML = '';
    
    // Add notifications to the list
    if (notifications.length === 0) {
        notificationsList.innerHTML = '<div class="empty-state">No notifications at this time.</div>';
    } else {
        notifications.forEach(notification => {
            const notificationItem = createNotificationItem(notification);
            notificationsList.appendChild(notificationItem);
        });
    }
    
    // Update notification badge
    updateNotificationBadge();
}

/**
 * Create a notification item element
 * @param {Object} notification - Notification object
 * @returns {HTMLElement} - Notification item element
 */
function createNotificationItem(notification) {
    const item = document.createElement('div');
    item.className = 'notification-item';
    if (!notification.read) {
        item.classList.add('unread');
    }
    item.setAttribute('data-id', notification.id);
    
    // Format date
    const notificationDate = new Date(notification.timestamp);
    const formattedDate = notificationDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create item content
    item.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-date">${formattedDate}</div>
        </div>
        <div class="notification-message">${notification.message}</div>
        <div class="notification-actions">
            <button class="mark-read-button" data-id="${notification.id}" ${notification.read ? 'disabled' : ''}>
                <i class="far ${notification.read ? 'fa-check-circle' : 'fa-circle'}"></i> ${notification.read ? 'Read' : 'Mark as Read'}
            </button>
            ${notification.actionUrl ? `
            <a href="${notification.actionUrl}" class="action-link">
                <i class="fas fa-external-link-alt"></i> View
            </a>
            ` : ''}
        </div>
    `;
    
    // Add event listeners
    item.querySelector('.mark-read-button').addEventListener('click', () => {
        markNotificationAsRead(notification.id);
    });
    
    return item;
}

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 */
function markNotificationAsRead(notificationId) {
    // Mark the notification as read
    const updatedNotification = citizenManager.markNotificationAsRead(notificationId);
    
    if (updatedNotification) {
        // Update the UI
        const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.classList.remove('unread');
            const markReadButton = notificationItem.querySelector('.mark-read-button');
            markReadButton.innerHTML = '<i class="far fa-check-circle"></i> Read';
            markReadButton.disabled = true;
        }
        
        // Update notification badge
        updateNotificationBadge();
    }
}

/**
 * Mark all notifications as read
 */
function markAllNotificationsAsRead() {
    // Get all unread notifications
    const unreadNotifications = citizenManager.getAllNotifications({ read: false });
    
    // Mark each notification as read
    unreadNotifications.forEach(notification => {
        citizenManager.markNotificationAsRead(notification.id);
    });
    
    // Update the UI
    updateNotificationsList();
    
    // Show notification
    if (unreadNotifications.length > 0) {
        showNotification('Notifications Cleared', 'All notifications have been marked as read.', 'success');
    }
}

/**
 * Update the notification badge count
 */
function updateNotificationBadge() {
    // Get unread notifications count
    const unreadCount = citizenManager.getAllNotifications({ read: false }).length;
    
    // Update badge
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

/**
 * Show a notification message
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(title, message, type = 'info') {
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${title}</div>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add event listener for close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
}

// Export functions for module use
export {
    initCitizenEngagement,
    citizenManager
};