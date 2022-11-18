import styled, {css} from 'styled-components'

export const EntryStyles = styled.div`
    box-shadow: 2px 2px 2px 2px rgba(9, 9, 9, 0.23);
    margin-top: 5px;
    height: 20px;
`;

type ContextMenuProps = {
    top: number;
    left: number;
};

export const ContextMenu = styled.div<ContextMenuProps>`
    border-radius: 4px;
    box-sizing: border-box;
    position: absolute;
    background-color: white;
    box-shadow: 0px 1px 8px 0px grey;
    ${({top, left}) => css `
        top: ${top}px;
        left: ${left}px;
    `}
    ul {
        list-style-type: none;
        box-sizing: border-box;
        margin: 0;
        padding: 5px;
    }
    ul li {
        padding: 8px;
    }
    ul li:hover {
        cursor: pointer;
        background-color: grey;
    }
`;