"use client";

import { useState } from 'react';
import styles from "./faqAccordian.module.css";
import { GoChevronDown } from 'react-icons/go';


const FAQAccordion = ({ faqs }: { faqs: { question: string, answer: string }[] }) => {
  const [activeId, setActiveId] = useState<number | null>(0);

  const toggleAccordion = (id: number | null) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className={styles.faqWrapper}>

      {faqs.map((item, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.header} onClick={() => toggleAccordion(index)}>
            <div className={styles.title}>
              {item.question}
            </div>
            <GoChevronDown className={`${styles.icon} ${activeId === index ? styles.rotate : ""}`} />
          </div>
          <div className={`${styles.body} ${activeId === index ? styles.open : ""}`}>
            <span>{item.answer}</span>
          </div>
        </div>
      ))}

    </div>
  );
};

export default FAQAccordion;
