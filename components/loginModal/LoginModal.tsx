"use client";

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import { AiOutlineClose } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logIn } from "@/lib/features/user/userSlice";
import { closeModal } from "@/lib/features/modal/modalSlice";
import { login, signup, FBResult } from "@/lib/firebase"
import styles from "./loginModal.module.css";


const LoginModal: React.FC = () => {

  enum SignState {
    signIn,
    signUp,
    resetPassword
  }

  const router = useRouter();

  const [signState, setSignState] = useState<SignState>(SignState.signIn);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, seterrMsg] = useState<string>("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const modal = useAppSelector(state => state.modal);

  if (!modal.isOpen || user.isLoggedIn) {
    return null;
  }

  const userLogin = () => {
    dispatch(logIn());
    dispatch(closeModal());
    router.push("/for-you");
  }

  const switchSignState = (newState: SignState) => {
    setSignState(newState);
    seterrMsg("");
  }

  const userAuth = async () => {
    let fbres: FBResult;
    seterrMsg("");
    if (signState === SignState.signIn) {
      fbres = await login(email, password);
    } else {
      fbres = await signup(email, password);
    }
    if (fbres.user) {
      userLogin();
    } else {
      seterrMsg(fbres.message.split('/')[1].replaceAll("-", " "));
    }
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
              <button className={styles.btn}>Send reset password link</button>
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
                  <img src="/google.png" alt="" width="36px" height="36px" style={{ backgroundColor: "white", padding: "4px", borderRadius: "6px" }} />
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
              <button className={styles.btn} onClick={userAuth}>Sign up</button>
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
              <button className={styles.btnGuest} onClick={userLogin}>
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
              <button className={styles.btn} onClick={userAuth}>Login</button>
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
    document.body // Or a specific element like document.getElementById('modal-root')
  );
};

export default LoginModal;
