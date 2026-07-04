export interface Event {
  id: string
  label: string
  tweets: string[]
}

export interface Tournament {
  id: string
  label: string
  events: Event[]
}
