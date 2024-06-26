import './Auth.scss'
import { useState } from 'react'
import SignIn from '../../components/SignIn'
import SignUp from '../../components/SignUp'
import { Button } from '@mui/material'
import Header from '../../components/Header'

const Auth = () => {
  const [haveAccount, setHaveAccount] = useState<boolean>(true)

  return (
    <div className='auth-main'>
      <Header showMenu='false' />
      <div className='auth'>
        {haveAccount ? <SignIn /> : <SignUp />}
        <Button className='btn-have-acc' onClick={() => setHaveAccount(!haveAccount)}>
          {haveAccount ? "Don't have account? Sign up" : 'Already have account? Sign in'}
        </Button>
      </div>
    </div>
  )
}

export default Auth
