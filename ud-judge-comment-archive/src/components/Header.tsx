import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { HEADER_HEIGHT, DRAWER_WIDTH } from '../theme'

interface HeaderProps {
  isDesktopSidebarCollapsed: boolean
  onOpenDrawer: () => void
  onToggleDesktopSidebar: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

function Header({
  isDesktopSidebarCollapsed,
  onOpenDrawer,
  onToggleDesktopSidebar,
  onExpandAll,
  onCollapseAll,
}: HeaderProps) {
  const sidebarWidth = isDesktopSidebarCollapsed ? 0 : DRAWER_WIDTH

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        boxShadow: (theme) => `inset 0 -1px 0 0 ${theme.palette.divider}`,
        ml: { md: `${sidebarWidth}px` },
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        transition: (theme) => theme.transitions.create(['margin-left', 'width']),
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, px: { xs: 1, md: 2 } }}
      >
        <IconButton
          onClick={onOpenDrawer}
          aria-label="目次を開く"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          onClick={onToggleDesktopSidebar}
          aria-label={isDesktopSidebarCollapsed ? '目次を開く' : '目次を閉じる'}
          sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 1 }}
        >
          {isDesktopSidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <Typography
          variant="h6"
          component="h1"
          noWrap
          sx={{
            flex: { xs: 1, md: 'none' },
            textAlign: { xs: 'center', md: 'left' },
            fontSize: { xs: '1rem', md: '1.375rem' },
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
