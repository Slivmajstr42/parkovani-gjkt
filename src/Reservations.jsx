import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";

export default function Reservations({ user, loading }) {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [msg, setMsg] = useState("");
  console.log(user, loading);
  useEffect(() => {
    if (!loading && (!user || user.role !== 1)) {
      navigate("/");
    } else if (user && user.role === 1) {
      getDocs(collection(db, "users place")).then((data) => {
        let arr = [];
        data.forEach((item) => arr.push({ ...item.data(), id: item.id }));
        setReservations(arr);
      });
    }
  }, [user, loading]);

  const removeReservation = (reservation) => {
    deleteDoc(doc(db, "users place", reservation.id));
    setMsg("rezervace byla odstraněna");
  };

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="text-left">Datum</th>
            <th className="text-left">Email</th>
            <th className="text-left">Místo</th>
            <th className="text-left">SPZ</th>
            <th className="text-left"></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, i) => (
            <tr key={i}>
              <td>{reservation.date}</td>
              <td>{reservation.email}</td>
              <td>{reservation.location}</td>
              <td>{reservation.spz}</td>
              <td>
                <button
                  className="text-red-500 font-semibold"
                  onClick={() => removeReservation(reservation)}
                >
                  odstranit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!!msg.length && <p className="text-green-500 text-lg">{msg}</p>}
    </div>
  );
}
