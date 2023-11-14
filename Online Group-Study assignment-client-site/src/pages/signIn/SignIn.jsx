import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { context } from "../../components/Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const SignIn = () => {

    const { signIn, createUserWithGoogle } = useContext(context);

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = e => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const email = form.get('email');
        const password = form.get('password');

        signIn(email, password)
            .then(result => {
                toast('Successfully Sign In', result.user);
                navigate(location?.state ? location.state : '/');
            })
            .catch(error => {
                toast('Invalid email or password');
                console.log(error);
            })
    };

    const handleGoogle = () => {
        createUserWithGoogle()
            .then(result => {
                console.log(result.user.email);
                navigate(location?.state ? location.state : '/');
                toast('Successfully SignIn with Google');
            })
            .catch(error => {
                toast(error.message);
            })
    }

    return (
        <div className="hero bg-base-200 max-w-7xl mx-auto flex flex-col pb-8">
            <ToastContainer />
            <div>
                <form className="card-body" onSubmit={handleLogin}>
                    <h2 className="text-5xl mb-2">Please, Log In</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" placeholder="Email" name='email' className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" placeholder="Password" name='password' className="input input-bordered" required />
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary">Login</button>
                        <p className="mt-2">Do not have an account? <Link to='/register' className="text-blue-500 font-bold">Sign Up</Link></p>
                    </div>
                </form>
            </div>

            {/* login with google button */}
            <div>
                <button onClick={handleGoogle} className="btn bg-slate-300">Login with Google</button>
            </div>
        </div>
    )
}

export default SignIn