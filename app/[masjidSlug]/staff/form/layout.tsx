import type React from "react"

type Props = {
  children: React.ReactNode
}

export default function FormLayout({ children }: Props) {
  return <>{children}</>
}