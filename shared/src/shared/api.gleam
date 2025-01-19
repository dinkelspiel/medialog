import shared/database

pub type UserEntryEntry {
  UserEntryEntry(user_entry: database.UserEntry, entry: database.Entry)
}
