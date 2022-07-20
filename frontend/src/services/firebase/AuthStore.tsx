import React, { useEffect, useState, useContext } from "react";
import firebaseApp from "./firebase";
import firebase, { User } from "firebase";
import { CurrentUserDataContext } from "../rest/CurrentUserDataStore";
import { userInfo } from "os";
import { getErrorResponse } from "../rest/error";

export interface CurrentUser {
    isSignedIn: boolean,
    pending: boolean,
    user: User | null,
    idToken: string | null,
    anonymous: boolean | null
}

export const AuthContext = React.createContext<CurrentUser>({
    isSignedIn: false,
    pending: true,
    user: null,
    idToken: null,
    anonymous: null
});


export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>({
        isSignedIn: false,
        pending: true,
        user: null,
        idToken: null,
        anonymous: null
    });

    const currentRestUser = useContext(CurrentUserDataContext);
    const uniUserBasicData = currentRestUser.localData.uniUserBasicData;
    
    useEffect(() => {
        firebaseApp.auth().onIdTokenChanged(async (user: User | null) => {
            var userIdToken: string | null = null;

            if (!!user) {
                userIdToken = await user.getIdToken();
                console.log(userIdToken);
            }
            
            const anonymous = !!user && (user.isAnonymous || !user.email);

            setCurrentUser({ user: user, pending: false, isSignedIn: !!user && !(anonymous && !uniUserBasicData), idToken: userIdToken, anonymous: anonymous});
            if (!!user && !!userIdToken) {
            }
            else {
                await currentRestUser.voidUniUserLocalData(false);
            }
        });
      }, []);

    useEffect(() => {
        const newUser = { 
            user: JSON.parse(JSON.stringify(currentUser.user)), 
            pending: currentUser.pending, 
            isSignedIn: !!currentUser.user && !(currentUser.anonymous && !uniUserBasicData), 
            idToken: JSON.parse(JSON.stringify(currentUser.idToken)), 
            anonymous: currentUser.anonymous
        };
        if (JSON.stringify(newUser) !== JSON.stringify(currentUser)) {
            setCurrentUser(newUser);
        }
    }, [currentRestUser]);

    return (
        <AuthContext.Provider
            value={currentUser}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function authorisedUser(currentUser: CurrentUser): boolean {
    return (!currentUser.pending && currentUser.isSignedIn && !!currentUser.user && (currentUser.user.emailVerified || (!!currentUser.anonymous && currentUser.anonymous)) && !!currentUser.idToken);
}

export function updateIdToken(newIdToken: string) {
    firebaseApp.auth().signInWithCustomToken(newIdToken);
}