

const states = [
    {key : '' , value : 'Select State'},
    {key : 'NY' , value : 'New York'},
    {key : 'AL' , value : 'Alabama'},
    {key : 'AK' , value : 'Alaska'},
    {key : 'AZ' , value : 'Arizona'},
    {key : 'AR' , value : 'Arkansas'},
    {key : 'CA' , value : 'California'},
    {key : 'CO' , value : 'Colorado '},
    {key : 'CT' , value : 'Connecticut'},
    {key : 'DE' , value : 'Delaware'},
    {key : 'FL' , value : 'Florida'},
    {key : 'GA' , value : 'Georgia'},
    {key : 'HI' , value : 'Hawaii'},
    {key : 'ID' , value : 'Idaho'},
    {key : 'IL' , value : 'Illinois'},
    {key : 'IN' , value : 'Indiana'},
    {key : 'IA' , value : 'Iowa'},
    {key : 'KS' , value : 'Kansas'},
    {key : 'KY' , value : 'Kentucky'},
    {key : 'LA' , value : 'Louisiana'},
    {key : 'ME' , value : 'Maine'},
    {key : 'MD' , value : 'Maryland'},
    {key : 'MA' , value : 'Massachusetts'},
    {key : 'MI' , value : 'Michigan'},
    {key : 'MN' , value : 'Minnesota'},
    {key : 'MS' , value : 'Mississippi'},
    {key : 'MO' , value : 'Missouri'},
    {key : 'MT' , value : 'Montana'},
    {key : 'NE' , value : 'Nebraska'},
    {key : 'NV' , value : 'Nevada'},
    {key : 'NH' , value : 'New Hampshire'},
    {key : 'NJ' , value : 'New Jersey'},
    {key : 'NM' , value : 'New Mexico'},
    {key : 'NC' , value : 'North Carolina'},
    {key : 'ND' , value : 'North Dakota'},
    {key : 'OH' , value : 'Ohio'},
    {key : 'OK' , value : 'Oklahoma'},
    {key : 'OR' , value : 'Oregon'},
    {key : 'PA' , value : 'Pennsylvania'},
    {key : 'RI' , value : 'Rhode Island'},
    {key : 'SC' , value : 'South Carolina'},
    {key : 'SD' , value : 'South Dakota'},
    {key : 'TN' , value : 'Tennessee'},
    {key : 'TX' , value : 'Texas'},
    {key : 'UT' , value : 'Utah'},
    {key : 'VT' , value : 'Vermont'},
    {key : 'VA' , value : 'Virginia'},
    {key : 'WA' , value : 'Washington'},
    {key : 'WV' , value : 'West Virginia'},
    {key : 'WI' , value : 'Wisconsin'},
    {key : 'WY' , value : 'Wyoming'}
];

const operationTypes = [
    {key : 1, value : 'Interstate'},
    {key : 2, value : 'Intrastate Hazmat'},
    {key : 3, value : 'Intrastate Non-Hazmat'}
];

const equipmentTypes = [
    {key : 'dryVan', value : 'Dry Van Trailer'},
    {key : 'flatbed', value : 'Flatbed Trailer'},
    {key : 'stepDeck', value : 'Step Deck Trailer'},
    {key : 'conestoga', value : 'Conestoga Trailer'},
    {key : 'stretchRgn', value : 'Stretch RGN Trailer'},
    {key : 'powerUnit', value : 'Power Unit'},
    {key : 'carHauler', value : 'Car Hauler'},
    {key : 'refrigerated', value : 'Refrigerated Box Truck'},
    {key : 'lowboy', value : 'Lowboy Trailer'},
    {key : 'rgn', value : 'RGN Trailer'},
    {key : 'tanker', value : 'Tanker'},
    {key : 'hazmat', value : 'Hazmat'}
];

const shipmentEquipmentTypes = [
    {key : 'dryVan', value : 'Dry Van Trailer', id: 1},
    {key : 'flatbed', value : 'Flatbed Trailer', id: 2},
    {key : 'stepDeck', value : 'Step Deck Trailer', id: 3},
    {key : 'conestoga', value : 'Conestoga Trailer', id: 4},
    {key : 'rgn', value : 'RGN Trailer', id: 5},
    {key : 'stretchRgn', value : 'Stretch RGN Trailer', id: 6},
    {key : 'lowboy', value : 'Lowboy Trailer', id: 7},
    {key : 'refrigerated', value : 'Refrigerated Trailer', id: 8},
    {key : 'powerUnit', value : 'Power Unit', id: 9},
    {key : 'tank', value : 'Tank Trailer', id: 10},
    {key : 'refrigerated', value : 'Refrigerated Box Truck', id: 11},
]

const statusList = [
    {id: 3, name: "Available", type:"Inactive", colorClass:"stats_available" },
    {id: 6, name: "Active", type:"Inactive", colorClass:"stats_inTransit" },
    {id: 1, name: "Invited", type:"Inactive", colorClass:"stats_invited" },
    {id: 2, name: "Suspended", type:"Inactive", colorClass:"stats_suspend" },
];

const shipmentTabTypes = [
    {key : 'availableToBid', value : 'Available To Bid', class : 'txt_p', count : 0},
    {key : 'currentBids', value : 'Active Bidding', class : 'txt_p', count : 0},
    {key : 'offerRate', value : 'Offer Rate', class : 'txt_d', count : 0},
    {key : 'offerRateConfirmed', value : 'Offer Rate Confirm', class : 'txt_y', count : 0}, 

    {key : 'inProgress', value : 'In-Transit', class : 'txt_p', count : 0},
    {key : 'upcoming', value : 'Confirmed', class : 'txt_y', count : 0},
    {key : 'past', value : 'Completed', class : 'txt_s', count : 0},
    {key : 'pending', value : 'Awaiting', class : 'txt_d', count : 0},
    {key : 'dispute', value : 'Dispute', class : 'txt_y', count : 0},
   
];

const driverTabTypes = [
    {key : 'active', value : 'Active', class : 'txt_p', count : 0},
    {key : 'available', value : 'Available', class : 'txt_s', count : 0},
    {key : 'invited', value : 'Invited', class : 'txt_p', count : 0},
    {key : 'suspended', value : 'Suspended', class : 'txt_d', count : 0},
];

const shipmentStatus =
    {
        inProgress : { className : 'txt_p', bgClassName : 'bg_p',
            statuses : [
                    {key: '', name: 'Select Status Type'},
                    {key: 'navigateToPickup', name: 'Navigate To Pickup'},
                    {key: 'reachedInPickupGeofence', name: 'Reached in Pickup Geofence'},
                    {key: 'atPickupLocation', name: 'At Pickup Location'},
                    {key: 'shipmentLoading', name: 'Shipment Loading'},
                    {key: 'shipmentLoaded', name: 'Shipment Loaded'},
                    {key: 'verifyingPickupDocuments', name: 'Verifying Pickup Documents'},
                    {key: 'accident', name: 'Accident'},
                    {key: 'rest', name: 'Rest'},
                    {key: 'underMaintenance', name: 'Under Maintenance'},
                    {key: 'etc', name: 'Etc'},
                    {key: 'fuelling', name: 'Fueling'},
                    {key: 'navigateToDropOff', name: 'Navigate To DropOff'},
                    {key: 'reachedAtDropOffGeofence', name: 'Reached at DropOff Geofence'},
                    {key: 'atDropOffLocation', name: 'At DropOff Location'},
                    {key: 'shipmentUnloading', name: 'Shipment Unloading'},
                    {key: 'shipmentUnloaded', name: 'Shipment Unloaded'},
                    {key: 'verifyingDropOffDocuments', name: 'Verifying DropOff Documents'}
            ]},
         upcoming :
            { className : 'txt_y', bgClassName : 'bg_y', statuses : [
                {key:'', name:'Select Status Type'},
                {key:'accept', name:'Accept'},
            ]},
         past : { className : 'txt_s', bgClassName : 'bg_s',
            statuses : [
                {key:'', name:'Select Status Type'},
                {key:'cancel', name:'Canceled'},
                {key:'delivered', name:'Delivered'},
                {key:'completed', name:'Completed'},
            ]},
         pending:{ className : 'txt_d', bgClassName : 'bg_d',
            statuses : [
                {key:'', name:'Select Status Type'},
                {key:'assign', name:'Assigned'},
                {key:'unAssign', name:'Unassigned'},
                {key:'reject', name:'Rejected'},
                {key:'unDelivered', name:'Undelivered'},
                {key:'dispute', name:'Dispute'},
                {key:'draft', name:'Draft'},
            ]},
        dispute:{ className : 'txt_y', bgClassName : 'bg_y',
            statuses : [
                {key:'', name:'Select Status Type'},
                {key:'dispute', name:'Dispute'}
            ]},
        availableLoads:{ className : 'txt_p', bgClassName : 'bg_p',
            statuses : [{key:'', name:'Select Status Type'}]
        },
        activeBidding:{ className : 'txt_p', bgClassName : 'bg_p',
            statuses : [{key:'', name:'Select Status Type'}]
        },
        pastBidding:{ className : 'txt_d', bgClassName : 'bg_d',
            statuses : [{key:'', name:'Select Status Type'}]
        }
    };

const disputeStatus = [
    {key : 'New', check : 'new', value : '1', count : 0},
    {key : 'Ongoing', check : 'onGoing', value : '2', count : 0},
    {key : 'Resolved', check : 'resolved', value : '3', count : 0},
];

const disputeReasons = [
    {key : 'Incorrect Payment', value : '1', count : 0},
    {key : 'Incorrect Shipment', value : '2', count : 0},
    {key : 'Goods Damaged', value : '3', count : 0},
    {key : 'Shipment Delayed', value : '4', count : 0},
];

export const carrierFilters = {
    states,
    operationTypes,
    equipmentTypes,
    statusList,
    shipmentEquipmentTypes,
    shipmentTabTypes,
    driverTabTypes,
    shipmentStatus,
    disputeStatus,
    disputeReasons
};