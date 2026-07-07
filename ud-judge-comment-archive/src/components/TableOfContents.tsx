import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import type { Tournament } from '../types'
import { HEADER_HEIGHT, DRAWER_WIDTH } from '../theme'

interface TableOfContentsProps {
  tournaments: Tournament[]
  isMobileDrawerOpen: boolean
  onCloseMobileDrawer: () => void
  isDesktopCollapsed: boolean
}

function TableOfContents({
  tournaments,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  isDesktopCollapsed,
}: TableOfContentsProps) {
  function scrollToTournament(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onCloseMobileDrawer()
  }

  const list = (
    <List>
      {tournaments.map((tournament) => (
        <ListItemButton key={tournament.id} onClick={() => scrollToTournament(tournament.id)}>
          <ListItemText primary={tournament.label} />
        </ListItemButton>
      ))}
    </List>
  )

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isMobileDrawerOpen}
        onClose={onCloseMobileDrawer}
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{
          paper: {
            component: 'nav',
            sx: {
              width: '75%',
              maxWidth: 280,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="subtitle2">目次</Typography>
          <IconButton onClick={onCloseMobileDrawer} aria-label="閉じる" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {list}
      </Drawer>

      {/* Desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' } }}
        slotProps={{
          paper: {
            component: 'nav',
            sx: {
              width: isDesktopCollapsed ? 0 : DRAWER_WIDTH,
              overflowX: 'hidden',
              transition: (theme) => theme.transitions.create('width'),
              boxSizing: 'border-box',
            },
          },
        }}
      >
        {!isDesktopCollapsed && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: HEADER_HEIGHT,
                px: 2,
                boxShadow: (theme) => `inset 0 -1px 0 0 ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle2">目次</Typography>
            </Box>
            {list}
          </>
        )}
      </Drawer>
    </>
  )
}

export default TableOfContents
