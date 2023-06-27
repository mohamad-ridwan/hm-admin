import { Metadata } from 'next'
import './globals.css'
import { Mulish } from 'next/font/google'
import { firstLogo } from 'lib/logoweb/firstlogo'
import { AuthWrapper } from 'components/AuthWrapper'
import { IsLoggedIn } from 'components/IsLoggedIn'
import { Navbar } from 'components/navbar/Navbar'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { NavLeft } from 'components/navLeft/NavLeft'
import { NavLeftMobile } from 'components/navLeft/NavLeftMobile'

config.autoAddCss = false

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish'
})

export const metadata: Metadata = {
  // title: 'Hospice Medical Admin',
  // description: 'dashboard hospice medical admin',
  icons: {
    icon: [{ url: firstLogo }, new URL(firstLogo)],
    shortcut: firstLogo,
    apple: [
      { url: firstLogo },
      { url: firstLogo, sizes: '180x180', type: 'image/png' }
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
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mulish.variable} font-mulish`}>
      <body className="bg-bgp-default">
        <IsLoggedIn>
          <AuthWrapper>
            <Navbar />
            <NavLeft />
            <NavLeftMobile/>
            {children}
          </AuthWrapper>
        </IsLoggedIn>
      </body>
    </html>
  )
}