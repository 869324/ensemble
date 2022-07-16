import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./signupForm.module.scss";

function SignupForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ userType: 1 });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function signup(e) {
    e.preventDefault();
    dispatch(signup(formData));
  }

  return (
    <form onSubmit={signup} className={styles.form}>
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
        <label className={styles.label}>Firstname</label>
        <input
          className={styles.input}
          name="firstname"
          type="text"
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputDiv}>
        <label className={styles.label}>Lastname</label>
        <input
          className={styles.input}
          name="lastname"
          type="text"
          onChange={handleChange}
          required
        />
      </div>

      <button id={styles.submit} type="submit">
        Submit
      </button>
    </form>
  );
}

export default SignupForm;
