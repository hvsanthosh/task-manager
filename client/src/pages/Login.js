import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [auth, setAuth] = useState();

  // const navigate = useNavigate();
  // const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });
      if (res && res.data.token) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user.name,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        // navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p>Login page</p>
      <div id="login-form" className="w-100">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                value={email}
                type="email"
                className="form-control"
                id="inputEmail3"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Password
            </label>
            <div className="col-sm-10">
              <input
                value={password}
                type="password"
                className="form-control"
                id="inputPassword3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
