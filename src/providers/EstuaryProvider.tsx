import { useState, useEffect, useContext, createContext } from 'react'

type Preferences = {
  path: string
  uid: string
  key: string
}

const EstuaryContext = createContext<any>(null)

export function useEstuary() {
  return useContext(EstuaryContext)
}

export function EstuaryProvider({ children }: any) {
  const [files, setFiles] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFiles(window.Main.sendSync('app:files:get'))
    setLoaded(true)
    window.Main.on('client:files:updated', (data: any) => {
      setFiles(data)
    })
  }, [])

  return (
    <EstuaryContext.Provider value={{ files: files, loaded: loaded }}>
      {children}
    </EstuaryContext.Provider>
  )
}
