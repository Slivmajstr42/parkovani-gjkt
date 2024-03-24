import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import { Outlet } from "react-router-dom";
export default function TopBar({ user }) {
  return (
    <>
      <div className="flex justify-between px-5 border-b-2 shadow-2xl py-2 items-center">
        <Link to="/">
          <h1 className="md:text-3xl text-2xl font-semibold">
            Parkování GJKT- test
          </h1>
        </Link>
        <div className="flex gap-3 items-center">
          {user && user.role === 1 && (
            <>
              <Link to="/blocking">
                <img className="md:w-11 w-8" src="/block.png" />
              </Link>
              <Link to="/reservations">
                <img className="md:w-11 w-8" src="/calendar.png" />
              </Link>
              <Link to="/users">
                <img className="md:w-11 w-8" src="/user.png" />
              </Link>
            </>
          )}
          {user && (
            <Link to="/my-car">
              <img className="md:w-11 w-8" src="/car.png" />
            </Link>
          )}
          <SignIn user={user} />
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-10">
        <Outlet />
      </div>
    </>
  );
}
