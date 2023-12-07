import { initializeApp } from "firebase/app";
import { createContext, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey : process.env.REACT_APP_apiKey,
  authDomain : process.env.REACT_APP_authDomain,
  projectId :process.env.REACT_APP_projectId,
  storageBucket : process.env.REACT_APP_storageBucket,
  messagingSenderId : process.env.REACT_APP_messagingSenderId,
  appId : process.env.REACT_APP_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
export const firestore = getFirestore(app);

export const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const isLoggedIn = user ? true : false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const signUpUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (username) => {
    return await updateProfile(auth.currentUser, {
      displayName: username,
    });
  };

  const getBlogById = async (blogId) => {
    let docRef = doc(firestore, "blogs", blogId);
    return await getDoc(docRef);
  };

  const deleteDocById = async (blogId) => {
    return await deleteDoc(doc(firestore, "blogs", blogId));
  };

  const editDoc = async (blogId, updatedData) => {
    let docRef = doc(firestore, "blogs", blogId);
    if (updatedData.thumbnail) {
      console.log("inside if", updatedData);
      const imgRef = ref(
        storage,
        `uploads/thumbnails/${Date.now()}-${updatedData.thumbnail}`
      );
      const uploadResult = await uploadBytes(imgRef, updatedData.thumbnail);
      delete updatedData.thumbnail;
      return await updateDoc(docRef, {
        ...updatedData,
        imageURL: uploadResult.ref.fullPath,
      });
    } else {
      delete updatedData.thumbnail;
      return await updateDoc(docRef, updatedData);
    }
  };

  const getImgURL = async (path) => {
    return await getDownloadURL(ref(storage, path));
  };

  const addNewBlog = async (
    title,
    isTrending,
    category,
    desc,
    tags,
    thumbnail
  ) => {
    const imgRef = ref(
      storage,
      `uploads/thumbnails/${Date.now()}-${thumbnail}`
    );
    const uploadResult = await uploadBytes(imgRef, thumbnail);
    return await addDoc(collection(firestore, "blogs"), {
      title,
      isTrending,
      category,
      desc,
      tags,
      imageURL: uploadResult.ref.fullPath,
      authorName: user.displayName,
      authorEmail: user.email,
      createdAt: new Date().toDateString(),
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        signUpUser,
        signInUser,
        isLoggedIn,
        signOutUser,
        addNewBlog,
        updateUserProfile,
        getImgURL,
        getBlogById,
        deleteDocById,
        editDoc,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
