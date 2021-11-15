import React from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
require("firebase/auth");
require("firebase/firestore");

const app = firebase.initializeApp({
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

function ChatRoom() {
  const noticiasRef = firestore.collection("noticias");
  const query = noticiasRef.orderBy("Tiempo");

  const [noticias] = useCollectionData(query, { idField: "id" });

  return (
    <div>
      {noticias &&
        noticias.map((msg) => <Noticia key={msg.id} message={msg} />)}
    </div>
  );
}

function Noticia(props) {
  const { text, idProfesor } = props.message;

  return <p>{text}</p>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div></div>
    </div>
  );
}

export default App;
