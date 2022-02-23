import { FirebaseOptions, initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";

/*
 * NOTE: Set security rules to the following:
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /Test/{testId} {
 *     	allow read: if true;
 *       allow write: if false;
 *     }
 *   }
 * }
 */

/*
 * NOTE: Add a collection called Test to the root of your Firestore database
 */

export type TestModel = {
  id: string
};

const firebaseConfig: FirebaseOptions = {
// Insert your config here
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

const getTestCollection = () => {
  return collection(getFirestore(), "Test");
}

const watchCollection = () => {
  const queryRef = query(getTestCollection());
  
  return onSnapshot(queryRef,
    (snapshot) => {
      console.log('Snapshot received:', snapshot.docs.map((doc) => doc.data()));
    },
    error => {
      console.error('onSnapshot error:', error);
    }
  );
}

const setDocument = async (testModel: TestModel) => {
  const docRef =  doc(getTestCollection(), testModel.id);

  try {
    console.log("Before setDoc")
    await setDoc(docRef, testModel);
    console.log("After setDoc")
  } catch (error) {
    console.log("setDoc error:", error)
  }
}

const testModelToCreate: TestModel = {
  id: "new-doc",
};

// Start watch
const unsubscribe = watchCollection();

// Call setDocument after 1 sec
const timeoutId = setTimeout(() => setDocument(testModelToCreate), 1000);