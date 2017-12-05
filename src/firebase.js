import * as firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyD7zmr42b5YHx6gAibxGNrQIqW8VN_Thfk',
  authDomain: 'nhathuoc41-9ecce.firebaseio.com',
  databaseURL: 'https://nhathuoc41-9ecce.firebaseio.com/',
  projectId: 'nhathuoc41-9ecce',
  storageBucket: ''
  /* apiKey: 'AIzaSyCJ4QjPzX_Y5rloyMC2NyEQGUyL2yJQu5Y',
  authDomain: 'kusuriya-13bcc.firebaseio.com/',
  databaseURL: 'https://kusuriya-13bcc.firebaseio.com/',
  projectId: 'kusuriya-13bcc',
  storageBucket: '' */
})

export const db = firebaseApp.database()
