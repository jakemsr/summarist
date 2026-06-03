"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UserSubscription } from "@/lib/types";
import { openModal } from "@/lib/features/modal/modalSlice";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

const Settings = () => {

  const router = useRouter();
  
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  return (
    <>
      <div className={styles.title}>Settings</div>
      {user.isLoggedIn ? (
        <>
          <div className={styles.content}>
            <div className={styles.subTitle}>Your Subscription plan</div>
            <div className={styles.settingsText}>{user.subscription}</div>
            {user.subscription === UserSubscription.basic && (
              <button
                className="btn"
                style={{ width: "fit-content" }}
                onClick={() => router.push("/choose-plan")}
              >
                Upgrade to Premium
              </button>
            )}
          </div>
          <div className={styles.content}>
            <div className={styles.subTitle}>Email</div>
            <div className={styles.settingsText}>{user.email}</div>
          </div>
        </>
      ) : (
        <div className={styles.wrapper}>
          <img src="/login.png" alt="login" />
          <div className={styles.loginText}>
            Log in to your account to see your details
          </div>
          <button className={styles.loginBtn} onClick={() => dispatch(openModal())}>Login</button>
        </div>
      )}
    </>
  )
}

export default Settings
