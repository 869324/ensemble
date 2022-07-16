import styles from "./signup.module.scss";

import SignupForm from "./SignupForm/signupForm";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h2 className={styles.h2}>Create Ensemble Manager Account</h2>

          <SignupForm />

          <Link to="/login" id={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Signup;
