import styled from "styled-components"
import { AppColors } from "../../util/constants"

export const ModalButtonConatiner = styled.div`
  position: absolute;
  background: ${AppColors.MediumGray};
  bottom: 0;
  border-top: 1px solid #ccc;
  width: calc(100% - 10px);
  left: 0;
  right: 0;
  height: 40px;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 0 0;
  justify-content: flex-end;
`