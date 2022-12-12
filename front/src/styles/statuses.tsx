import styled, { css } from "styled-components";

type StatusProps = {
    color: string;
}

export const FriendStatusStyle = styled.div<StatusProps>`
    width: 10px;
    height: 10px;
    margin: 5px 0px 0px 5px;
    border-radius: 50%;
    ${({ color }) => css`
        color: ${color};
        background-color: ${color};
    `}
`

export const ReadyStyle = styled.div<StatusProps>`
    display: inline-block;
    ${({ color }) => css`
    color: ${color};
    `}
`