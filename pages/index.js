"use client";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { styled } from "styled-components";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import axios from "axios";
import { GithubPicker } from "react-color";

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

const ColorDiv = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${({ value }) => value};
  border: ${({ value }) => `1px solid ${value.replace(/[^,]+(?=\))/, 1)}`};
`;

const Popover = styled.div`
  position: "absolute";
  zindex: "2";
`;

const Cover = styled.div`
  position: "fixed";
  top: "0px";
  right: "0px";
  bottom: "0px";
  left: "0px";
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

  const handleColorPick = (color, index) => {
    const temp = Array(displayColorPicker.length).fill(false);
    setDisplayColorPicker(temp);
    const tempData = data;
    console.log(color.rgb);
    const { r, g, b, a } = color.rgb;
    tempData.datasets[0].backgroundColor[index] = `rgba(${r},${g},${b},${a})`;
    setData(tempData);
    chartRef.current.update();

    axios.put(
      `https://us-central1-budgie-41b5b.cloudfunctions.net/api/update/category/${data.labels[index]}`,
      {
        key: "color",
        value: `rgba(${r},${g},${b},${a})`,
      }
    );
  };

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
      {/* <GithubPicker /> */}
      {data.labels.map((each, index) => (
        <div>
          <span>{each}</span>
          <ColorDiv
            value={data.datasets[0].backgroundColor[index]}
            onClick={() => {
              let temp = displayColorPicker;
              temp = Array(temp.length).fill(false);
              temp[index] = true;
              setDisplayColorPicker(temp);
              console.log("asdasd: ", temp);
            }}
          />
          {displayColorPicker[index] ? (
            <Popover key={index}>
              <Cover
                onClick={() => {
                  let temp = displayColorPicker;
                  temp = Array(temp.length).fill(false);
                  setDisplayColorPicker(temp);
                }}
              />
              <GithubPicker
                onChangeComplete={(color) => handleColorPick(color, index)}
              />
            </Popover>
          ) : null}
        </div>
      ))}

      <footer></footer>
    </div>
  );
}
