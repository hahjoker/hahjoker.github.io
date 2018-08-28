var config = {
    apiKey: "AIzaSyDgl3nyuro0aofZFSd1wuBxqwDtueCdAo4",
    authDomain: "moviequeuelist.firebaseapp.com",
    databaseURL: "https://moviequeuelist.firebaseio.com",
    projectId: "moviequeuelist",
    storageBucket: "moviequeuelist.appspot.com",
    messagingSenderId: "642705972248"
  };
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

//let outputHeader = document.querySelector('#hotDogOutput');
//let inputTextField = document.querySelector('#latestHotDogStatus');
let newUser = document.querySelector('#newUser');
var usersCollectionRef = firestore.collection('users');

function newUsers(){
    var person = prompt("Please enter your name", "");
    usersCollectionRef.doc(person).set({
        name: person,
        elo: 1000
    }).then(function(docRefs) {
        console.log("Document written with ID: ", docRefs.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    setTimeout(myFunction, 2000);
};
function myFunction(){
    window.location="app.html";
}
/*newUser.addEventListener('click', function() {
    var person = prompt("Please enter your name", "");
    usersCollectionRef.doc(person).set({
        name: person,
        elo: 1000
    }).then(function(docRefs) {
        console.log("Document written with ID: ", docRefs.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

});*/
function tablegen(){
    var myTableDiv = document.getElementById("leaderboard")
    var tableBody = document.getElementById('board')
    var i=0;
    var stock = new Array()

    usersCollectionRef.orderBy("elo",'desc').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data().elo);
            stock[i] = new Array(doc.id,doc.data().elo);
            console.log(stock[i]);
            i++;
        });
        for (i = 0; i < stock.length; i++) {
            var tr = document.createElement('TR');
            for (j = 0; j < stock[i].length; j++) {
                var td = document.createElement('TD')
                td.appendChild(document.createTextNode(stock[i][j]));
                tr.appendChild(td)
            }
            tableBody.appendChild(tr);
        }  
    });

};

function listgen(){
    var i=0;
    var stock = new Array()

    usersCollectionRef.orderBy("elo",'desc').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().elo);
            stock[i] = doc.id;
            i++;
        });
        var ul = document.getElementById("board");
        for (i = 0; i < stock.length; i++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(stock[i]));
            ul.appendChild(li);
        }  
    });
}

/*saveButton.addEventListener('click', function() {
    const tTS =inputTextField.value;
    console.log ("I am going to save " + tTS +" To firestore");
    docRef.set({hotDogStatus: tTS}).then(function()
    {
        console.log("status saved");
    }).catch(function(error){console.log(error);})

  });*/

  /*loadButton.addEventListener('click', function() {
    docRef.get().then(function(doc){
        if(doc && doc.exists) {
            const myData =doc.data();
            outputHeader.innerText = "Hot dog status: " +myData.hotDogStatus;
        }
    }).catch(function(error){
        console.log(error);
    })

  });*/

getRealtimeUpdates = function(){
    docRef.onSnapshot(function(doc){
        if(doc && doc.exists) {
            const myData =doc.data();
            outputHeader.innerText = "Hot dog status: " +myData.hotDogStatus;
        }
    })
}
//getRealtimeUpdates();