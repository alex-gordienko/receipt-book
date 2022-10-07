import styled from 'styled-components';

export const EditorContainer = styled.div`
  width: 30vw;
  height: 40vh;
  margin: 20px;
`;

export const EditorRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 0 20px;
`;

export const EditorRowName = styled.p`
`;

export const EditorRowValue = styled.input`
  width: 70%;
  height: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
`;

export const EditorRowLongValue = styled.textarea`
  width: 70%;
  height: 150px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  resize: none;
`;

export const EditorRowSelectContainer = styled.div`
  width: 70%;
  height: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
`;

export const EditorRowSelect = styled.select`
  width: 100%;
  height: 100%;
  border: none;
  padding-right: 10px;
`;

export const EditorRowSelectOption = styled.option`

`;