import styled, { css } from "styled-components";

type StatusProps = {
  color: string;
};

export const DmStyle = styled.div<StatusProps>`
  border: 2px solid rgba(9, 9, 9, 0.23);
  padding: 5px;
  border-radius: 5px;
  ${({ color }) => css`
    background-color: ${color};
  `}
`;
