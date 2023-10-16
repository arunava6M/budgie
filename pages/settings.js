"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { GithubPicker } from "react-color";
import { styled } from "styled-components";

const ColorDiv = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${({ value }) => value};
  border: ${({ value }) => `1px solid rgba(0, 0, 0, 0.2)`};
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
  // background-color: red;
`;

const ItemContainer = styled.div`
  height: auto;
  width: 200px;
  background-color: ${({ color }) => color.replace(/[^,]+(?=\))/, 0.2)};
  border: ${({ color }) => "1px solid black"};
  border-radius: 8px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-shadow: -1px 2px 1px 1px black;
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

const SettingsPage = () => {
  const [data, setData] = useState(initialData);
  const [displayColorPicker, setDisplayColorPicker] = useState([]);
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
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleColorPick = (color, index) => {
    const temp = Array(displayColorPicker.length).fill(false);
    setDisplayColorPicker(temp);
    const tempData = data;
    console.log(color.rgb);
    const { r, g, b, a } = color.rgb;
    tempData.datasets[0].backgroundColor[index] = `rgba(${r},${g},${b},${a})`;
    setData(tempData);

    axios.put(
      `https://us-central1-budgie-41b5b.cloudfunctions.net/api/update/category/${data.labels[index]}`,
      {
        key: "color",
        value: `rgba(${r},${g},${b},${a})`,
      }
    );
  };

  console.log(data.datasets[0]);

  return (
    <div>
      {data.labels.map((each, index) => (
        <ItemContainer color={data.datasets[0].backgroundColor[index]}>
          <span>{each}</span>
          <ColorDiv
            value={data.datasets[0].backgroundColor[index]}
            onClick={() => {
              let temp = displayColorPicker;
              temp = Array(temp.length).fill(false);
              temp[index] = true;
              setDisplayColorPicker(temp);
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
        </ItemContainer>
      ))}
    </div>
  );
};

export default SettingsPage;
