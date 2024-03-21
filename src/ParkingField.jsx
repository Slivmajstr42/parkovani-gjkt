import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const ParkingField = ({ user }) => {
  const [parkingPlaces, setParkingPlaces] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [activeSpot, setActiveSpot] = useState(null);
  const [formMessage, setFormMessage] = useState("");
  const [data, setData] = useState([]);

  const handleSave = () => {
    addDoc(collection(db, "users place"), {
      ...activeSpot,
    });
    setActiveSpot(null);
    setFormMessage("Parkovací místo uloženo");

    const payload = {
      summary: "Parkování GJKT",
      description: `Místo ${activeSpot.location}`,
      start: {
        date: dayjs(activeSpot.date, "DD. MM. YYYY").format("YYYY-MM-DD"),
      },
      end: {
        date: dayjs(activeSpot.date, "DD. MM. YYYY").format("YYYY-MM-DD"),
      },
    };

    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      }, // dopsat bodycko
      body: JSON.stringify(payload),
    });
  };

  const formChangeMethod = (e) => {
    setActiveSpot((val) => ({
      ...val,
      [e.target.name]: e.target.value,
    }));
  };

  const checkParkingSpace = (location, reservation) => {
    if (!reservation) {
      setFormMessage("");
      setActiveSpot({
        location,
        email: user.email,
        date: date.format("DD. MM. YYYY"),
        spz: user.spz,
        number: user.number,
      });
    }
  };

  useEffect(() => {
    getDocs(collection(db, "parking places")).then((data) => {
      let arr = [];
      data.forEach((item) => {
        arr.push(item.data());
      });
      setParkingPlaces(arr);
    });

    onSnapshot(collection(db, "users place"), (snapshot) => {
      let data = [];
      snapshot.docs.forEach((item) => {
        data.push({ ...item.data() });
      });
      setData(data);
    });

    getDocs(collection(db, "blocking")).then((data) => {
      let arr = [];
      data.forEach((item) => {
        arr.push(item.data());
      });
      setBlocks(arr);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center mb-3 gap-2">
        <img
          src="/arrow.png"
          className="w-12 rotate-180"
          onClick={() => setDate(date.subtract(1, "day"))}
        />
        <p className="text-3xl">{date.format("DD. MM.")}</p>
        <img
          src="/arrow.png"
          className="w-12"
          onClick={() => setDate(date.add(1, "day"))}
        />
      </div>
      <div
        style={{
          gridTemplateColumns: "repeat(8, 140px)",
          gridTemplateRows: "repeat(2,220px)",
        }}
        className="w-full grid gap-1 overflow-x-scroll"
      >
        {parkingPlaces.map(({ location }, i) => {
          const reservation = data.find((item) => {
            return (
              item.date === date.format("DD. MM. YYYY") &&
              item.location === location
            );
          });

          const blocking = blocks.find((block) => {
            return (
              block.date === date.format("DD. MM. YYYY") &&
              block.slots.includes(location)
            );
          });

          return (
            <div
              key={i}
              className={`bg-gray-500 cursor-pointer flex flex-col ${
                blocking ? "bg-red-500" : reservation ? "" : "bg-green-500"
              }`}
              onClick={() => checkParkingSpace(location, reservation)}
            >
              <p className="font-semibold">{location}</p>
              {!blocking && reservation && (
                <div className="mt-auto">
                  <p className="text-center">{reservation.number}</p>
                  <p className="text-sm text-center">
                    {reservation.email.replace("@gjkt.eu", "")}
                  </p>
                  <p className="text-xl text-center">{reservation.spz}</p>
                </div>
              )}
              {blocking && (
                <p className="font-semibold text-xl text-center">Blokováno!</p>
              )}
            </div>
          );
        })}
      </div>
      {!!formMessage.length && (
        <p className="text-green-500 text-lg">{formMessage}</p>
      )}
      {activeSpot && (
        <div className="flex flex-col mt-4 gap-2">
          <h2 className="text-xl font-semibold">Rezervace místa</h2>
          <input
            className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Email"
            name="email"
            value={activeSpot.email}
            onChange={formChangeMethod}
          />
          <input
            className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Místo"
            name="location"
            value={activeSpot.location}
            onChange={formChangeMethod}
          />
          <input
            className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Datum"
            name="date"
            value={activeSpot.date}
            onChange={formChangeMethod}
          />
          <input
            className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="SPZ"
            name="spz"
            value={activeSpot.spz}
            onChange={formChangeMethod}
          />
          <input
            className="shadow appearance-none border rounded w-40 py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Tel. číslo"
            name="number"
            value={activeSpot.number}
            onChange={formChangeMethod}
          />
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 w-40"
            type="button"
            onClick={handleSave}
          >
            Uložit
          </button>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 w-40"
            type="button"
            onClick={() => setActiveSpot(null)}
            disabled={
              !activeSpot.location.length ||
              !activeSpot.email ||
              !activeSpot.date.length ||
              !activeSpot.spz.length
            }
          >
            Zrušit
          </button>
        </div>
      )}
    </div>
  );
};

export default ParkingField;
