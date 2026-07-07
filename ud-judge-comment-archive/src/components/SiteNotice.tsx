import Typography from '@mui/material/Typography'

function SiteNotice() {
  return (
    <Typography
      variant="caption"
      component="p"
      color="text.secondary"
      sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, md: 2 }, py: 1.5 }}
    >
      UNIDOLにおける審査員コメントのメモ一覧です。
      <br />
      当サイトはファンによる非公式サイトです。UNIDOL公式とは一切関係ありません。
      <br />
      また、一個人での解釈によるメモのため、正確ではない可能性があります。参考程度にご覧ください。
    </Typography>
  )
}

export default SiteNotice
