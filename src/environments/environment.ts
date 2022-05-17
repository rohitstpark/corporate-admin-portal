// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  laneAxisDotCom: 'https://laneaxis.com',
  apiEndpoint: 'https://api-dev.laneaxis.com/api/',
  searchRestriction:['us','in'],
  stripePublicKey:"pk_live_zjL5w9gOnJcnCs5ptE8g3AOr00OuijpVh5",
  paymentApiEndpoint: 'https://payapi.laneaxis.com',
  imagePathUrl: 'https://s3.us-east-2.amazonaws.com/static.laneaxis.com',
  mapbox: {
    accessToken: 'pk.eyJ1IjoibGFuZWF4aXMiLCJhIjoiY2tidnZma2VpMGEydzJ0bnFvdjdvejFmMiJ9.A8iCJZIH4tL1IlmM3mTQHA'
  },
  firebase: {
    apiKey: "AIzaSyDlvyLEAmZhA3ydhvZ8wizSSIEjWPFS79k",
    authDomain: "laneaxismobileapp.web.app.com",
    databaseURL: "https://laneaxismobileapp.firebaseio.com",
    projectId: "laneaxismobileapp",
    storageBucket: "laneaxismobileapp.appspot.com",
    messagingSenderId: "606002027658",
    appId: "1:606002027658:web:9f5516e869428b45cf6173",
  }
};
