import * as firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyD7zmr42b5YHx6gAibxGNrQIqW8VN_Thfk',
  authDomain: 'nhathuoc41-9ecce.firebaseio.com',
  databaseURL: 'https://nhathuoc41-9ecce.firebaseio.com/',
  projectId: 'nhathuoc41-9ecce',
  storageBucket: ''
})

export const db = firebaseApp.database()
