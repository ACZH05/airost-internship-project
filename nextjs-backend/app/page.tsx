import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>System Status</h1>
        
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusIndicator} data-status="operational" />
            <h2>API Server</h2>
            <p>Operational</p>
          </div>

          {/* <div className={styles.statusCard}>
            <div className={styles.statusIndicator} data-status="operational" />
            <h2>Database</h2>
            <p>Operational</p>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusIndicator} data-status="operational" />
            <h2>Authentication</h2>
            <p>Operational</p>
          </div> */}
        </div>

        {/* <div className={styles.metrics}>
          <h2>System Metrics</h2>
          <div className={styles.metricsList}>
            <div className={styles.metric}>
              <span>Uptime</span>
              <strong>99.9%</strong>
            </div>
            <div className={styles.metric}>
              <span>Response Time</span>
              <strong>124ms</strong>
            </div>
            <div className={styles.metric}>
              <span>Active Users</span>
              <strong>1,234</strong>
            </div>
          </div>
        </div> */}
      </main>

      <footer className={styles.footer}>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}
