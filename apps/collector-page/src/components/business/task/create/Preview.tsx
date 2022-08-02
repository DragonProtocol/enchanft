import { Box, Modal } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

export default function Preview({
  open,
  closeHandler,
  submitResult,
}: {
  open: boolean
  closeHandler: () => void
  submitResult: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={closeHandler}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          maxHeight: 'calc(100% - 100px)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <ModalViewBox>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>
          <h3>title</h3>

          <button onClick={submitResult}>submit</button>
        </ModalViewBox>
      </Box>
    </Modal>
  )
}
const ModalViewBox = styled.div`
  & h3 {
    margin: 0;
  }
`
