import styles from "./login.module.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../StateManagement/Reducers/userReducer";

function Login() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const userState = useSelector((state) => state.user);

  useEffect(() => {}, [userState]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit() {
    dispatch(login(formData));
  }

  return (
    <main style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h2>Login</h2>

          <form onSubmit={onSubmit}>
            <div className={styles.inputDiv}>
              <label>Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputDiv}>
              <label>Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Submit</button>
          </form>

          <button>Forgot your password?</button>
        </div>
      </div>
    </main>
  );
}

export default Login;
