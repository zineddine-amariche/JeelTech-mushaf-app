import { TxKeyPath, translate } from "app/i18n"
import { Text } from "./Text"
import { spacing } from "app/theme"

interface DynamicCountTextProps {
  count: number
  textKeys: {
    zero: TxKeyPath
    one: TxKeyPath
    lessThanTen: TxKeyPath
    moreThanTen: TxKeyPath
  }
}

export const DynamicCountText: React.FC<DynamicCountTextProps> = ({ count, textKeys }) => {
  const text =
    count === 0
      ? textKeys.zero
      : count === 1
      ? textKeys.one
      : count <= 10
      ? textKeys.lessThanTen
      : textKeys.moreThanTen

  return (
    <Text
      style={{
        textAlign: "left",
        marginHorizontal: spacing.md,
        paddingBottom: spacing.xs,
      }}
      tx={translate(text, { count: `${count}` }) as TxKeyPath}
    />
  )
}
