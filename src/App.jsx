import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const TOKEN = import.meta.env.VITE_BLYNK_TOKEN;

export default function App() {
  const [ph, setPh] = useState(0);
  const [tds, setTds] = useState(0);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const phRes = await fetch(
        `https://blynk.cloud/external/api/get?token=${TOKEN}&V0`
      );
      const tdsRes = await fetch(
        `https://blynk.cloud/external/api/get?token=${TOKEN}&V1`
      );

      const phValue = parseFloat(await phRes.text()) || 0;
      const tdsValue = parseFloat(await tdsRes.text()) || 0;

      setPh(phValue);
      setTds(tdsValue);

      const time = new Date().toLocaleTimeString();

      setHistory((prev) => [
        ...prev.slice(-9),
        {
          time,
          ph: phValue,
          tds: tdsValue
        }
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Smart Aquaponic Dashboard</h1>

      <h2>pH : {ph.toFixed(2)}</h2>
      <h2>TDS : {tds.toFixed(0)} ppm</h2>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={history}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ph" />
            <Line type="monotone" dataKey="tds" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
