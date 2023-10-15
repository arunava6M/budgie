"use client";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { styled } from "styled-components";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const Input = styled.input`
  position: absolute;
  top: 10%;
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 8px;
  width: 150px;
  height: 20px;
  outline: none;
  border: 1px solid rgba(255, 99, 132, 0.2);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const initialData = {
  labels: ["Outside food", "Trip", "Veggies", "Fruit", "Purple", "Orange"],
  datasets: [
    {
      label: "Amount spent",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function Home() {
  const chartRef = useRef();
  const [value, setValue] = useState(0);
  const [data, setData] = useState(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    axios
      .get(
        "https://us-central1-budgie-41b5b.cloudfunctions.net/api/read/category"
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onClick = (event) => {
    console.log("df: ", getElementAtEvent(chartRef.current, event));
    const index = getElementAtEvent(chartRef.current, event)[0]?.index;
    console.log(index);
    setData({});
    const temp = data;
    let tempData = data.datasets[0].data[index];
    temp.datasets[0].data[index] = Number(tempData) + Number(value);
    setData(temp);
    chartRef.current.update();
    setValue(0);
  };

  console.log(data);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Input
          type="text"
          placeholder="amount"
          onChange={handleChange}
          value={value}
        />
        <Doughnut data={data} ref={chartRef} onClick={onClick} redraw={true} />
      </Container>

      <footer></footer>
    </div>
  );
}
