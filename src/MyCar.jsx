import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function MyCar({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.email);
      getDoc(docRef).then((res) => {
        const { spz, number } = res.data();
        setForm({ spz, number });
      });
    } else {
      navigate("/");
    }
  }, [user]);

  const handleClick = () => {
    const docRef = doc(db, "users", user.email);
    updateDoc(docRef, {
      ...form,
    });
    setMsg("data úspěšně změněna");
  };

  const changeInput = (e) => {
    setForm((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  if (!form) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Vaše auto</h2>
      <div className="flex gap-2">
        <input
          className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="SPZ"
          name="spz"
          value={form.spz}
          onChange={changeInput}
        />
        <input
          className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="number"
          placeholder="Tel. číslo"
          value={form.number}
          onChange={changeInput}
        />
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          type="button"
          onClick={handleClick}
        >
          Uložit
        </button>
      </div>
      {!!msg.length && <p className="text-green-600">{msg}</p>}
    </div>
  );
}
