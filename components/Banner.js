import styled from "styled-components";

const BannerContainer = styled.div`
  position: absolute;
  top: 50px;
  height: auto;
  width: 80%;
  background-color: red;
  border-radius: 8px;
  color: white;

  border: 2px solid black;
  box-shadow: -3px 1px 1px 1px black;
  padding: 10px;
`;
export const Banner = ({ children }) => {
  return <BannerContainer>{children}</BannerContainer>;
};
