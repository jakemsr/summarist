"use client";

import { useState } from "react";
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { RiPlantFill } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import { auth, db } from "@/lib/firebase";
import FAQAccordion from "@/components/faqAccordian/FAQAccordian"
import Footer from "@/components/footer/Footer";
import styles from "./choosePlan.module.css"

const faqs = [
  {
    question: "How does the free 7-day trial work?",
    answer: "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial."
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer: "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option."
  },
  {
    question: "What's included in the Premium plan?",
    answer: "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle."
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day."
  },
];


const ChoosePlan = () => {

  enum Plans {
    premium,
    plus
  }

  const goToPayments = async () => {

    setIsPaying(true);

    const price = activePlan === Plans.plus ? "price_1TdpK7BFuLNB5vaucfYQkVvy" : "price_1TdpJEBFuLNB5vaud9HTPFIn";

    if (!auth.currentUser) {
      return;
    }

    const docRef = await addDoc(
      collection(
        db,
        "customers",
        auth.currentUser.uid,
        "checkout_sessions"
      ),
      {
        price: price,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    interface StripeData {
      error: FirebaseError,
      url: string
    }

    // Wait for the CheckoutSession to get attached by the extension
    onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data() as StripeData;
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
        setIsPaying(false);
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      }
    });
    // let the spinner go because redirection takes a moment and
    // isPaying will be set to false by default on the next render
    //setIsPaying(false);
  }

  const [activePlan, setActivePlan] = useState<Plans>(Plans.plus);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  return (
    <div className={styles.plan}>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>
          <div className={styles.title}>
            Get unlimited access to many amazing books to read
          </div>
          <div className={styles.subTitle}>
            Turn ordinary moments into amazing learning opportunities
          </div>
          <figure className={styles.imgMask}>
            <img src="/pricing-top.png" alt="" width={860} height={722} decoding="async" loading="lazy" />
          </figure>
        </div>
      </div>
      <div className="row">
        <div className="container">
          <div className={styles.featuresWrapper}>

            <div className={styles.features}>
              <figure className={styles.featuresIcon}>
                <BsFileEarmarkTextFill />
              </figure>
              <div className={styles.featuresText}>
                <b>Key ideas in a few min</b>
                &nbsp;with many books to read
              </div>
            </div>

            <div className={styles.features}>
              <figure className={styles.featuresIcon}>
                <RiPlantFill />
              </figure>
              <div className={styles.featuresText}>
                <b>3 million</b>
                &nbsp;people growing with Summarist every day"
              </div>
            </div>

            <div className={styles.features}>
              <figure className={styles.featuresIcon}>
                <FaHandshake />
              </figure>
              <div className={styles.featuresText}>
                <b>Precise recommentations</b>
                &nbsp;collections curated by experts
              </div>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            Choose the plan that fits you
          </div>

          <div
            className={`${styles.planCard} ${activePlan === Plans.plus ? styles.planCardActive : ""}`}
            onClick={() => setActivePlan(Plans.plus)}
          >
            <div className={styles.planCardCircle}>
              {activePlan === Plans.plus && <div className={styles.planCardDot}></div>}
            </div>
            <div className={styles.planCardContent}>
              <div className={styles.planCardTitle}>
                Premium Plus Yearly
              </div>
              <div className={styles.planCardPrice}>
                $99.99/year
              </div>
              <div className={styles.planCardText}>
                7-day free trial included
              </div>
            </div>
          </div>

          <div className={styles.planCardSeparator}>
            <div className={styles.planSeparator}>or</div>
          </div>

          <div
            className={`${styles.planCard} ${activePlan === Plans.premium ? styles.planCardActive : ""}`}
            onClick={() => setActivePlan(Plans.premium)}
          >
            <div className={styles.planCardCircle}>
              {activePlan === Plans.premium && <div className={styles.planCardDot}></div>}
            </div>
            <div className={styles.planCardContent}>
              <div className={styles.planCardTitle}>
                Premium Monthly
              </div>
              <div className={styles.planCardPrice}>
                $9.99/month
              </div>
              <div className={styles.planCardText}>
                No trial included
              </div>
            </div>
          </div>

          <div className={styles.planCardCta}>
            <span className={styles.btnWrapper}>
              <button
                className="btn"
                style={{ width: "300px" }}
                onClick={goToPayments}
              >
                {isPaying === true ? (
                  <div className={styles.loader}></div>
                ) : (
                  activePlan === Plans.plus ? (
                    <span>Start your 7-day free trial</span>
                  ) : (
                    <span>Start your first month</span>
                  )
              )}
              </button>
            </span>
            <div className={styles.disclaimer}>
              {activePlan === Plans.plus ? (
                <span>Cancel your trial at any time before it ends, and you won't be charged.</span>
              ) : (
                <span>30-day money back guarantee, no questions asked.</span>
              )}
            </div>
          </div>

          <FAQAccordion faqs={faqs} />

        </div>
      </div>

      <Footer />

    </div>
  )
}

export default ChoosePlan
