import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="h-full bg-black text-white">
          <SignedOut>
            <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">Welcome to Ancient Gains</h1>
              <SignInButton mode="modal">
                <button className="text-blue-400 hover:text-blue-300 text-base sm:text-lg transition duration-300 ease-in-out transform hover:scale-105">
                  Sign In
                </button>
              </SignInButton>
            </main>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col min-h-screen">
              <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Ancient Gains</Link>
                <div className="flex items-center space-x-4">
                  <Link href="/" className="hover:text-blue-300">Home</Link>
                  <Link href="/profile" className="hover:text-blue-300">Profile</Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </nav>
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}