import styles from "./footer.module.css";

const Footer = () => {
  return (
    <section id="footer" className={styles.footer}>
      <div className="container">
        <div className="row">
          <div className={styles.topWrapper}>
            <div className={styles.block}>
              <div className={styles.linkTitle}>Actions</div>
              <div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Summarist Magazine</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Cancel Subscription</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Help</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Contact us</a>
                </div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.linkTitle}>Useful Links</div>
              <div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Pricing</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Summarist Business</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Gift Cards</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Authors & Publishers</a>
                </div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.linkTitle}>Company</div>
              <div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>About</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Careers</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Partners</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Code of Conduct</a>
                </div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.linkTitle}>Other</div>
              <div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Sitemap</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Legal Notice</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Terms of Service</a>
                </div>
                <div className={styles.linkWrapper}>
                  <a className={styles.link}>Privacy Policies</a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.copyrightWrapper}>
            <div className={styles.copyright}>
              Copyright &copy; 2023 Summarist.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer


