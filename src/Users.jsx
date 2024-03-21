import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const roles = [
  { id: 1, name: "admin" },
  { id: 2, name: "uživatel" },
];

export default function Users({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const [userRemove, setUserRemove] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState("");

  const handleSubmit = () => {
    setDoc(doc(db, "users", email), {
      email: email,
      role: roles.find((r) => r.name === role).id,
      spz: "",
    });
    setMsg("Uživatel úspěšně přidán");
    setRole("");
    setEmail("");
  };

  const removeUser = (user) => {
    setUserRemove(user);
    setDeleteMsg("");
  };

  const handleDelete = () => {
    deleteDoc(doc(db, "users", userRemove.email));
    setDeleteMsg(`Uživatel ${userRemove.email} byl odstraněn`);
    setUserRemove(null);
  };

  useEffect(() => {
    if (user && user.role === 1) {
      getDocs(collection(db, "users")).then((data) => {
        let arr = [];
        data.forEach((item) => arr.push(item.data()));
        setUsers(arr);
      });
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-xl font-semibold">Všichni uživatelé</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-left">Role</th>
              <th className="text-left">Email</th>
              <th className="text-left">Spz</th>
              <th className="text-left">Tel. číslo</th>
              <th className="text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.spz}</td>
                <td>{user.number}</td>
                <td>
                  <button
                    className="text-red-500 font-semibold"
                    onClick={() => removeUser(user)}
                  >
                    odstranit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Přidat uživatele</h2>
        <div className="flex gap-3">
          <input
            className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            id="countries"
            className="shadow appearance-none border rounded w-40 py-2 px-3
      leading-tight focus:outline-none focus:shadow-outline"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Role</option>
            <option value="admin">Admin</option>
            <option value="uživatel">Uživatel</option>
          </select>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            type="submit"
            onClick={handleSubmit}
            disabled={!email.length || !role.length}
          >
            Uložit
          </button>
        </div>
        {!!msg.length && (
          <p className="text-green-600">uživatel úspěšně přidán</p>
        )}
      </div>
      <div>
        {(!!userRemove || !!deleteMsg.length) && (
          <h2 className="text-xl font-semibold">Odstranit uživatele</h2>
        )}
        {!!userRemove && (
          <div>
            <p>Opravdu odstranit uživatele {userRemove.email}?</p>
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
              type="submit"
              onClick={handleDelete}
            >
              Odstranit
            </button>
          </div>
        )}
        {!!deleteMsg.length && (
          <div>
            <p>{deleteMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
