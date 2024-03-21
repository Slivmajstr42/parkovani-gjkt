import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import { authentication } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import MyCar from "./MyCar";
import ParkingField from "./ParkingField";
import { db } from "./firebase";
import Users from "./Users";
import Reservations from "./Reservations";
import Blocking from "./Blocking";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //loading for wait for user data to be fetched

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${localStorage.getItem(
        "auth_token"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          signOut(authentication);
        }
      });
    const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
      if (currentUser) {
        getDoc(doc(db, "users", currentUser.email)).then((res) => {
          setUser({
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            role: res.data().role,
            displayName: currentUser.displayName,
            spz: res.data().spz,
            number: res.data().number,
          });
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <TopBar user={user} />,
      children: [
        {
          path: "/",
          element: <>{user ? <ParkingField user={user} /> : <WelcomePage />}</>,
        },
        {
          path: "/my-car",
          element: <MyCar user={user} />,
        },
        {
          path: "/users",
          element: <Users user={user} />,
        },
        {
          path: "/reservations",
          element: <Reservations user={user} />,
        },
        {
          path: "/blocking",
          element: <Blocking user={user} />,
        },
      ],
    },
  ]);

  return <div>{!loading && <RouterProvider router={router} />}</div>;
}

export default App;
