import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { Tournament } from '../types'
import { HEADER_HEIGHT } from '../theme'
import EventSection from './EventSection'

interface TournamentSectionProps {
  tournament: Tournament
  isExpanded: boolean
  expandedEvents: Set<string>
  onToggleTournament: (id: string) => void
  onToggleEvent: (id: string) => void
}

function TournamentSection({
  tournament,
  isExpanded,
  expandedEvents,
  onToggleTournament,
  onToggleEvent,
}: TournamentSectionProps) {
  return (
    <Box id={tournament.id} sx={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}>
      <Accordion
        expanded={isExpanded}
        onChange={() => onToggleTournament(tournament.id)}
        elevation={0}
        disableGutters
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        slotProps={{
          heading: { component: 'h2' },
          transition: { mountOnEnter: true },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            position: 'sticky',
            top: HEADER_HEIGHT,
            zIndex: 2,
            bgcolor: 'background.paper',
            minHeight: HEADER_HEIGHT,
            px: { xs: 1, md: 2 },
            '&.Mui-expanded': { minHeight: HEADER_HEIGHT },
          }}
        >
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            {tournament.label}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 1, md: 2 } }}>
          {tournament.events.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              まだ日程が登録されていません。
            </Typography>
          ) : (
            tournament.events.map((event) => (
              <EventSection
                key={event.id}
                event={event}
                isExpanded={expandedEvents.has(event.id)}
                onToggle={onToggleEvent}
              />
            ))
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default TournamentSection
