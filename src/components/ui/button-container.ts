import styled from "styled-components";
import { Colors } from "../../util/constants";

export const ModalButtonContainer = styled.div`
  background-color: ${Colors.Modal.ButtonContainerBackground};
  border-top: 1px solid ${Colors.Modal.ButtonContainerBorder};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.05);
  position: absolute;
  bottom: 0;
  padding: 0 1em;
  left: 0;
  right: 0;
  height: 50px;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;
