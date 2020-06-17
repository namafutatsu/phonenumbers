/* global FileReader, XLSX, libphonenumber */

function parsePhoneNumbers (rawValues) {
  const numbers = rawValues.map(v => libphonenumber.parsePhoneNumberFromString(v, 'FR'))
  const values = numbers.filter(n => {
    return n && n.isValid() && n.getType() === 'MOBILE'
  }).map(n => n.nationalNumber)
  return values.map(v => `33${v}`)
}

function handleFileUpload () {
  const file = this.files[0]

  if ((file.size / 1024 / 1024) >= 10.0) {
    document.getElementById('status').innerHTML = 'File is too big.'
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const data = new Uint8Array(reader.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawValues = XLSX.utils.sheet_to_json(worksheet).map((d) => Object.values(d)[0])
    const values = parsePhoneNumbers(rawValues)

    XLSX.utils.sheet_add_json(worksheet, values.map(v => {
      return { 'phone numbers': v }
    }))
    XLSX.writeFile(workbook, 'clean.xlsx')
  }
  reader.readAsArrayBuffer(file)
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('upload-input').addEventListener('change', handleFileUpload, false)
})
