This is a sample app to reproduce a bug with setDoc and onSnapshot

---

### Prerequisites
1. Edit your firestore rules to include the following rules:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /Test/{testId} {
          allow read: if true;
          allow write: if false;
        }
      }
    }
    ```
2. Add a Collection called `Test` to the root of your Firestore database
---

### Steps
1. Edit `index.ts` with your API credentials.
2. `yarn install`
3. `yarn ts-node index.ts`
4. Press CTRL+C when done to quit.

You should observe the following:
1. The onSnapshot returns the values in the `Test` collection
2. setDoc is called
3. onSnapshot receives the new data
4. setDoc fails due to security rules
5. onSnapshot rolls back the data and returns to the original state

Example logs:

```
Snapshot received: []
Before setDoc
Snapshot received: [ { id: 'new-doc' } ]
[2022-02-23T13:12:35.088Z]  @firebase/firestore: Firestore (9.6.7): Connection GRPC stream error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
setDoc error: [FirebaseError: 7 PERMISSION_DENIED: Missing or insufficient permissions.] {
  code: 'permission-denied',
  customData: undefined,
  toString: [Function (anonymous)]
}
Snapshot received: []
```