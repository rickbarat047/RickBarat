import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User,
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserProfileData {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt?: string;
  lastLoginAt?: string;
  bookmarkedProjectIds: string[];
  starredLabIds: string[];
}

interface AuthContextType {
  user: User | null;
  userData: UserProfileData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleBookmarkProject: (projectId: string) => Promise<void>;
  toggleBookmark: (projectId: string) => Promise<void>;
  toggleStarLab: (labId: string) => Promise<void>;
  toggleStarredLab: (labId: string) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          
          // Setup real-time listener for user profile document
          unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data() as UserProfileData);
            } else {
              // Initialize user doc if doesn't exist yet
              const newProfile: UserProfileData = {
                uid: currentUser.uid,
                displayName: currentUser.displayName || 'Visitor',
                email: currentUser.email || '',
                photoURL: currentUser.photoURL || '',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                bookmarkedProjectIds: [],
                starredLabIds: [],
              };
              await setDoc(userDocRef, newProfile);
              setUserData(newProfile);
            }
          }, (err) => {
            console.error('Error listening to user profile:', err);
          });

          // Update lastLoginAt
          await updateDoc(userDocRef, {
            lastLoginAt: new Date().toISOString(),
            displayName: currentUser.displayName || 'Visitor',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
          }).catch(async () => {
            // Document might not exist yet, initial creation is handled in snapshot callback
          });

        } catch (error) {
          console.error('Error syncing user profile with Firestore:', error);
        }
      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      if (error.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by browser. Please allow popups or open in a new tab.');
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || 'Failed to sign in with Google');
      }
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const toggleBookmarkProject = async (projectId: string) => {
    if (!user) {
      // Prompt user to sign in
      await signInWithGoogle();
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const isBookmarked = userData?.bookmarkedProjectIds?.includes(projectId);
      
      await updateDoc(userDocRef, {
        bookmarkedProjectIds: isBookmarked ? arrayRemove(projectId) : arrayUnion(projectId),
      });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const toggleStarLab = async (labId: string) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const isStarred = userData?.starredLabIds?.includes(labId);

      await updateDoc(userDocRef, {
        starredLabIds: isStarred ? arrayRemove(labId) : arrayUnion(labId),
      });
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signInWithGoogle,
        logout,
        toggleBookmarkProject,
        toggleBookmark: toggleBookmarkProject,
        toggleStarLab,
        toggleStarredLab: toggleStarLab,
        authError,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
