import os
import csv
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta

# Ensure output directory exists
OUTPUT_DIR = "./output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

CSV_PATH = os.path.join(OUTPUT_DIR, "tiktok_daily_metrics.csv")
PNG_PATH = os.path.join(OUTPUT_DIR, "tiktok_health_dashboard.png")
MD_PATH = os.path.join(OUTPUT_DIR, "TikTok_Executive_Diagnostic_Report.md")

N_DAYS = 90
BASE_DATE = datetime(2024, 1, 1)


def generate_csv():
    """Generate 90 days of synthetic TikTok core business metrics."""
    np.random.seed(42)
    dates = [BASE_DATE + timedelta(days=i) for i in range(N_DAYS)]
    n = N_DAYS

    # Base trends
    dau = 100000 + np.cumsum(np.random.normal(0, 800, n)) + np.linspace(0, 5000, n)
    gmv = dau * 0.0045 + np.random.normal(0, 200, n)
    retention = 0.25 + np.random.normal(0, 0.02, n)
    complaints = 120 + np.random.normal(0, 15, n)

    # Inject complaint spike around day 45 (0-indexed days 43-47)
    for i in range(43, 48):
        complaints[i] += np.random.randint(100, 160)

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Date", "DAU", "GMV", "Retention_D7", "User_Complaints"])
        for i in range(n):
            writer.writerow([
                dates[i].strftime("%Y-%m-%d"),
                int(dau[i]),
                round(gmv[i], 2),
                round(retention[i] * 100, 2),
                int(max(complaints[i], 0))
            ])
    return dates, dau, gmv, retention, complaints


def parse_csv():
    """Read the generated CSV into native arrays."""
    dates = []
    dau = []
    gmv = []
    retention = []
    complaints = []
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            dates.append(datetime.strptime(row["Date"], "%Y-%m-%d"))
            dau.append(int(row["DAU"]))
            gmv.append(float(row["GMV"]))
            retention.append(float(row["Retention_D7"]))
            complaints.append(int(row["User_Complaints"]))
    return (
        dates,
        np.array(dau, dtype=float),
        np.array(gmv, dtype=float),
        np.array(retention, dtype=float),
        np.array(complaints, dtype=float)
    )


def kpi_engine(dau, gmv, retention, complaints):
    """Compute core KPIs."""
    total_gmv = float(np.sum(gmv))
    avg_dau = int(np.mean(dau))
    arpu = total_gmv / np.sum(dau)
    avg_retention = float(np.mean(retention))
    avg_complaints = float(np.mean(complaints))
    return {
        "total_gmv": total_gmv,
        "avg_dau": avg_dau,
        "arpu": arpu,
        "avg_retention": avg_retention,
        "avg_complaints": avg_complaints,
    }


def detect_anomalies(dates, complaints, sigma=3):
    """Detect points beyond N-sigma using mean/std."""
    mean = float(np.mean(complaints))
    std = float(np.std(complaints))
    threshold = mean + sigma * std
    anomaly_indices = np.where(complaints > threshold)[0]
    anomalies = [(dates[i], int(complaints[i])) for i in anomaly_indices]
    return anomalies, threshold


def moving_average(arr, window=7):
    """Simple moving average via convolution."""
    kernel = np.ones(window) / window
    return np.convolve(arr, kernel, mode="valid")


def trend_mining(dau, gmv, retention, complaints):
    """Compute correlations, WoW comparisons and 7-day moving averages."""
    corr_dau_gmv = float(np.corrcoef(dau, gmv)[0, 1])
    corr_complaint_retention = float(np.corrcoef(complaints, retention)[0, 1])

    last_7_dau = float(np.mean(dau[-7:]))
    prev_7_dau = float(np.mean(dau[-14:-7]))
    last_7_gmv = float(np.mean(gmv[-7:]))
    prev_7_gmv = float(np.mean(gmv[-14:-7]))

    dau_ma7 = moving_average(dau, 7)
    gmv_ma7 = moving_average(gmv, 7)

    return {
        "corr_dau_gmv": corr_dau_gmv,
        "corr_complaint_retention": corr_complaint_retention,
        "dau_last7_avg": last_7_dau,
        "dau_prev7_avg": prev_7_dau,
        "gmv_last7_avg": last_7_gmv,
        "gmv_prev7_avg": prev_7_gmv,
        "dau_ma7": dau_ma7,
        "gmv_ma7": gmv_ma7,
    }


def plot_dashboard(dates, dau, gmv, retention, complaints, anomalies, threshold):
    """Plot DAU, GMV, Retention and Complaints with anomaly markers."""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("TikTok Health Dashboard (90-Day)", fontsize=16, fontweight="bold")

    x = mdates.date2num(dates)

    axes[0, 0].plot(x, dau, color="#1f77b4", linewidth=2)
    axes[0, 0].set_title("DAU Trend")
    axes[0, 0].set_ylabel("DAU")
    axes[0, 0].grid(True, alpha=0.3)
    axes[0, 0].xaxis.set_major_formatter(mdates.DateFormatter("%m-%d"))

    axes[0, 1].plot(x, gmv, color="#2ca02c", linewidth=2)
    axes[0, 1].set_title("GMV Trend")
    axes[0, 1].set_ylabel("GMV ($)")
    axes[0, 1].grid(True, alpha=0.3)
    axes[0, 1].xaxis.set_major_formatter(mdates.DateFormatter("%m-%d"))

    axes[1, 0].plot(x, retention, color="#ff7f0e", linewidth=2)
    axes[1, 0].set_title("D7 Retention")
    axes[1, 0].set_ylabel("Retention (%)")
    axes[1, 0].grid(True, alpha=0.3)
    axes[1, 0].xaxis.set_major_formatter(mdates.DateFormatter("%m-%d"))

    axes[1, 1].plot(x, complaints, color="#d62728", linewidth=2, label="Complaints")
    if anomalies:
        ax_dates = [mdates.date2num(a[0]) for a in anomalies]
        ax_vals = [a[1] for a in anomalies]
        axes[1, 1].scatter(ax_dates, ax_vals, color="black", zorder=5, label="Anomaly")
    axes[1, 1].axhline(threshold, color="gray", linestyle="--", label="3σ threshold")
    axes[1, 1].set_title("User Complaints & Anomalies")
    axes[1, 1].set_ylabel("Complaints")
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3)
    axes[1, 1].xaxis.set_major_formatter(mdates.DateFormatter("%m-%d"))

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig(PNG_PATH, dpi=150, bbox_inches="tight")
    plt.close()


def generate_report(kpis, anomalies, threshold, trend):
    """Generate executive Markdown diagnostic report."""
    if anomalies:
        anomaly_rows = [f"| {a[0].strftime('%Y-%m-%d')} | {a[1]} |" for a in anomalies]
    else:
        anomaly_rows = ["| — | — |"]
    anomaly_table = "\n".join(anomaly_rows)

    def strength_label(r):
        if abs(r) > 0.7:
            return "strong"
        if abs(r) > 0.4:
            return "moderate"
        return "weak"

    impact_label = "a negative relationship" if trend["corr_complaint_retention"] < -0.3 else "limited impact"

    md = f"""# TikTok Executive Diagnostic Report

## 1. KPI Overview

| Metric | Value |
|--------|-------|
| Total GMV | ${kpis['total_gmv']:,.2f} |
| Average DAU | {kpis['avg_dau']:,} |
| ARPU | ${kpis['arpu']:.4f} |
| Average D7 Retention | {kpis['avg_retention']:.2f}% |
| Average Daily Complaints | {kpis['avg_complaints']:.1f} |

## 2. Complaint Anomaly Detection (3-Sigma)

Threshold: {threshold:.1f}

| Date | User Complaints |
|------|-----------------|
{anomaly_table}

## 3. Trend Mining

| Metric | Value |
|--------|-------|
| DAU-GMV Correlation | {trend['corr_dau_gmv']:.3f} |
| Complaint-Retention Correlation | {trend['corr_complaint_retention']:.3f} |
| Last 7d Avg DAU | {trend['dau_last7_avg']:,.0f} |
| Previous 7d Avg DAU | {trend['dau_prev7_avg']:,.0f} |
| Last 7d Avg GMV | ${trend['gmv_last7_avg']:,.2f} |
| Previous 7d Avg GMV | ${trend['gmv_prev7_avg']:,.2f} |

## 4. Executive Takeaways

- Total GMV over the 90-day window reached **${kpis['total_gmv']:,.2f}**.
- Average DAU was **{kpis['avg_dau']:,}**, with an ARPU of **${kpis['arpu']:.4f}**.
- D7 retention averaged **{kpis['avg_retention']:.2f}%**, remaining within the healthy band.
- **{len(anomalies)}** day(s) exceeded the 3-sigma complaint threshold, concentrated around day 45.
- DAU-GMV correlation is **{trend['corr_dau_gmv']:.3f}**, indicating a **{strength_label(trend['corr_dau_gmv'])}** alignment between traffic and monetization.
- Complaint-Retention correlation is **{trend['corr_complaint_retention']:.3f}**, suggesting **{impact_label}**.
- Immediate investigation into the complaint spike is recommended to protect retention and GMV momentum.
"""
    with open(MD_PATH, "w", encoding="utf-8") as f:
        f.write(md)


def main():
    generate_csv()
    dates, dau, gmv, retention, complaints = parse_csv()
    kpis = kpi_engine(dau, gmv, retention, complaints)
    anomalies, threshold = detect_anomalies(dates, complaints)
    trend = trend_mining(dau, gmv, retention, complaints)
    plot_dashboard(dates, dau, gmv, retention, complaints, anomalies, threshold)
    generate_report(kpis, anomalies, threshold, trend)
    print("OK: MVP Pipeline Execution Complete. Artifacts saved in ./output/")


if __name__ == "__main__":
    main()
