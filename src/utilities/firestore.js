import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD7QlvlwBc9XUDh_c1Xt6DJgiIz7OJrJ5o",
    authDomain: "systemrezerwacjizoo-web.firebaseapp.com",
    databaseURL: "https://systemrezerwacjizoo-web.firebaseio.com",
    projectId: "systemrezerwacjizoo-web",
    storageBucket: "systemrezerwacjizoo-web.appspot.com",
    messagingSenderId: "852703312276"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();

export default firestore;