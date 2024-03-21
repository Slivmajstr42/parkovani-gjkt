import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "./firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

export default function Blocking() {
  const [checkboxes, setCheckboxes] = useState(null);
  const [date, setDate] = useState(null);
  const [places, setPlaces] = useState([]);
  const [data, setData] = useState();
  const [cancelBlock, setCancelBlock] = useState(null);

  useEffect(() => {
    getDocs(collection(db, "parking places")).then((data) => {
      let arr = [];
      data.forEach((item) => {
        arr.push(item.data());
      });
      setPlaces(arr);
    });

    onSnapshot(collection(db, "blocking"), (snapshot) => {
      let data = [];
      snapshot.docs.forEach((item) => {
        data.push({ ...item.data(), id: item.id });
      });
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (places.length) {
      const object = {};

      places.forEach((item) => {
        object[item.location] = false;
      });

      setCheckboxes(object);
    }
  }, [places]);

  const handleChange = (location, isCheck) => {
    setCheckboxes((prev) => ({ ...prev, [location]: isCheck }));
  };

  const handleSubmit = () => {
    const trueValues = Object.entries(checkboxes)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    addDoc(collection(db, "blocking"), {
      slots: trueValues,
      date: dayjs(date).format("DD. MM. YYYY"),
    });
  };

  const handleSelectAll = () => {
    const object = {};

    places.forEach((item) => {
      object[item.location] = Object.values(checkboxes).some((i) => i === true)
        ? false
        : true;
    });
    setCheckboxes(object);
  };

  const deleteBlock = () => {
    deleteDoc(doc(db, "blocking", cancelBlock.id));
    setCancelBlock(null);
  };

  if (!checkboxes) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Blokace</h2>
      {data.length ? (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-left">Datum</th>
              <th className="text-left">Místa</th>
              <th className="text-left"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((block, i) => (
              <tr key={i}>
                <td>{block.date}</td>
                <td>{block.slots.toString()}</td>
                <td>
                  <button
                    className="text-red-500 font-semibold"
                    onClick={() => setCancelBlock(block)}
                  >
                    zrušit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>žádné blokace nejsou vytvořeny</p>
      )}
      {cancelBlock && (
        <div>
          <p className="text-red-500 font-semibold">
            opravdu chcete odstranit blokaci na den {cancelBlock.date} a na
            místa {cancelBlock.slots.toString()}?
          </p>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 w-40"
            type="button"
            onClick={deleteBlock}
          >
            potvrdit
          </button>
        </div>
      )}
      <div className="flex gap-3 items-center">
        <h2 className="text-xl font-semibold">Nová blokace</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="all-spaces">Označit všechna místa</label>
          <input onChange={handleSelectAll} id="all-spaces" type="checkbox" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-8 gap-2">
          {places.map(({ location }, i) => (
            <div key={i} className="flex">
              <label htmlFor={`location-${i}`} className="mr-2">
                {location}
              </label>
              <input
                checked={checkboxes[location]}
                onChange={(e) => handleChange(location, e.target.checked)}
                id={`location-${i}`}
                type="checkbox"
              />
            </div>
          ))}
        </div>
        <Calendar tileClassName="tile" onChange={setDate} value={date} />
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 w-40"
          type="button"
          onClick={handleSubmit}
          disabled={!date || !Object.values(checkboxes).some((i) => i)}
        >
          Uložit
        </button>
      </div>
    </div>
  );
}
