const APIDOMAIN = {
    dev: 'https://payapi-dev.laneaxis.com/api/',  // UAT Admin
};

const USERENDPOINTS = {
    changePwd: 'change_password',
    getAdminUserDetail: 'admin/user-me',
    updateProfile: 'admin/user-update',
    updateCarrier:'admin/carrier-edit',
    removeDocument:'admin/carrier-remove-docs',
    addUser:'admin/user-add',
    logout: 'device/delete'
};

const AUTHENDPOINTS = {
    login: 'v2/login',
    forgotPwd : 'forgot_password',
    verifyOTP : 'verify_forget_password_otp',
    resetPwd : 'reset-password',
};

const CARRIERENDPOINTS = {
    getcarrierList: 'admin/carrier-list',
    getCarrierProfile: 'admin/carrier-profile',
    getCarrierConnection: 'admin/carrier-connection',
    getDocumentList : '/v1/media/list',
    getDriverList: 'admin/driver-list',
    getShipmentList: 'admin/shipment-list',
    addDOTNumber: 'admin/user-add-dot-carrier',
    industries:'connection/sic-code-list',
    connections:'connection/list?limit=10&page=1',
    config:'config/get',
    lanes:'website-external/list?limit=10',
};

const DRIVERENDPOINTS = {
    getDriverProfile:'driver/get',
    getDriverDocuments:'carrier/driver-doc-list'
};

const SHIPMENTENDPOINTS = {
    getShipmentDetails:'admin/shipment-get',
    getShipmentLoadHistory:'shipment/history',
    getShipmentDocuments:'media/shipment-documents',
    getShipmentBid:'admin/shipment-bid/history',
    getShipmentPayment:'admin/shipment-payment',
    getShipmentAch:'admin/ach-payment'
};

const SHIPPERENDPOINTS = {
    getshipperList: 'admin/shipper-list',
    getShipperProfile: 'admin/shipper-profile',
    getShipperConnection: 'admin/shipper-connection',
    getShipmentList: 'admin/shipment-list'
};

const DISPUTEENDPOINTS = {
    getdisputeList: 'admin/dispute-list',
    getdisputeDetails: 'admin/dispute-get',
    getdisputeMessages:'admin/list-dispute-message',
    updateDispute:'admin/dispute-update',
    getUser:'admin/search-user',
    disputeAssignUpdate:'admin/dispute-assign-update'
};

const USERMGMNTENDPOINTS = {
    getUserList:'admin/user-list',
    getUserDetails:'admin/user-get'
}

const LOOKUPLIST={
    getlookuplist:'lookup/list'
}

export const envConfig = {
     USERENDPOINTS,
     AUTHENDPOINTS,
     CARRIERENDPOINTS,
     APIDOMAIN,
     DRIVERENDPOINTS,
     SHIPMENTENDPOINTS,
     SHIPPERENDPOINTS,
     DISPUTEENDPOINTS,
     USERMGMNTENDPOINTS,
     LOOKUPLIST

}