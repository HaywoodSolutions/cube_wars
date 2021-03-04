import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

const app = admin.initializeApp();
const db = app.firestore();

exports.onUserCreated = functions.auth.user().onCreate((user) => {
  return db.collection('users').doc(user.uid).create({
    money: 0
  });
});

exports.onUserDeleted = functions.auth.user().onDelete((user) => {
  return db.collection('users').doc(user.uid).delete();
});

exports.onMine = functions.firestore.document('mined/{mineId}').onCreate((snap) => {
  if (!snap.exists)
    return null;
  const data: any = snap.data();

  const cords = data.cordinates;
  if (cords == undefined || !(Array.isArray(cords) && cords.length <= 750))
    return snap.ref.delete();
  
  const timings = data.timings;
  if (timings == undefined || !(Array.isArray(timings) && cords.length <= 750))
    return snap.ref.delete();
  
  for (let numb of cords)
    if (!Number.isFinite(numb) || numb > 256*256)
      return snap.ref.delete();
    
  for (let numb of timings)
    if (!Number.isFinite(numb))
      return snap.ref.delete();

  const tileRef = db.collection("tiles").doc(data.scale).collection('position').doc(data.positionId);

  return db.runTransaction(transaction => {
    return transaction.get(tileRef).then(sfDoc => {
      if (!sfDoc.exists)
        throw "Document does not exist!";
      
      var newPopulation = sfDoc.data().population + 1;
      transaction.update(sfDocRef, { population: newPopulation });
    });
  }).then(function() {
    console.log("Transaction successfully committed!");
  }).catch(function(error) {
    console.log("Transaction failed: ", error);
  });


  return null;
  
  // If we set `/users/marie` to {name: "Marie"} then
  // context.params.userId == "marie"
  // ... and ...
  // change.after.data() == {name: "Marie"}
});

exports.createCubeStructure = functions.https.onRequest((user) => {
  const batch = db.batch();

  const cubeRef = db.collection("cubeLogic").doc("main");
  batch.set(cubeRef, {
    sides: {
      top: {
        hash: "0",
        level: 1
      },
      bottom: {
        hash: "0",
        level: 1
      },
      left: {
        hash: "0",
        level: 1
      },
      right: {
        hash: "0",
        level: 1
      },
      frount: {
        hash: "0",
        level: 1
      },
      back: {
        hash: "0",
        level: 1
      }
    },
    level: 1,
  }, {
    merge: false
  });
  
  const cubeVisibleRef = db.collection("cube").doc("main");
  batch.set(cubeVisibleRef, {
    base64: {
      top: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAqklEQVR42u3QMQEAAAgDoK1/aI3hIUSgmbxWAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg4N4Cpy+AAehwQHoAAAAASUVORK5CYII=',
      bottom: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAqklEQVR42u3QMQEAAAgDoK1/aI3hIUSgmbxWAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg4N4Cpy+AAehwQHoAAAAASUVORK5CYII=',
      left: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAqklEQVR42u3QMQEAAAgDoK1/aI3hIUSgmbxWAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg4N4Cpy+AAehwQHoAAAAASUVORK5CYII=',
      right: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAqklEQVR42u3QMQEAAAgDoK1/aI3hIUSgmbxWAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg4N4Cpy+AAehwQHoAAAAASUVORK5CYII=',
      frount: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAqklEQVR42u3QMQEAAAgDoK1/aI3hIUSgmbxWAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg4N4Cpy+AAehwQHoAAAAASUVORK5CYII=',
      back: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAqklEQVR42u3QMQEAAAgDoK1/aI3hIUSgmbxWAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAg4N4Cpy+AAehwQHoAAAAASUVORK5CYII=',
    },
    level: 1,
  }, {
    merge: false
  });

  return batch.commit();
});

const createTile = (batch: any, side: string, level: number, position: [number, number]) => {
  const tileId = `${side}.${level}.X${position[0]}Y${position[1]}`
  const tileRef = db.collection("tiles").doc(tileId);
  batch.set(tileRef, {
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAQAAACbULj8AAAAEElEQVR42mNk+M8wCkYwAAABIQEBGhAZNgAAAABJRU5ErkJggg==',
  }, {
    merge: false
  });

  const tileLogicRef = tileRef.collection('logic').doc('main');
  batch.set(tileLogicRef, {...{
    hash: "0",
    level,
    side,
    position
  }, ...(level <= 2 ? {
    childLevels: new Array(4*4).fill(1)
  } : {})}, {
    merge: false
  });

exports.createL0Tiles = functions.https.onRequest((user) => {
  const sides = ["frount", "back", "top", "bottom", "right", "left"];

  const batch = db.batch();
  sides.forEach(sideName => {
    const sideRef = db.collection("sidesLogic").doc(sideName);
    batch.set(sideRef, {
      hash: "0",
      childLevels: new Array(4*4).fill(1),
      level: 1
    }, {
      merge: false
    });
    const sideVisibleRef = db.collection("sides").doc(sideName);
    batch.set(sideVisibleRef, {
      base64: 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAQAAACbULj8AAAAEElEQVR42mNk+M8wCkYwAAABIQEBGhAZNgAAAABJRU5ErkJggg==',
      side: sideName
    }, {
      merge: false
    });
  });

  return batch.commit();
});


exports.createMiddleLevel = functions.https.onRequest((user) => {
  const sides = ["frount", "back", "top", "bottom", "right", "left"]
  const batches: any[] = [];
  sides.forEach(sideName => {
    const sideRef = db.collection("sides").doc(sideName);
    const batch = db.batch();
    for (var x=0; x<16; x++)
      for (var y=0; y<16; y++)
        batch.set(sideRef, {
          hash: "0",
          level: 1,
          base64: 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAQAAACbULj8AAAAEElEQVR42mNk+M8wCkYwAAABIQEBGhAZNgAAAABJRU5ErkJggg=='
        }, {
          merge: false
        });
    batches.push(batch);
  })
  return Promise.all(batches);
});

exports.createLowestLevel = functions.https.onRequest((user) => {
  const sides = ["frount", "back", "top", "bottom", "right", "left"]
  const batches: any[] = [];
  sides.forEach(sideName => {
    const sideRef = db.collection("sides").doc(sideName);
    const batch = db.batch();
    for (var x=0; x<16; x++)
      for (var y=0; y<16; y++)
        batch.set(sideRef, {
          hash: "0",
          level: 1,
          base64: "iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAQAAACbULj8AAAAEElEQVR42mNk+M8wCkYwAAABIQEBGhAZNgAAAABJRU5ErkJggg=="
        }, {
          merge: false
        });
    batches.push(batch);
  })
  return Promise.all(batches);
});