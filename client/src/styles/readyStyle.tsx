import styled, { css } from "styled-components";

type StatusProps = {
  color: string;
};

export const ReadyStyle = styled.div<StatusProps>`
  display: inline-block;
  ${({ color }) => css`
    color: ${color};
  `}
`;
