import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { authentication, db } from "./firebase";

export default function SignIn({ user }) {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar");
  const handleLogin = async () => {
    const result = await signInWithPopup(authentication, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    localStorage.setItem("auth_token", token);

    const userEmail = result.user.email;

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await signOut(authentication);
    }
  };

  const makeSignOut = () => {
    signOut(authentication);
  };

  return (
    <>
      {user ? (
        <div className="flex gap-2">
          <img src={user.photoURL} className=" w-11 rounded-full" />
          <div className="md:block hidden">
            <p>{user.displayName}</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <img
            src="/exit.png"
            className="w-11 cursor-pointer"
            onClick={makeSignOut}
          />
        </div>
      ) : (
        <button className="text-xl cursor-pointer" onClick={handleLogin}>
          přihlásit se
        </button>
      )}
    </>
  );
}
