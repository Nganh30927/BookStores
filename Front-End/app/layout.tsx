import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { NextAuthProvider } from '../providers/authProviders'
import UserInfo from '../components/UserInfo'
import Header from './header/page'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAuthProvider>
    <html lang="en">
      <body className={inter.className}>
        <header className='bg-indigo-500 text-white'>
          <Header/>
          
        </header>
        <main className='container mx-auto my-5'>
        {children}
        </main>
        <footer className='bg-slate-900 text-white'>
          <div className='container mx-auto'>
            footer
          </div>
        </footer>
        </body>
    </html>
    </NextAuthProvider>
  )
}