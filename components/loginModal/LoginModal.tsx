"use client";

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AiOutlineClose } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { AuthenticationType, FirebaseUserResult } from "@/lib/types";
import {
  auth,
  firebaseAuthenticate,
  firebaseResetPassword,
  firebaseGetUserData
} from "@/lib/firebase"
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logIn, logOut, UserState } from "@/lib/features/user/userSlice";
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
    setEmail(email.trim());
    if (email === "") {
      setErrMsg("Please enter email");
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setErrMsg("Please enter valid email");
      return false;
    }
    if (signState === SignState.signIn || signState === SignState.signUp) {
      setPassword(password.trim());
      if (password === "") {
        setErrMsg("Please enter password");
        return false;
      }
    }
    return true;
  }

  const userLogin = async (user: User) => {
    const userState: UserState = await firebaseGetUserData(user);
    setEmail("");
    setPassword("");
    dispatch(logIn(userState));
    dispatch(closeModal());
    if (pathname === "/") {
      router.push("/for-you");
    }
    setSignState(SignState.signIn);
  }

  const authenticateUser = async (authType: AuthenticationType) => {
    let fbres: FirebaseUserResult = { user: null, message: "" };
    setErrMsg("");
    if (authType === AuthenticationType.userLogin || authType === AuthenticationType.userSignup) {
      if (!validateEmailAndPassword()) {
        return;
      }
    }
    setIsAuthenticating(authType);
    switch (authType) {
      case AuthenticationType.googleLogin:
      case AuthenticationType.userLogin:
      case AuthenticationType.userSignup:
        fbres = await firebaseAuthenticate(authType, email, password);
        break;
      case AuthenticationType.guestLogin:
        fbres = await firebaseAuthenticate(authType, "test2@email.com", "test2password");
        break;
      case AuthenticationType.resetPassword:
      // handled elsewhere
      default:
        break;
    }
    setIsAuthenticating(AuthenticationType.none);
    if (fbres.user) {
      // let useEffect catch onAuthStateChanged and call userLogin
      //userLogin(fbres.user);
    } else {
      setErrMsg(fbres.message.split('/')[1].replaceAll("-", " "));
    }
  }

  const resetPassword = async () => {
    let res: string = "";
    if (!validateEmailAndPassword()) {
      return;
    }
    setIsAuthenticating(AuthenticationType.resetPassword);
    res = await firebaseResetPassword(email);
    setIsAuthenticating(AuthenticationType.none);
    if (res) {
      setErrMsg(res.split('/')[1].replaceAll("-", " "));
    } else {
      dispatch(closeModal());
      setSignState(SignState.signIn);
    }
  }

  const pathname = usePathname();
  const router = useRouter();

  const [signState, setSignState] = useState<SignState>(SignState.signIn);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<AuthenticationType>(AuthenticationType.none);

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const modal = useAppSelector(state => state.modal);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!user || !user.isLoggedIn || (user.firebaseUID != firebaseUser.uid)) {
          userLogin(firebaseUser);
        }
      } else {
        setEmail("");
        setPassword("");
        dispatch(logOut());
      }
    })

    return () => unsubscribe(); // Cleanup the observer on unmount
  }, [user]);


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
                onChange={(e) => { setEmail(e.target.value) }}
              />
              <button
                className={styles.btn}
                onClick={resetPassword}
              >
                {isAuthenticating === AuthenticationType.resetPassword ? (
                  <div className={styles.loader}></div>
                ) : (
                  <span>Send reset password link</span>
                )}
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
              <button className={styles.btnGoogle} onClick={() => authenticateUser(AuthenticationType.googleLogin)}>
                <div className={styles.btnImg}>
                  <img src="/google.png" alt="" width="36px" height="36px" style={{ backgroundColor: "white", padding: "4px", borderRadius: "6px" }} />
                </div>
                {isAuthenticating === AuthenticationType.googleLogin ? (
                  <div className={styles.loader}></div>
                ) : (
                  <div className={styles.btnText}>Sign up with Google</div>
                )}
              </button>
              <div className={styles.divider}>or</div>
              <input
                type="email"
                className={styles.input}
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
              />
              <input
                type="password"
                className={styles.input}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
              />
              <button className={styles.btn} onClick={() => authenticateUser(AuthenticationType.userSignup)}>
                {isAuthenticating === AuthenticationType.userSignup ? (
                  <div className={styles.loader}></div>
                ) : (
                  <span>Sign up</span>
                )}
              </button>
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
              <button className={styles.btnGuest} onClick={() => authenticateUser(AuthenticationType.guestLogin)}>
                <div className={styles.btnImg}>
                  <FaUserAlt style={{ paddingLeft: "4px", paddingTop: "4px" }} />
                </div>
                {isAuthenticating === AuthenticationType.guestLogin ? (
                  <div className={styles.loader}></div>
                ) : (
                  <div className={styles.btnText}>Login as a Guest</div>
                )}
              </button>
              <div className={styles.divider}>or</div>
              <button className={styles.btnGoogle} onClick={() => authenticateUser(AuthenticationType.googleLogin)}>
                <div className={styles.btnImg}>
                  <img src="/google.png" alt="" width="36px" height="36px" style={{ backgroundColor: "white", padding: "4px", borderRadius: "6px" }} />
                </div>
                {isAuthenticating === AuthenticationType.googleLogin ? (
                  <div className={styles.loader}></div>
                ) : (
                  <div className={styles.btnText}>Login with Google</div>
                )}
              </button>
              <div className={styles.divider}>or</div>
              <input
                type="email"
                className={styles.input}
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
              />
              <input
                type="password"
                className={styles.input}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
              />
              <button className={styles.btn} onClick={() => authenticateUser(AuthenticationType.userLogin)}>
                {isAuthenticating === AuthenticationType.userLogin ? (
                  <div className={styles.loader}></div>
                ) : (
                  <span>Login</span>
                )}
              </button>
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
