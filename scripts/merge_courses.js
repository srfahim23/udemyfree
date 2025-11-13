const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(__dirname, '..', 'data')
const existingFile = path.join(dataDir, 'courses.json')
const newFile = path.join(dataDir, 'new_courses_500.json')

function readJSON(file) {
  try {
    const s = fs.readFileSync(file, 'utf8')
    return JSON.parse(s)
  } catch (err) {
    console.error('Failed to read/parse', file, err.message)
    process.exit(1)
  }
}

const existing = readJSON(existingFile)
const incoming = readJSON(newFile)

if (!Array.isArray(existing.courses)) {
  console.error('Existing file does not contain courses array')
  process.exit(1)
}
if (!Array.isArray(incoming.courses)) {
  console.error('Incoming file does not contain courses array')
  process.exit(1)
}

const maxExistingId = existing.courses.length ? Math.max(...existing.courses.map(c => Number(c.id) || 0)) : 0
let nextId = maxExistingId

// Shift incoming IDs to continue from nextId+1
const shifted = incoming.courses.map(course => {
  nextId += 1
  return Object.assign({}, course, { id: nextId })
})

const mergedCourses = existing.courses.concat(shifted)

// Update export_date and total_courses
const now = new Date()
const exportDate = now.toISOString().replace('T', ' ').split('.')[0]

existing.export_date = exportDate
existing.total_courses = mergedCourses.length
existing.courses = mergedCourses

// Backup existing file first
try {
  fs.copyFileSync(existingFile, existingFile + '.bak')
  console.log('Backup created:', existingFile + '.bak')
} catch (e) {
  console.warn('Could not create backup:', e.message)
}

// Write merged file
fs.writeFileSync(existingFile, JSON.stringify(existing, null, 2), 'utf8')
console.log('Merged', incoming.courses.length, 'courses. New total:', existing.total_courses)
console.log('IDs assigned from', maxExistingId + 1, 'to', nextId)
