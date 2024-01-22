const hafsData = require("../../assets/db/ayat/hafs.json")

export function search(string, searchLevel = 0) {
  const results = []
  for (let i = 1; i <= 114; i++) {
    hafsData[`${i}`].forEach(function (verse, id) {
      if (searchInText(string, verse.text, searchLevel)) {
        results.push([i, id])
      }
    })
  }
  return results
}

/*
 * searchLevel:
 * 0: for connected search
 * 1: for seperated keywords . order not important
 * 2: at least one occurence
 */
function searchInText(words, text, searchLevel = 0) {
  matches = 0
  wordsNbr = 0
  if (searchLevel == 1) {
    //Don't keep the order

    words = words.split(" ") //todo to remove
    wordsNbr = words.length

    words.forEach(function (word) {
      if (new RegExp(`${word}`).test(text)) matches++
    })

    return matches > 0 && matches >= wordsNbr
  } else if (searchLevel == 2) {
    // at least one occurence
    words = words.replace(" ", "|") //todo to remove
  }

  const regex = new RegExp(`${words}`, "gi")

  const matchesr = text.match(regex)

  return matchesr !== null && matchesr.length == words.length
}
