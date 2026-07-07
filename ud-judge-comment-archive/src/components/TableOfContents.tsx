import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import type { Tournament } from '../types'
import { HEADER_HEIGHT, DRAWER_WIDTH, RAIL_WIDTH } from '../theme'

interface TableOfContentsProps {
  tournaments: Tournament[]
  isMobileDrawerOpen: boolean
  onCloseMobileDrawer: () => void
  isDesktopCollapsed: boolean
  onToggleDesktopCollapsed: () => void
}

function TableOfContents({
  tournaments,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  isDesktopCollapsed,
  onToggleDesktopCollapsed,
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
              top: HEADER_HEIGHT,
              height: `calc(100% - ${HEADER_HEIGHT}px)`,
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
              width: isDesktopCollapsed ? RAIL_WIDTH : DRAWER_WIDTH,
              overflowX: 'hidden',
              transition: (theme) => theme.transitions.create('width'),
              boxSizing: 'border-box',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: HEADER_HEIGHT,
            px: isDesktopCollapsed ? 0 : 2,
            justifyContent: isDesktopCollapsed ? 'center' : 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {!isDesktopCollapsed && <Typography variant="subtitle2">目次</Typography>}
          <IconButton
            onClick={onToggleDesktopCollapsed}
            size="small"
            title={isDesktopCollapsed ? 'サイドバーを開く' : 'サイドバーを閉じる'}
            aria-label={isDesktopCollapsed ? 'サイドバーを開く' : 'サイドバーを閉じる'}
          >
            {isDesktopCollapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
        {!isDesktopCollapsed && list}
      </Drawer>
    </>
  )
}

export default TableOfContents
