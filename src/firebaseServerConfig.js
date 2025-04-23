import admin from 'firebase-admin';
import serviceAccount from '../../clonetify-e3787-firebase-adminsdk-fbsvc-ae96d20a41.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

export { auth };