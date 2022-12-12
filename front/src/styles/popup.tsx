import styled from "styled-components";

export const StyledPopUpBackdrop = styled.div`
 position: fixed;
 height: 100%;
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 background: #f7f1f185;
 left: 0;
 top: 0;
 display : none;
 &.show-modal {
   display: flex;
 }
`;

export const StyledPopUp = styled.div`
 display : flex;
 align-items: center;
 justify-content: center;
 height: 10rem;
 width: 30rem;
 background: rgba(255, 255, 255, 0.25);
 box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
 backdrop-filter: blur(7px);
 -webkit-backdrop-filter: blur(7px);
 border-radius: 10px;
 border: 1px solid rgba(255, 255, 255, 0.18);
`;