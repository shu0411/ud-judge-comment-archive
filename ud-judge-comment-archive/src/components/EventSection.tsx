import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { Event } from '../types'
import { HEADER_HEIGHT } from '../theme'
import TweetEmbed from './TweetEmbed'

interface EventSectionProps {
  event: Event
  isExpanded: boolean
  onToggle: (id: string) => void
}

function EventSection({ event, isExpanded, onToggle }: EventSectionProps) {
  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => onToggle(event.id)}
      elevation={0}
      disableGutters
      sx={{ borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          position: 'sticky',
          top: HEADER_HEIGHT * 2,
          zIndex: 1,
          bgcolor: 'background.paper',
          px: { xs: 1, md: 2 },
        }}
      >
        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 500 }}>
          {event.label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, px: { xs: 1, md: 2 } }}>
        {event.tweets.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            まだコメントが登録されていません。
          </Typography>
        ) : (
          event.tweets.map((tweetId) => <TweetEmbed key={tweetId} tweetId={tweetId} />)
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default EventSection
