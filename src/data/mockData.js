// ======================================
// ROADPULSE AI — MOCK / DEMO DATA
// Chennai, Tamil Nadu
// ======================================

// Chennai key landmarks coords:
// Central Station: 13.0827, 80.2707
// T. Nagar:        13.0400, 80.2337
// Anna Nagar:      13.0850, 80.2101
// Mylapore:        13.0336, 80.2675
// Adyar:           13.0063, 80.2574
// Velachery:       12.9815, 80.2180
// Perambur:        13.1170, 80.2520
// Royapuram:       13.1100, 80.2890

export const DAMAGE_REPORTS = [
    {
        id: 'RPT-001',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=200&q=80',
        type: 'Pothole',
        severity: 'critical',
        location: 'Anna Salai (Mount Road), near Signal 7',
        lat: 13.0602, lng: 80.2495,
        date: '2026-02-24',
        status: 'assigned',
        assignedTo: 'Team Alpha',
        reportedBy: 'citizen@demo.com',
        description: 'Large pothole causing vehicle damage near bus stop',
        aiConfidence: 97,
    },
    {
        id: 'RPT-002',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
        type: 'Road Crack',
        severity: 'severe',
        location: 'GST Road, Chromepet Junction',
        lat: 12.9526, lng: 80.1429,
        date: '2026-02-23',
        status: 'inprogress',
        assignedTo: 'Team Beta',
        reportedBy: 'citizen@demo.com',
        description: 'Deep longitudinal crack spanning 20 meters',
        aiConfidence: 92,
    },
    {
        id: 'RPT-003',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80',
        type: 'Surface Damage',
        severity: 'moderate',
        location: 'T. Nagar, Usman Road',
        lat: 13.0400, lng: 80.2337,
        date: '2026-02-22',
        status: 'reported',
        assignedTo: null,
        reportedBy: 'citizen@demo.com',
        description: 'Multiple surface cracks and loose asphalt',
        aiConfidence: 85,
    },
    {
        id: 'RPT-004',
        image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=200&q=80',
        type: 'Pothole',
        severity: 'minor',
        location: 'Mylapore, Luz Church Road',
        lat: 13.0336, lng: 80.2675,
        date: '2026-02-21',
        status: 'repaired',
        assignedTo: 'Team Gamma',
        reportedBy: 'user@demo.com',
        description: 'Small pothole at pedestrian crossing',
        aiConfidence: 88,
    },
    {
        id: 'RPT-005',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=200&q=80',
        type: 'Alligator Crack',
        severity: 'critical',
        location: 'Perambur Barracks Road, Gate 2',
        lat: 13.1170, lng: 80.2520,
        date: '2026-02-20',
        status: 'assigned',
        assignedTo: 'Team Alpha',
        reportedBy: 'admin@demo.com',
        description: 'Severe alligator cracking over 100 sq ft',
        aiConfidence: 99,
    },
    {
        id: 'RPT-006',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80',
        type: 'Edge Break',
        severity: 'severe',
        location: 'Adyar Bridge Road, Marina End',
        lat: 13.0063, lng: 80.2574,
        date: '2026-02-19',
        status: 'inprogress',
        assignedTo: 'Team Beta',
        reportedBy: 'user2@demo.com',
        description: 'Edge of road crumbling near bridge approach',
        aiConfidence: 91,
    },
    {
        id: 'RPT-007',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=200&q=80',
        type: 'Pothole',
        severity: 'moderate',
        location: 'Anna Nagar, 6th Main Road',
        lat: 13.0850, lng: 80.2101,
        date: '2026-02-18',
        status: 'reported',
        assignedTo: null,
        reportedBy: 'citizen@demo.com',
        description: 'Two potholes near school zone',
        aiConfidence: 90,
    },
    {
        id: 'RPT-008',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
        type: 'Manhole Issue',
        severity: 'severe',
        location: 'Royapuram Fish Market Circle',
        lat: 13.1100, lng: 80.2890,
        date: '2026-02-17',
        status: 'repaired',
        assignedTo: 'Team Delta',
        reportedBy: 'admin@demo.com',
        description: 'Exposed manhole rim causing accidents',
        aiConfidence: 94,
    },
];

export const MAINTENANCE_TASKS = [
    {
        id: 'TASK-001',
        reportId: 'RPT-001',
        title: 'Critical Pothole - Anna Salai',
        severity: 'critical',
        location: 'Anna Salai (Mount Road), near Signal 7',
        lat: 13.0602, lng: 80.2495,
        priority: 1,
        distance: '1.2 km',
        assignedTo: 'Team Alpha',
        status: 'assigned',
        dueDate: '2026-02-25',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80',
        description: 'Large pothole causing vehicle damage. Immediate repair required.',
    },
    {
        id: 'TASK-002',
        reportId: 'RPT-002',
        title: 'Road Crack - GST Road',
        severity: 'severe',
        location: 'GST Road, Chromepet Junction',
        lat: 12.9526, lng: 80.1429,
        priority: 2,
        distance: '3.5 km',
        assignedTo: 'Team Alpha',
        status: 'inprogress',
        dueDate: '2026-02-26',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        description: 'Deep longitudinal crack spanning 20 meters on highway.',
    },
    {
        id: 'TASK-003',
        reportId: 'RPT-005',
        title: 'Alligator Crack - Perambur',
        severity: 'critical',
        location: 'Perambur Barracks Road, Gate 2',
        lat: 13.1170, lng: 80.2520,
        priority: 1,
        distance: '5.8 km',
        assignedTo: 'Team Alpha',
        status: 'assigned',
        dueDate: '2026-02-25',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&q=80',
        description: 'Severe alligator cracking over 100 sq ft area.',
    },
    {
        id: 'TASK-004',
        reportId: 'RPT-006',
        title: 'Edge Break - Adyar Bridge',
        severity: 'severe',
        location: 'Adyar Bridge Road, Marina End',
        lat: 13.0063, lng: 80.2574,
        priority: 2,
        distance: '7.2 km',
        assignedTo: 'Team Alpha',
        status: 'inprogress',
        dueDate: '2026-02-28',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
        description: 'Edge of road crumbling near bridge approach.',
    },
];

export const ALERTS = [
    {
        id: 'ALT-001',
        type: 'critical',
        icon: '🚨',
        title: 'Critical Pothole Detected',
        message: 'AI detected a severe pothole at Anna Salai with 97% confidence',
        location: 'Anna Salai (Mount Road), near Signal 7',
        time: '2 min ago',
        read: false,
    },
    {
        id: 'ALT-002',
        type: 'warning',
        icon: '⚠️',
        title: 'Repeated Reports — Same Location',
        message: '5 reports received from GST Road, Chromepet in the last 24 hours',
        location: 'GST Road, Chromepet Junction',
        time: '18 min ago',
        read: false,
    },
    {
        id: 'ALT-003',
        type: 'critical',
        icon: '🚧',
        title: 'Repair Overdue',
        message: 'Perambur alligator crack repair is 3 days overdue',
        location: 'Perambur Barracks Road, Gate 2',
        time: '1 hr ago',
        read: false,
    },
    {
        id: 'ALT-004',
        type: 'warning',
        icon: '📍',
        title: 'New Damage Cluster',
        message: 'Hotspot detected: 8 reports within 500m radius in T. Nagar',
        location: 'T. Nagar, Chennai',
        time: '2 hr ago',
        read: true,
    },
    {
        id: 'ALT-005',
        type: 'info',
        icon: '✅',
        title: 'Repair Completed',
        message: 'Team Gamma completed pothole repair at Mylapore Luz Church Road',
        location: 'Mylapore, Luz Church Road',
        time: '3 hr ago',
        read: true,
    },
    {
        id: 'ALT-006',
        type: 'critical',
        icon: '🚨',
        title: 'Critical Alligator Crack',
        message: 'New critical damage report in Perambur — immediate action needed',
        location: 'Perambur Barracks Road, Gate 2',
        time: '5 hr ago',
        read: true,
    },
];

export const SEVERITY_CHART_DATA = [
    { name: 'Critical', value: 28, color: '#ff4444' },
    { name: 'Severe', value: 35, color: '#ff6600' },
    { name: 'Moderate', value: 22, color: '#ffaa00' },
    { name: 'Minor', value: 15, color: '#00cc66' },
];

export const REPAIR_TIMELINE_DATA = [
    { month: 'Sep', reported: 42, repaired: 38 },
    { month: 'Oct', reported: 58, repaired: 45 },
    { month: 'Nov', reported: 35, repaired: 50 },
    { month: 'Dec', reported: 67, repaired: 55 },
    { month: 'Jan', reported: 80, repaired: 60 },
    { month: 'Feb', reported: 65, repaired: 72 },
];

export const HOTSPOT_DATA = [
    { zone: 'Anna Salai', reports: 42, critical: 8 },
    { zone: 'GST Road', reports: 35, critical: 5 },
    { zone: 'Perambur', reports: 28, critical: 7 },
    { zone: 'T. Nagar', reports: 22, critical: 3 },
    { zone: 'Adyar Bridge', reports: 18, critical: 4 },
    { zone: 'Mylapore', reports: 14, critical: 1 },
];

export const EFFICIENCY_DATA = [
    { week: 'W1', efficiency: 72 },
    { week: 'W2', efficiency: 78 },
    { week: 'W3', efficiency: 65 },
    { week: 'W4', efficiency: 85 },
    { week: 'W5', efficiency: 90 },
    { week: 'W6', efficiency: 88 },
];

export const MAINTENANCE_CREWS = [
    { id: 'TEAM-A', name: 'Team Alpha', members: 5, available: true, activeJobs: 2 },
    { id: 'TEAM-B', name: 'Team Beta', members: 4, available: true, activeJobs: 1 },
    { id: 'TEAM-C', name: 'Team Gamma', members: 6, available: false, activeJobs: 3 },
    { id: 'TEAM-D', name: 'Team Delta', members: 3, available: true, activeJobs: 0 },
];

// Chennai: Anna Salai area safe-route hazards
export const SAFE_ROUTE_HAZARDS = [
    { id: 1, lat: 13.0602, lng: 80.2495, name: 'Critical Pothole', severity: 'critical', distance: '500m from route' },
    { id: 2, lat: 12.9526, lng: 80.1429, name: 'Road Crack', severity: 'severe', distance: 'On route — caution' },
    { id: 3, lat: 13.0400, lng: 80.2337, name: 'Surface Damage', severity: 'moderate', distance: '200m from route' },
];

// Chennai centre: ~13.0827, 80.2707
export const MAP_CENTER = [13.0627, 80.2300]; // central Chennai viewport

export const ADMIN_STATS = {
    totalDamages: 156,
    criticalIssues: 28,
    repairsCompleted: 87,
    repairPercentage: 68,
    avgRepairTime: '2.4 days',
    activeCrews: 4,
    pendingAssignment: 12,
};

export const CITIZEN_STATS = {
    nearbyHazards: 7,
    myReports: 4,
    criticalNearby: 2,
    activeAlerts: 3,
};
