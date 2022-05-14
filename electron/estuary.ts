import crypto from 'crypto'
import fs from 'fs'
import { join } from 'path'
import FormData from 'form-data'
import axios from 'axios'
import { Agent } from 'https'
import fetch from 'electron-fetch'

export const ESTUARY_API_KEY = 'ESTdaeabaa9-1bf5-47ac-9c85-d159f4761f84ARY'

export async function getFiles(userId: string) {
  const request = await fetch(
    `https://api.estuary.tech/collections/content/${userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ESTUARY_API_KEY}`,
      },
    }
  )
  return await request.json()
}

export async function uploadFile(
  userId: string,
  file: string,
  path: string,
  onprogress: (event: Event) => void
) {
  const data = new FormData()
  data.append('data', fs.createReadStream(file))
  try {
    await axios.post(
      `https://shuttle-4.estuary.tech/content/add?collection=${userId}&collectionPath=${path.replace(
        /\\/g,
        '%2F'
      )}`,
      data,
      {
        httpsAgent: new Agent({
          rejectUnauthorized: false,
        }),
        headers: {
          ...data.getHeaders(),
          Authorization: `Bearer ${ESTUARY_API_KEY}`,
        },
        onUploadProgress: onprogress,
      }
    )
  } catch (error) {
    console.error(error)
  }
}

const IV_LENGTH = 16

export function encrypt(path: string, key: string, out: string) {
  const name = path.substring(path.lastIndexOf('\\') + 1)
  const bytes = Buffer.from(key).slice(0, 32)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', bytes, iv)
  const input = fs.createReadStream(path)
  const output = fs.createWriteStream(join(out, name + '.enc'))
  input.pipe(cipher).pipe(output)
  return join(out, name + '.enc')
}
