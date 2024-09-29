interface AccountIdAndKind {
  id: string
  kind: AccountKind
}
type AccountKind = import('./MarsCreditManager.types').AccountKind
