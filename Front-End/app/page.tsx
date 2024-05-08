import { count } from "console"
import { Metadata } from "next"

export const metadata: Metadata ={
  title: 'Home Page',
}

export default function Home() {
  return (
    <main className="">
      <h1>HOME PAGE</h1>
    </main>
  )
}
