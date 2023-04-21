const { nanoid } = require('nanoid')
const notes = require('./notes')

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload
  const id = nanoid(16)
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const newNote = {
    id, title, tags, body, createdAt, updatedAt
  }

  notes.push(newNote)

  const isSuccess = notes.filter(note => note.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllNotesHandler = (request, h) => ({
  status: 'success',
  data: {
    notes
  }
})

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params
  const note = notes.filter(note => note.id === id)[0]

  if (note !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        note
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan'
  })

  response.code(404)
  return response
}

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params
  const { title, body, tags } = request.payload
  const updatedAt = new Date().toISOString()

  const index = notes.findIndex(note => note.id === id)

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      body,
      tags,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal diperbarui, ID tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params
  const deletedNoteIndex = notes.findIndex(note => note.id === id)

  if (deletedNoteIndex !== -1) {
    notes.splice(deletedNoteIndex, 1)
    const response = h.response({
      status: 'success',
      message: 'Note berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menghapus note'
  })
  response.code(404)
  return response
}

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
}
