"use client";

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { AiOutlineClose } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { firebaseLogin, firebaseSignup, FirebaseUserResult, auth, firebaseResetPassword } from "@/lib/firebase"
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logIn, logOut } from "@/lib/features/user/userSlice";
import { closeModal } from "@/lib/features/modal/modalSlice";
import styles from "./loginModal.module.css";


const LoginModal: React.FC = () => {

  enum SignState {
    signIn,
    signUp,
    resetPassword
  }

  const switchSignState = (newState: SignState) => {
    setSignState(newState);
    setErrMsg("");
  }

  const validateEmailAndPassword = (): boolean => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (trimmedEmail === "") {
      setErrMsg("Please enter email");
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmedEmail)) {
      setErrMsg("Please enter valid email");
      return false;
    }
    if (trimmedPassword === "") {
      setErrMsg("Please enter password");
      return false;
    }
    return true;
  }

  const userLogin = (uid: string) => {
    setEmail("");
    setPassword("");
    dispatch(logIn(uid));
    dispatch(closeModal());
    if (pathname === "/") {
      router.push("/for-you");
    }
  }

  const authenticateUser = async () => {
    let fbres: FirebaseUserResult;
    setErrMsg("");
    if (!validateEmailAndPassword()) {
      return;
    }
    if (signState === SignState.signIn) {
      fbres = await firebaseLogin(email, password);
    } else {
      fbres = await firebaseSignup(email, password);
    }
    if (fbres.user) {
      userLogin(fbres.user.uid);
    } else {
      setErrMsg(fbres.message.split('/')[1].replaceAll("-", " "));
    }
  }

  const guestSignIn = async () => {
    let fbres: FirebaseUserResult;
    setErrMsg("");
    fbres = await firebaseLogin("test2@email.com", "test2password");
    if (fbres.user) {
      userLogin(fbres.user.uid);
    } else {
      setErrMsg(fbres.message.split('/')[1].replaceAll("-", " "));
    }
  }

  const resetPassword = async () => {
    let res: string = "";
    if (!email.trim()) {
      res = "Please enter email";
    } else {
      res = await firebaseResetPassword(email);
    }
    if (res) {
      setErrMsg(res.split('/')[1].replaceAll("-", " "));
    } else {
      dispatch(closeModal());
    }
  }

  const pathname = usePathname();
  const router = useRouter();

  const [signState, setSignState] = useState<SignState>(SignState.signIn);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const modal = useAppSelector(state => state.modal);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!user || !user.isLoggedIn || (user.firebaseUID != firebaseUser.uid)) {
          userLogin(firebaseUser.uid);
        }
      } else {
        setEmail("");
        setPassword("");
        dispatch(logOut());
      }
    })

    return () => unsubscribe(); // Cleanup the observer on unmount
  }, []);


  if (!modal.isOpen || user.isLoggedIn) {
    return null;
  }


  // Use createPortal to render outside the main DOM hierarchy
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => dispatch(closeModal())}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button onClick={() => dispatch(closeModal())}>
            <AiOutlineClose style={{ fontSize: "26px", strokeWidth: 18 }} />
          </button>
        </div>
        {signState === SignState.resetPassword && (
          <>
            <div className={styles.body}>
              <h3>Reset your password</h3>
              {errMsg && (
                <div className={styles.error}>
                  Reset failed: {errMsg}
                </div>
              )}
              <input
                type="email"
                className={styles.input}
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
              />
              <button
                className={styles.btn}
                onClick={resetPassword}
              >
                Send reset password link
              </button>
            </div>
            <div className={styles.forgot}> </div>
            <button
              className={styles.btnRegister}
              onClick={() => switchSignState(SignState.signIn)}
            >
              Go to login
            </button>
          </>
        )}
        {signState === SignState.signUp && (
          <>
            <div className={styles.body}>
              <h3>Sign up to Summarist</h3>
              {errMsg && (
                <div className={styles.error}>
                  Sign up failed: {errMsg}
                </div>
              )}
              <button className={styles.btnGoogle}>
                <div className={styles.btnImg}>
                  <img src="/google.png" alt="" width="36px" height="36px" />
                </div>
                <div className={styles.btnText}>Sign up with Google</div>
              </button>
              <div className={styles.divider}>or</div>
              <input
                type="email"
                className={styles.input}
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
              />
              <input
                type="password"
                className={styles.input}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
              <button className={styles.btn} onClick={authenticateUser}>Sign up</button>
            </div>
            <div className={styles.forgot}>
            </div>
            <button
              className={styles.btnRegister}
              onClick={() => switchSignState(SignState.signIn)}
            >
              Already have an acccount?
            </button>
          </>
        )}
        {signState === SignState.signIn && (
          <>
            <div className={styles.body}>
              <h3>Log in to Summarist</h3>
              {errMsg && (
                <div className={styles.error}>
                  Login failed: {errMsg}
                </div>
              )}
              <button className={styles.btnGuest} onClick={guestSignIn}>
                <div className={styles.btnImg}>
                  <FaUserAlt style={{ paddingLeft: "4px", paddingTop: "4px" }} />
                </div>
                <div className={styles.btnText}>Login as a Guest</div>
              </button>
              <div className={styles.divider}>or</div>
              <button className={styles.btnGoogle}>
                <div className={styles.btnImg}>
                  <img src="/google.png" alt="" width="36px" height="36px" style={{ backgroundColor: "white", padding: "4px", borderRadius: "6px" }} />
                </div>
                <div className={styles.btnText}>Login with Google</div>
              </button>
              <div className={styles.divider}>or</div>
              <input
                type="email"
                className={styles.input}
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
              />
              <input
                type="password"
                className={styles.input}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
              <button className={styles.btn} onClick={authenticateUser}>Login</button>
            </div>
            <div
              className={styles.forgot}
              onClick={() => switchSignState(SignState.resetPassword)}
            >
              Forgot your password?
            </div>
            <button
              className={styles.btnRegister}
              onClick={() => switchSignState(SignState.signUp)}
            >
              Don't have an account?
            </button>
          </>
        )}
      </div>
    </div >,
    document.body
  );
};

export default LoginModal;
