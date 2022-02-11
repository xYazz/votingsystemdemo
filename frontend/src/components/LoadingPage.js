import React from 'react'
import Box from '@mui/material'
import SpinStretch from 'react-cssfx-loading/lib/SpinStretch'
const LoadingPage = () => {
  return (
    <div><Box mt={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Box style={{
        position: 'flex',
        alignSelf: 'center',
        justifyContent: 'center'
    }} mt={5}><SpinStretch color="#A9A9A9" width="100px" height="100px" duration="1s" /></Box></Box></div>
  )
}

export default LoadingPage