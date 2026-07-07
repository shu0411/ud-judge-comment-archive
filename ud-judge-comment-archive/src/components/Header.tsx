import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { HEADER_HEIGHT, DRAWER_WIDTH, RAIL_WIDTH } from '../theme'

interface HeaderProps {
  isDesktopSidebarCollapsed: boolean
  onOpenDrawer: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

function Header({
  isDesktopSidebarCollapsed,
  onOpenDrawer,
  onExpandAll,
  onCollapseAll,
}: HeaderProps) {
  const sidebarWidth = isDesktopSidebarCollapsed ? RAIL_WIDTH : DRAWER_WIDTH

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        ml: { md: `${sidebarWidth}px` },
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        transition: (theme) => theme.transitions.create(['margin-left', 'width']),
      }}
    >
      <Toolbar sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, px: { xs: 1, md: 2 } }}>
        <IconButton
          onClick={onOpenDrawer}
          aria-label="目次を開く"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h1"
          noWrap
          sx={{
            flex: { xs: 1, md: 'none' },
            textAlign: { xs: 'center', md: 'left' },
            fontSize: { xs: '1rem', md: undefined },
          }}
        >
          UNIDOL 審査員コメントまとめ
        </Typography>
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
        <IconButton
          onClick={onExpandAll}
          title="全て展開"
          aria-label="全て展開"
          sx={{ borderRadius: 1 }}
        >
          <UnfoldMoreIcon />
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, ml: 0.5, fontSize: 14 }}>
            全て展開
          </Box>
        </IconButton>
        <IconButton
          onClick={onCollapseAll}
          title="全て折りたたむ"
          aria-label="全て折りたたむ"
          sx={{ borderRadius: 1 }}
        >
          <UnfoldLessIcon />
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, ml: 0.5, fontSize: 14 }}>
            全て折りたたむ
          </Box>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
