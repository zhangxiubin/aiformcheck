import { nanoid } from 'nanoid'

function mockStaticData (length = 2) {
  const data = []

  for (let i = 1; i <= length; i++) {
    data.push({
      text: `选项${i}`,
      value: `${nanoid(7)}-${i}`
    })
  }

  return data
}

export {
  mockStaticData
}
