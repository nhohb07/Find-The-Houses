const firebaseAdmin = require("firebase-admin");

const serviceAccount = require("./secure/firebase.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://find-the-houses.firebaseio.com"
});

const FBAdmin = firebaseAdmin.database().ref();

FBAdmin.child('.info/connected').on("value", (snap) => {
  console.log(`${snap.val() === true ? '======> FBAdmin connected' : ''}`);
});

module.exports = FBAdmin;