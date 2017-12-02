import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyCCKNjWcQ3I0ZaGT9iGDhD-l4foYBevkhY",
    authDomain: "getmypassword.firebaseapp.com",
    databaseURL: "https://getmypassword.firebaseio.com",
    projectId: "getmypassword",
    storageBucket: "getmypassword.appspot.com"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;