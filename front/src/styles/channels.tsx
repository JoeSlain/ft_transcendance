import styled, { css } from "styled-components";

type StatusProps = {
  color: string;
};

export const ChanStyle = styled.div<StatusProps>`
  display: flex;
  justify-content: center;
  box-shadow: 2px 2px 2px 2px rgba(9, 9, 9, 0.23);
  margin-top: 5px;
  height: 20px;
  ${({ color }) => css`
    background-color: ${color};
  `}
`;
