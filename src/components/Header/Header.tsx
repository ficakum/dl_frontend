import * as React from 'react'
import { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import SignOut from '../../components/SignOut'
import './Header.scss'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

interface IHeaderProps {
  showMenu: string
}

const Header: FC<IHeaderProps> = ({ showMenu }) => {
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const navigateOrdersPage = () => {
    navigate(ROUTES.ORDER.PATH)
  }

  const navigateProductsPage = () => {
    navigate(ROUTES.PRODUCT.PATH)
  }

  return (
    <AppBar position='static' sx={{ backgroundColor: 'rgba(27, 4, 110, 0.95)' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-around' }}>
          <a href='Home'>
            <img src='Logo-with text.png' alt='AUDITORIUM logo' id='logo' />
          </a>
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SELLERS
          </Typography>
          {showMenu === 'true' ? (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' />
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Button onClick={() => navigateOrdersPage()}>Orders</Button>
                </MenuItem>
                <MenuItem>
                  <Button onClick={() => navigateProductsPage()}>Products</Button>
                </MenuItem>
                <MenuItem>
                  <SignOut />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header
