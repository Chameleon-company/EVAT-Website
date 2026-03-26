import React from "react";
import {
    LineChart, Line, BarChart, Bar,
    ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";

const CARD = {
    background: "#212840",
    border: "1px solid #2e3a5c",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
};

const CHART_BG = {
    background: "#1a2035",
    borderRadius: 8,
    padding: "12px 8px",
};

const TITLE = {
    fontSize: 13,
    fontWeight: 500,
    color: "#c8d4f0",
    marginBottom: 4,
};

const SUB = {
    fontSize: 11,
    color: "#5a6a99",
    marginBottom: 14,
};

const SECTION_LABEL = {
    fontSize: 12,
    fontWeight: 500,
    color: "#8899cc",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 16,
};

export default function CostCharts({ chartData }) {
    if (!chartData) return null;

    const {
        forecast_10yr,
        multi_scenario,
        feature_importance,
        parity,
        scenario_keys
    } = chartData;

    const SCENARIO_COLORS = ["#4ade80", "#60a5fa", "#f97316"];

    return (
        <div style={{ width: "100%", marginTop: 32, background: "#1a1f2e", borderRadius: 16, padding: 24 }}>

            <div style={SECTION_LABEL}>Cost comparison analytics</div>

            {/* Charts grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                {/* Chart 1 - 10 Year Savings Forecast */}
                <div style={CARD}>
                    <div style={TITLE}>10-year EV savings forecast</div>
                    <div style={SUB}>5% petrol growth · 2% electricity growth</div>
                    <div style={CHART_BG}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={forecast_10yr}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e3a5c" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fill: "#5a6a99", fontSize: 11 }}
                                    axisLine={{ stroke: "#2e3a5c" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#5a6a99", fontSize: 11 }}
                                    axisLine={{ stroke: "#2e3a5c" }}
                                    tickLine={false}
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: "#1a2035", border: "1px solid #2e3a5c", borderRadius: 8, color: "#c8d4f0" }}
                                    formatter={(v) => [`$${v}`, "Predicted savings"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predicted_savings"
                                    stroke="#4ade80"
                                    strokeWidth={2.5}
                                    dot={{ fill: "#4ade80", r: 3 }}
                                    name="Predicted Savings (AUD)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2 - Multi Scenario */}
                <div style={CARD}>
                    <div style={TITLE}>Multi-scenario 10-year forecast</div>
                    <div style={SUB}>Low · med · high price growth scenarios</div>
                    <div style={CHART_BG}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={multi_scenario}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e3a5c" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fill: "#5a6a99", fontSize: 11 }}
                                    axisLine={{ stroke: "#2e3a5c" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#5a6a99", fontSize: 11 }}
                                    axisLine={{ stroke: "#2e3a5c" }}
                                    tickLine={false}
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: "#1a2035", border: "1px solid #2e3a5c", borderRadius: 8, color: "#c8d4f0" }}
                                    formatter={(v) => `$${v}`}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: 11, color: "#6b7db3" }}
                                />
                                {scenario_keys && scenario_keys.map((key, i) => (
                                    <Line
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={SCENARIO_COLORS[i]}
                                        strokeWidth={2}
                                        dot={{ r: 2 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 3 - Feature Importance */}
                {feature_importance && feature_importance.length > 0 && (
                    <div style={CARD}>
                        <div style={TITLE}>Feature importance</div>
                        <div style={SUB}>What drives the ML model's prediction</div>
                        <div style={CHART_BG}>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={feature_importance}
                                    layout="vertical"
                                    margin={{ left: 10, right: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2e3a5c" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        tick={{ fill: "#5a6a99", fontSize: 11 }}
                                        axisLine={{ stroke: "#2e3a5c" }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="feature"
                                        width={120}
                                        tick={{ fill: "#8899cc", fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: "#1a2035", border: "1px solid #2e3a5c", borderRadius: 8, color: "#c8d4f0" }}
                                        formatter={(v) => [v.toFixed(4), "Importance"]}
                                    />
                                    <Bar
                                        dataKey="importance"
                                        fill="#6366f1"
                                        radius={[0, 4, 4, 0]}
                                        name="Importance"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Chart 4 - Actual vs Predicted */}
                {parity && parity.length > 0 && (
                    <div style={CARD}>
                        <div style={TITLE}>Actual vs predicted savings</div>
                        <div style={SUB}>ML model accuracy on test data</div>
                        <div style={CHART_BG}>
                            <ResponsiveContainer width="100%" height={200}>
                                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2e3a5c" />
                                    <XAxis
                                        dataKey="actual"
                                        name="Actual"
                                        tick={{ fill: "#5a6a99", fontSize: 11 }}
                                        axisLine={{ stroke: "#2e3a5c" }}
                                        tickLine={false}
                                        tickFormatter={(v) => `$${v}`}
                                        label={{ value: "Actual ($)", position: "insideBottom", offset: -4, fill: "#5a6a99", fontSize: 11 }}
                                    />
                                    <YAxis
                                        dataKey="predicted"
                                        name="Predicted"
                                        tick={{ fill: "#5a6a99", fontSize: 11 }}
                                        axisLine={{ stroke: "#2e3a5c" }}
                                        tickLine={false}
                                        tickFormatter={(v) => `$${v}`}
                                        label={{ value: "Predicted ($)", angle: -90, position: "insideLeft", fill: "#5a6a99", fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: "#1a2035", border: "1px solid #2e3a5c", borderRadius: 8, color: "#c8d4f0" }}
                                        formatter={(v) => `$${v}`}
                                    />
                                    <Scatter
                                        data={parity}
                                        fill="#f97316"
                                        opacity={0.7}
                                        name="Predictions"
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}