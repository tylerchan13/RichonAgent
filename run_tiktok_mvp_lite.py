import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

OUTPUT_DIR = "./output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

np.random.seed(42)
days = pd.date_range(start="2024-01-01", periods=90, freq="D")

base_dau = 100000 + np.linspace(0, 8000, 90)
dau_noise = np.cumsum(np.random.normal(0, 400, 90))
dau = (base_dau + dau_noise).astype(int)

arpu_daily = 0.05 + np.random.normal(0, 0.003, 90)
gmv = (dau * arpu_daily + np.random.normal(0, 500, 90)).round(2)

retention_d7 = 0.26 + np.random.normal(0, 0.015, 90)
retention_d7 = np.clip(retention_d7, 0.18, 0.34).round(4)

base_complaints = 120 + np.random.normal(0, 12, 90).astype(int)
base_complaints[43:48] += np.array([80, 150, 180, 130, 70])
user_complaints = np.maximum(base_complaints, 0)

df = pd.DataFrame({
    "Date": days,
    "DAU": dau,
    "GMV": gmv,
    "Retention_D7": retention_d7,
    "User_Complaints": user_complaints,
})

csv_path = os.path.join(OUTPUT_DIR, "tiktok_daily_metrics.csv")
df.to_csv(csv_path, index=False)

total_gmv = df["GMV"].sum()
avg_dau = df["DAU"].mean()
arpu = total_gmv / df["DAU"].sum()
avg_retention = df["Retention_D7"].mean()

mean_complaints = df["User_Complaints"].mean()
std_complaints = df["User_Complaints"].std()
threshold_upper = mean_complaints + 3 * std_complaints
anomalies = df[df["User_Complaints"] > threshold_upper].copy()

fig, ax1 = plt.subplots(figsize=(14, 7))

color_dau = "tab:blue"
ax1.set_xlabel("Date")
ax1.set_ylabel("DAU", color=color_dau)
line1 = ax1.plot(df["Date"], df["DAU"], color=color_dau, linewidth=2, label="DAU")
ax1.tick_params(axis="y", labelcolor=color_dau)

ax2 = ax1.twinx()
color_gmv = "tab:green"
ax2.set_ylabel("GMV ($)", color=color_gmv)
line2 = ax2.plot(df["Date"], df["GMV"], color=color_gmv, linewidth=2, linestyle="--", label="GMV")
ax2.tick_params(axis="y", labelcolor=color_gmv)

ax3 = ax1.twinx()
ax3.spines["right"].set_position(("outward", 70))
color_complaints = "tab:red"
ax3.set_ylabel("User Complaints", color=color_complaints)
line3 = ax3.plot(df["Date"], df["User_Complaints"], color=color_complaints, linewidth=1.5, alpha=0.5, label="Complaints")
scatter = ax3.scatter(anomalies["Date"], anomalies["User_Complaints"], color="red", s=100, zorder=5, label="Complaint Anomalies")
ax3.tick_params(axis="y", labelcolor=color_complaints)

lines = line1 + line2 + line3 + [scatter]
labels = [ln.get_label() for ln in lines]
ax1.legend(lines, labels, loc="upper left")

plt.title("TikTok Business Health Dashboard - 90 Days")
fig.autofmt_xdate()
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "tiktok_health_dashboard.png"), dpi=150)
plt.close()

report_path = os.path.join(OUTPUT_DIR, "TikTok_Executive_Diagnostic_Report.md")

anomaly_rows = ""
if anomalies.empty:
    anomaly_rows = "| 无 | 无 |\n"
else:
    for _, row in anomalies.iterrows():
        anomaly_rows += f"| {row['Date'].strftime('%Y-%m-%d')} | {int(row['User_Complaints'])} |\n"

report = f"""# TikTok Executive Diagnostic Report

## 1. KPI Overview

| Metric | Value |
|--------|-------|
| Total GMV | ${total_gmv:,.2f} |
| Average DAU | {avg_dau:,.0f} |
| ARPU | ${arpu:.4f} |
| Average D7 Retention | {avg_retention:.2%} |
| Average Daily Complaints | {mean_complaints:.1f} |

## 2. Complaint Anomaly Detection (3-Sigma)

Threshold: {threshold_upper:.1f}

| Date | User Complaints |
|------|-----------------|
{anomaly_rows}
## 3. Executive Takeaways

- Total GMV over the 90-day window reached **${total_gmv:,.2f}**.
- Average DAU was **{avg_dau:,.0f}**, with an ARPU of **${arpu:.4f}**.
- D7 retention averaged **{avg_retention:.2%}**, remaining within the healthy band.
- **{len(anomalies)}** day(s) exceeded the 3-sigma complaint threshold, concentrated around day 45.
- Immediate investigation into the complaint spike is recommended to protect retention and GMV momentum.
"""

with open(report_path, "w", encoding="utf-8") as f:
    f.write(report)

print("✅ MVP Pipeline Execution Complete. Artifacts saved in ./output/")
