export const formatNumberWithLeadingZeros = (number: number, totalDigits: number) => {
  const numString = number.toString()
  const numDigits = numString.length

  if (numDigits >= totalDigits) {
    return numString
  }

  const numZerosToAdd = totalDigits - numDigits
  const leadingZeros = "0".repeat(numZerosToAdd)
  return leadingZeros + numString
}

export const convertTime = (milliseconds: number) => {
  const minutes = milliseconds / (60 * 1000)
  const hrs = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)
  const secs = Math.ceil((minutes - Math.floor(minutes)) * 60)

  const formattedHrs = hrs < 10 ? `0${hrs}` : hrs
  const formattedMins = mins < 10 ? `0${mins}` : mins
  const formattedSecs = secs < 10 ? `0${secs}` : secs

  return `${formattedHrs}:${formattedMins}:${formattedSecs}`
}
