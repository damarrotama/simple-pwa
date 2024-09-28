const dbName = 'simple-db';
const dbVersion = 1;
const storeName = 'users';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('email', 'email', { unique: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

openDatabase().then((db) => {
    console.log('Database opened successfully');
}).catch((error) => {
    console.error('Error opening database:', error);
});

function addUser(user) {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(user);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        }).catch((error) => {
            reject(error);
        });
    });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        }).catch((error) => {
            reject(error);
        });
    });
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        }).catch((error) => {
            reject(error);
        });
    });
}

function updateUser(user) {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(user);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        }).catch((error) => {
            reject(error);
        });
    });
}

function deleteUserFromDB(id) {
    console.log('Deleting user with id:', id);
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        }).catch((error) => {
            reject(error);
        });
    });
}