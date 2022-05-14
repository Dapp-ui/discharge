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
