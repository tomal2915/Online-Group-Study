
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom"
import { toast } from "react-toastify";
import { context } from "../Context/AuthContext";
import { Twirl as Hamburger } from 'hamburger-react';

const Navbar = () => {

    const { user, logOut } = useContext(context);

    const [isOpen, setOpen] = useState(false);

    const handleSignOut = () => {
        logOut()
            .then(() => {
                toast('Successfully Logout');
            })
            .catch((error) => {
                toast(error.message);
            })
    }

    const closeMobileMenu = () => {
        setOpen(false);
    };

    const navLink = <>
        <li><NavLink to="/" onClick={closeMobileMenu} >Home</NavLink></li>
        <li><NavLink to="/assignments" onClick={closeMobileMenu}>Assignments</NavLink></li>
        <li><NavLink to="/myAssignments" onClick={closeMobileMenu}>My Assignments</NavLink></li>
        <li><NavLink to="/createAssignment" onClick={closeMobileMenu}>Create Assignments</NavLink></li>
        <li><NavLink to="/submittedAssignments" onClick={closeMobileMenu}>Submitted Assignments</NavLink></li>
    </>

    return (
        <div className="navbar bg-base-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <Hamburger toggled={isOpen} toggle={setOpen} color="#4FD1C5" />
                    </label>
                    {
                        isOpen && (
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                {navLink}
                            </ul>
                        )
                    }
                </div>
                <img src="https://i.ibb.co/f1Xphvk/removebg.png" alt="" className="w-[150px] h-[30px]" />
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLink}
                </ul>
            </div>
            {
                user ?
                    <div className="navbar-end">
                        <div className="flex flex-row gap-2 items-center bg-slate-300 rounded-lg p-2">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <img src={user.photoURL} />
                                </div>
                            </div>
                            <p className="font-bold ">{user.displayName}</p>
                        </div>
                        <button onClick={handleSignOut} className="btn bg-slate-300 ml-4">Sign Out</button>
                    </div>
                    :
                    <div className="navbar-end">
                        <Link to='/signIn'><button className="btn bg-slate-300">Log In</button></Link>
                    </div>
            }
        </div>
    )
}

export default Navbar