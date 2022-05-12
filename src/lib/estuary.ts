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
  file: File,
  onprogress: (event: Event) => {}
) {
  const data = new FormData()
  data.append('data', file)
  const request = new XMLHttpRequest()
  request.upload.onprogress = onprogress
  window.Main.send('message', file.path)
  request.open(
    'POST',
    `https://api.estuary.tech/content/add?collection=${userId}?collectionPath=${file.path}`
  )
  request.setRequestHeader('Authorization', `Bearer ${ESTUARY_API_KEY}`)
  request.send(data)
}
