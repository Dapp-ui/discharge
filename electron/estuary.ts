import crypto from 'crypto'
import fs from 'fs'
import { join } from 'path'
import FormData from 'form-data'
import axios from 'axios'
import { Agent } from 'https'
import fetch from 'electron-fetch'
import { pipeline } from 'stream'
import concat from 'concat-stream'

export const ESTUARY_API_KEY = 'ESTdaeabaa9-1bf5-47ac-9c85-d159f4761f84ARY'

export async function getItems(userId: string, path: string) {
  const request = await fetch(
    `https://api.estuary.tech/collections/fs/list?col=${userId}&dir=${path}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ESTUARY_API_KEY}`,
      },
    }
  )
  return await request.json()
}

export async function deleteItem(userId: string, file: any) {
  await fetch(
    `https://api.estuary.tech/collections/fs/add?col=${userId}&content=${file.contId}&path=/${userId}/${file.name}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ESTUARY_API_KEY}`,
      },
    }
  )
}

export async function uploadFile(
  userId: string,
  file: string,
  path: string,
  onprogress: (event: ProgressEvent) => void
) {
  try {
    const form = new FormData()
    form.append('data', fs.createReadStream(file))
    await axios.post(
      `https://shuttle-4.estuary.tech/content/add?collection=${userId}&collectionPath=${path.replace(
        /\\/g,
        '%2F'
      )}`,
      form,
      {
        httpsAgent: new Agent({
          rejectUnauthorized: false,
        }),
        headers: {
          Authorization: `Bearer ${ESTUARY_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onprogress,
      }
    )
  } catch (error) {
    console.error(error)
  }
}

const IV_LENGTH = 16

export async function encrypt(path: string, key: string, out: string) {
  const name = path.substring(path.lastIndexOf('\\') + 1)
  const bytes = Buffer.from(key).slice(0, 32)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', bytes, iv)
  const input = fs.createReadStream(path)
  const output = fs.createWriteStream(join(out, name + '.enc'))
  const pipe = pipeline(input, cipher, output, (err: any) => console.error(err))
  await new Promise(fulfill => pipe.on('finish', fulfill))
  return join(out, name + '.enc')
}
