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

var usersCollectionRef = firestore.collection('users');


function listgen(){
    var i=0;
    var stock = new Array()

    usersCollectionRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            stock[i] = doc.id;
            i++;
        });
        var ul = document.getElementById("board");
        for (i = 0; i < stock.length; i++) {
            var a = document.createElement("a")
            a.className +="js-hover";
            //a.href = ""
            a.id+=stock[i];
            var li = document.createElement("li");
            a.appendChild(document.createTextNode(stock[i]));
            
            li.appendChild(a);
            ul.appendChild(li);
        }  
    });
    var hoverEl = document.querySelectorAll('.js-hover');
    var imgArray = [];
    var data = ["https://i.pinimg.com/originals/de/3a/64/de3a6465fd0b23253218d265b01da16e.jpg", "https://www.clashmusic.com/sites/default/files/field/image/CLASH104_%20InternalImage62.jpg"];
    
    data.forEach(function (el, i) {
      image = document.createElement('img');
      
    
      image.setAttribute('src', el);
      document.body.appendChild(image);
      imgArray.push(image);
    
    });
    
    hoverEl.forEach(function (el, i) {
      el.addEventListener('mouseover', function () {
        imgArray[i].classList.add('visible');
      });
    
    
      el.addEventListener('mouseleave', function () {
        imgArray[i].classList.remove('visible');
      });
    });
}

function manohman(winner, loser)
{
    var winnerElo=0;
    var loserElo=0;
    usersCollectionRef.where("name","==",winner).get().then(function(docSnap){
        docSnap.forEach(function(doc){
            winnerElo=doc.data().elo

    usersCollectionRef.where("name","==",loser).get().then(function(docSnap){
        docSnap.forEach(function(doc){
            loserElo=doc.data().elo
            winnerElo = getNewRating(winnerElo,loserElo,1);
            loserElo = getNewRating(loserElo,winnerElo,0);
            usersCollectionRef.doc(winner).set({
                name:winner,
                elo:winnerElo
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            usersCollectionRef.doc(loser).set({
                name:loser,
                elo:loserElo
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        })
    });
        })
    });
    
    //getRatingDelta()
}
function getRatingDelta(myRating, opponentRating, mgr) {
    if ([0, 0.5, 1].indexOf(mgr) === -1) {
      return null;
    }
    var letsgetit = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));
    //k factor of 32
    console.log(Math.round(32 * (mgr - letsgetit)));
    return Math.round(32 * (mgr - letsgetit));
  }
  function getNewRating(myRating, opponentRating, mgr) {
    return myRating + getRatingDelta(myRating, opponentRating, mgr);
  }