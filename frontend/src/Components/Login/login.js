import styles from "./login.module.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetLogin } from "../../StateManagement/Reducers/userReducer";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    const { user, loading, error, status, tried } = userState;

    if (tried) {
      if (status) {
        swal({
          title: "Login Successful",
          icon: "success",
        });
        user.configuredPassword == 1
          ? navigate("/user")
          : navigate("/configurePassword");
      } else if (!loading && error !== "") {
        swal({
          title: "Login failed",
          icon: "error",
          text: error,
        });
      }
    }
  }, [userState]);

  useEffect(() => {
    return () => {
      dispatch(resetLogin());
    };
  }, []);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    dispatch(login(formData));
  }

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h2 className={styles.h2}>Sign In to Ensemble Manager</h2>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.inputDiv}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                name="email"
                type="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputDiv}>
              <label className={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                className={styles.input}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Submit</button>
          </form>

          <button id={styles.forgotPassword}>Forgot your password?</button>
        </div>
      </div>
    </main>
  );
}

export default Login;
