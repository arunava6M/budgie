"use client";
import { styled } from "styled-components";
import Router, { useRouter } from "next/router";
import { BsBarChartFill } from "react-icons/bs";
import { AiTwotoneSetting } from "react-icons/ai";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  position: relative;
  background-color: #fae3e1;
`;

const NavigationWrapper = styled.div`
  position: relative;
  width: 100px;
  border-radius: 8px;
  display: flex;
  justify-content: space-around;
`;

const Navigator = styled.div`
  width: 50%;
  height: 30px;
  position: absolute;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${({ active }) => !active && "-4px"};
  border: 1px solid black;
  background-color: ${({ active }) => (active ? "#FF7A5C" : "#FFA07A")};
`;

const LeftNavigator = styled(Navigator)`
  left: 0px;
  border-radius: 8px 0 0 8px;
  box-shadow: ${({ active }) =>
    active ? "inset 0px 1px 1px 0px black" : "-1px 3px 1px 1px  black"};
`;

const RightNavigator = styled(Navigator)`
  right: 0px;
  border-radius: 0 8px 8px 0;
  box-shadow: ${({ active }) =>
    active ? "inset 0px 1px 1px 0px black" : "-1px 3px 1px 1px  black"};
`;

const FooterWrapper = styled.footer`
  width: 100%;
  position: absolute;
  padding: 10px 10px;
  display: flex;
  justify-content: flex-end;
  bottom: 100px;
  left: 0px;
  right: 0px;
`;

export const PageWrapper = ({ children }) => {
  const router = useRouter();

  return (
    <Container>
      {children}
      <FooterWrapper>
        <NavigationWrapper>
          <LeftNavigator
            active={router.pathname === "/"}
            onClick={() => {
              Router.push("/");
            }}
          >
            <BsBarChartFill />
          </LeftNavigator>
          <RightNavigator
            active={router.pathname === "/settings"}
            onClick={() => {
              Router.push("/settings");
            }}
          >
            <AiTwotoneSetting />
          </RightNavigator>
        </NavigationWrapper>
      </FooterWrapper>
    </Container>
  );
};
