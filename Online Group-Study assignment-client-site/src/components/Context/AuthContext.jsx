import { createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import app from "../../services/firebase.config";
import axios from "axios";

export const context = createContext(null);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = async (name, photoURL, email, password) => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL,
            });
            setLoading(false);
            return user;
        } catch (error) {
            console.error("Error creating user:", error);
            setLoading(false);
        }
    };

    const createUserWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            return user;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {

            setLoading(true);

            if (currentUser) {
                const userEmail = currentUser.email;
                const loggedUser = { email: userEmail };

                try {
                    // Fetch JWT Token
                    const response = await axios.post(
                        'https://online-group-study-assignment-server-site.vercel.app/jwt',  // Remove the extra "https://"
                        loggedUser,
                        { withCredentials: true }
                    );
                    // console.log("Token response", response.data);
                } catch (error) {
                    console.error("Error fetching JWT token:", error);
                }
            } else {
                // User is not logged in, clear JWT token from cookies
                try {
                    const response = await axios.post(
                        'https://online-group-study-assignment-server-site.vercel.app/logOut',
                        { email: user?.email },
                        { withCredentials: true }
                    );
                    console.log("Logged out successfully", response.email);
                } catch (error) {
                    console.error("Error logging out:", error);
                }
            }

            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unSubscribe();
        };
    }, [user]);

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const authInfo = {
        user,
        createUser,
        createUserWithGoogle,
        signIn,
        logOut,
        loading,
    };

    return (
        <context.Provider value={authInfo}>
            {children}
        </context.Provider>
    );
};

export default AuthContext;
