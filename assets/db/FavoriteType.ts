import { TxKeyPath } from "app/i18n"

export interface FavoritesAyatCardProps {
  verse: number
  showNotes: boolean
  setSelectedItem: (item: any) => void
  selectedItem: any
  item: any
  onFocus: () => void
  selectGotoVerse: () => void
  onLayout: (event: any) => void
}

export interface HeaderWrapperProps {
  onDeletePressed: () => void
  onEditPress: () => void
  txPage: TxKeyPath
  txSurahName: TxKeyPath
  showEditButton: boolean
}

export interface UpdateNotesSectionProps {
  isEditNoteVisible: boolean
  verse: number
  note: string
  hideEdit: () => void
}

export interface NoteViewProps {
  note: string | null
  isEditNoteVisible: boolean
}
