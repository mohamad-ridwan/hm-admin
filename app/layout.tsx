import { Metadata } from 'next'
import './globals.css'
import { Mulish } from 'next/font/google'
import { firstLogo } from 'lib/firebase/firstlogo'
import { Navbar } from 'components/navbar/Navbar'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { NavLeft } from 'components/navLeft/NavLeft'
import { NavLeftMobile } from 'components/navLeft/NavLeftMobile'
import { Alerts } from 'components/popup/Alerts'

config.autoAddCss = false

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish'
})

export const metadata: Metadata = {
  icons: {
    icon: [{ url: firstLogo }, new URL(firstLogo)],
    shortcut: firstLogo,
    apple: [
      { url: firstLogo },
      { url: firstLogo, sizes: '180x180', type: 'image/webp' }
    ],
    other: {
      rel: 'icon',
      url: firstLogo,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mulish.variable} font-mulish`}>
      <body className="bg-bgp-default">
        <Alerts />
        <Navbar />
        <NavLeft />
        <NavLeftMobile />
        {children}
      </body>
    </html>
  )
}