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
