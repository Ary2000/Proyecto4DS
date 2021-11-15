import React, { useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCWkRaY_wQfWvjRBAz2uhVoevFI5mvyj3M",
  authDomain: "bdpds4.firebaseapp.com",
  projectId: "bdpds4",
  storageBucket: "bdpds4.appspot.com",
  messagingSenderId: "1054838763782",
  appId: "1:1054838763782:web:32b8793e5efdb229996e87",
  measurementId: "G-94V58WLPMW",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const db = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  const encontrarUsuario = (user) => {
    const profesores = db.collection("profesores");
    const profesor = profesores
      .where("uid", "==", user.uid)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) console.log("Usuario ya existente");
        else {
          profesores.add({
            uid: user.uid,
            nombre: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            esProfesor: true,
          });
        }
      });
  };

  function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then((result) => {
        encontrarUsuario(result.user);
      });
    };

    return <button onClick={signInWithGoogle}>Sign In con Google</button>;
  }

  function SignOut() {
    return (
      auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
      )
    );
  }

  function ChatRoom() {
    const noticiasRef = firestore.collection("noticias");
    const query = noticiasRef.orderBy("Tiempo");

    const [noticias] = useCollectionData(query, { idField: "id" });

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      const { uid, photoURL } = auth.currentUser;

      await noticiasRef.add({
        Texto: formValue,
        Tiempo: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setFormValue("");
    };

    return (
      <>
        <div>
          <SignOut />
        </div>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
        {noticias &&
          noticias.map((msg) => <Noticia key={msg.id} message={msg} />)}
      </>
    );
  }

  function Noticia(props) {
    const { Texto, idProfesor } = props.message;

    return <p>{Texto}</p>;
  }

  return (
    <div className="App">
      <header className="App-header"></header>
      {user ? <ChatRoom /> : <SignIn />}
    </div>
  );
}

export default App;
