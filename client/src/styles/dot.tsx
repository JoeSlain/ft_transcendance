import styled, { css } from "styled-components";

type StatusProps = {
  color: string;
};

export const DotStyle = styled.div<StatusProps>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px;
  ${({ color }) => css`
    background-color: ${color};
  `}
`;
