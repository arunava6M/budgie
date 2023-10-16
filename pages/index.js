"use client";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { styled } from "styled-components";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const PageWrapper = styled.div`
  margin: 0;
  padding: 0;
`;
const Input = styled.input`
  position: absolute;
  top: 15%;
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 8px;
  width: 150px;
  height: 20px;
  outline: none;
  border: 1px solid rgba(255, 99, 132, 0.2);
  box-shadow: -3px 4px 1px 1px black;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  position: relative;
`;

const DoughnutShadow = styled.div`
  background-color: white;
  position: absolute;
  height: 275px;
  width: 275px;
  top: 212px;
  border-radius: 50%;
  border: 4px solid black;
  box-shadow: -4px 12px 1px 1px black;
`;

const DoughnutContainer = styled.div`
  z-index: 100;
`;

export const initialData = {
  labels: [],
  datasets: [
    {
      label: "Amount spent",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    },
  ],
};

export default function Home() {
  const chartRef = useRef();
  const [value, setValue] = useState(0);
  const [data, setData] = useState(initialData);
  const [mounted, setMounted] = useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState([]);
  // const router = useRouter();

  console.log(displayColorPicker);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => chartRef?.current && chartRef.current.update(), [data]);

  useEffect(() => {
    axios
      .get(
        "https://us-central1-budgie-41b5b.cloudfunctions.net/api/read/category"
      )
      .then((res) => {
        console.log(res.data);
        const tempData = data;
        res.data.map((each, index) => {
          tempData.labels[index] = each.id;
          tempData.datasets[0].data[index] = each.value;
          tempData.datasets[0].backgroundColor[index] = each.color;
          tempData.datasets[0].borderColor[index] = each.color;
        });

        setData(data);
        setDisplayColorPicker(Array(data.length).fill(false));
      })
      .then(() => chartRef.current.update())
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

    axios.put(
      `https://us-central1-budgie-41b5b.cloudfunctions.net/api/update/category/${data.labels[index]}`,
      {
        key: "value",
        value: Number(tempData) + Number(value),
      }
    );
  };

  console.log(data);

  return (
    <PageWrapper>
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

        <DoughnutContainer>
          <Doughnut
            borderWidth={"5px"}
            borderColor="black"
            data={data}
            ref={chartRef}
            onClick={onClick}
            redraw={true}
          />
        </DoughnutContainer>
        <DoughnutShadow />
      </Container>
    </PageWrapper>
  );
}
