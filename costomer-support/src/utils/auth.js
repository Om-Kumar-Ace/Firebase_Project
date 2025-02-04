import { auth, firestore } from '../Firebase';

export const getRole = async (userId) => {
    const userRef = firestore.collection('users').doc(userId);
    const doc = await userRef.get();
    if (doc.exists) {
        return doc.data().role;
    }
    return null;
};
