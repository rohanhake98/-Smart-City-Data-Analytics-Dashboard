/**
 * Smart City Data Analytics Dashboard - Main JavaScript
 * This file contains the core functionality for the dashboard
 */

// Global variables
let currentSection = 'map-section';
let currentDate = new Date();

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the clock
    initializeClock();
    
    // Set current date in date picker
    document.getElementById('date-selector').valueAsDate = new Date();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize modals
    initializeModals();
    
    // Initialize event listeners
    initializeEventListeners();
});

/**
 * Initialize the real-time clock
 */
function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Update the clock with current time
 */
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('current-time').textContent = timeString;
}

/**
 * Initialize sidebar navigation
 */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the section to show
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            document.querySelectorAll('.content-sections section').forEach(section => {
                section.classList.remove('active-section');
            });
            
            // Show the selected section
            document.getElementById(sectionId).classList.add('active-section');
            
            // Update current section
            currentSection = sectionId;
        });
    });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
    // Report Issue Modal
    const reportIssueBtn = document.getElementById('report-issue-btn');
    const reportIssueModal = document.getElementById('report-issue-modal');
    const closeIssueModal = reportIssueModal.querySelector('.close-modal');
    const cancelIssueBtn = reportIssueModal.querySelector('.cancel-btn');
    
    reportIssueBtn.addEventListener('click', () => {
        reportIssueModal.style.display = 'flex';
    });
    
    closeIssueModal.addEventListener('click', () => {
        reportIssueModal.style.display = 'none';
    });
    
    cancelIssueBtn.addEventListener('click', () => {
        reportIssueModal.style.display = 'none';
    });
    
    // Report Incident Modal
    const reportIncidentBtn = document.getElementById('new-incident-btn');
    const reportIncidentModal = document.getElementById('report-incident-modal');
    const closeIncidentModal = reportIncidentModal.querySelector('.close-modal');
    const cancelIncidentBtn = reportIncidentModal.querySelector('.cancel-btn');
    
    reportIncidentBtn.addEventListener('click', () => {
        reportIncidentModal.style.display = 'flex';
    });
    
    closeIncidentModal.addEventListener('click', () => {
        reportIncidentModal.style.display = 'none';
    });
    
    cancelIncidentBtn.addEventListener('click', () => {
        reportIncidentModal.style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === reportIssueModal) {
            reportIssueModal.style.display = 'none';
        }
        if (e.target === reportIncidentModal) {
            reportIncidentModal.style.display = 'none';
        }
    });
    
    // Form submissions
    const issueForm = document.getElementById('issue-report-form');
    const incidentForm = document.getElementById('incident-report-form');
    
    issueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Process the form data
        const formData = new FormData(issueForm);
        console.log('Issue report submitted:', Object.fromEntries(formData));
        
        // Show success message
        alert('Thank you for your report! Your issue has been submitted successfully.');
        
        // Close the modal and reset form
        reportIssueModal.style.display = 'none';
        issueForm.reset();
    });
    
    incidentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Process the form data
        const formData = new FormData(incidentForm);
        console.log('Incident report submitted:', Object.fromEntries(formData));
        
        // Show success message
        alert('Emergency incident reported! Responders have been notified.');
        
        // Close the modal and reset form
        reportIncidentModal.style.display = 'none';
        incidentForm.reset();
    });
}

/**
 * Initialize various event listeners
 */
function initializeEventListeners() {
    // Date selector change
    const dateSelector = document.getElementById('date-selector');
    dateSelector.addEventListener('change', function() {
        currentDate = new Date(this.value);
        console.log('Date changed to:', currentDate);
        // Update data based on new date
        updateDashboardData(currentDate);
    });
    
    // Layer buttons in map section
    const layerButtons = document.querySelectorAll('.layer-btn');
    layerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            layerButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the layer to show
            const layerType = this.getAttribute('data-layer');
            console.log('Switching to layer:', layerType);
            
            // Update map layer (this function will be defined in map.js)
            if (typeof switchMapLayer === 'function') {
                switchMapLayer(layerType);
            }
        });
    });
    
    // Environment time controls
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the time horizon
            const timeHorizon = this.getAttribute('data-time');
            console.log('Switching to time horizon:', timeHorizon);
            
            // Update environment data (this function will be defined in environment.js)
            if (typeof updateEnvironmentData === 'function') {
                updateEnvironmentData(timeHorizon);
            }
        });
    });
    
    // Transport filter buttons
    const transportButtons = document.querySelectorAll('.transport-btn');
    transportButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            transportButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the transport type
            const transportType = this.getAttribute('data-transport');
            console.log('Filtering transport by:', transportType);
            
            // Update transport data (this function will be defined in transport.js)
            if (typeof filterTransportData === 'function') {
                filterTransportData(transportType);
            }
        });
    });
    
    // Route optimization form
    const optimizeRouteBtn = document.getElementById('optimize-route-btn');
    if (optimizeRouteBtn) {
        optimizeRouteBtn.addEventListener('click', function() {
            const start = document.getElementById('route-start').value;
            const end = document.getElementById('route-end').value;
            
            if (start && end) {
                console.log('Optimizing route from', start, 'to', end);
                // Call route optimization function (defined in traffic.js)
                if (typeof findOptimalRoute === 'function') {
                    findOptimalRoute(start, end);
                }
            } else {
                alert('Please enter both starting point and destination.');
            }
        });
    }
    
    // Journey planner form
    const planJourneyBtn = document.getElementById('plan-journey-btn');
    if (planJourneyBtn) {
        planJourneyBtn.addEventListener('click', function() {
            const start = document.getElementById('journey-start').value;
            const end = document.getElementById('journey-end').value;
            const wheelchairAccess = document.getElementById('wheelchair-access').checked;
            const fewerTransfers = document.getElementById('fewer-transfers').checked;
            
            if (start && end) {
                console.log('Planning journey from', start, 'to', end);
                console.log('Options:', { wheelchairAccess, fewerTransfers });
                // Call journey planning function (defined in transport.js)
                if (typeof planJourney === 'function') {
                    planJourney(start, end, { wheelchairAccess, fewerTransfers });
                }
            } else {
                alert('Please enter both starting point and destination.');
            }
        });
    }
    
    // Incident filter
    const incidentFilter = document.getElementById('incident-filter');
    if (incidentFilter) {
        incidentFilter.addEventListener('change', function() {
            const filterValue = this.value;
            console.log('Filtering incidents by:', filterValue);
            // Call incident filtering function (defined in emergency.js)
            if (typeof filterIncidents === 'function') {
                filterIncidents(filterValue);
            }
        });
    }
    
    // Issue filter
    const issueFilter = document.getElementById('issue-filter');
    if (issueFilter) {
        issueFilter.addEventListener('change', function() {
            const filterValue = this.value;
            console.log('Filtering issues by:', filterValue);
            // Call issue filtering function (defined in citizen.js)
            if (typeof filterIssues === 'function') {
                filterIssues(filterValue);
            }
        });
    }
    
    // Location search
    const searchBtn = document.getElementById('search-btn');
    const locationSearch = document.getElementById('location-search');
    
    searchBtn.addEventListener('click', function() {
        const searchQuery = locationSearch.value.trim();
        if (searchQuery) {
            console.log('Searching for location:', searchQuery);
            // Call search function (defined in map.js)
            if (typeof searchLocation === 'function') {
                searchLocation(searchQuery);
            }
        }
    });
    
    locationSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // Use current location buttons
    const useLocationBtn = document.getElementById('use-current-location');
    const incidentLocationBtn = document.getElementById('incident-use-location');
    
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', function() {
            getCurrentLocation(function(location) {
                document.getElementById('issue-location').value = `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`;
            });
        });
    }
    
    if (incidentLocationBtn) {
        incidentLocationBtn.addEventListener('click', function() {
            getCurrentLocation(function(location) {
                document.getElementById('incident-location').value = `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`;
            });
        });
    }
}

/**
 * Get current geolocation
 * @param {Function} callback - Function to call with location data
 */
function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                callback(location);
            },
            function(error) {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enter it manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
}

/**
 * Update dashboard data based on selected date
 * @param {Date} date - The selected date
 */
function updateDashboardData(date) {
    // This function will call the appropriate update functions for each section
    // based on the currently active section
    
    console.log('Updating dashboard data for date:', date);
    
    switch (currentSection) {
        case 'map-section':
            if (typeof updateMapData === 'function') {
                updateMapData(date);
            }
            break;
        case 'traffic-section':
            if (typeof updateTrafficData === 'function') {
                updateTrafficData(date);
            }
            break;
        case 'environment-section':
            if (typeof updateEnvironmentDataByDate === 'function') {
                updateEnvironmentDataByDate(date);
            }
            break;
        case 'transport-section':
            if (typeof updateTransportData === 'function') {
                updateTransportData(date);
            }
            break;
        case 'emergency-section':
            if (typeof updateEmergencyData === 'function') {
                updateEmergencyData(date);
            }
            break;
        case 'citizen-section':
            if (typeof updateCitizenData === 'function') {
                updateCitizenData(date);
            }
            break;
    }
}

/**
 * Show a notification to the user
 * @param {string} message - The notification message
 * @param {string} type - The type of notification (success, warning, error)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Format a date for display
 * @param {Date} date - The date to format
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
 * Format a time for display
 * @param {Date} date - The date containing the time to format
 * @returns {string} - Formatted time string
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Generate a random ID
 * @returns {string} - Random ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Export functions for use in other modules
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.generateId = generateId;
window.debounce = debounce;
window.getCurrentLocation = getCurrentLocation;