import './globals.css'

export const metadata = {
  title: {
    default: 'Jozi Directories | Find Local Businesses in Johannesburg',
    template: '%s | Jozi Directories',
  },
  description: 'Find trusted local businesses in Johannesburg and Gauteng. Real listings, real ratings, real contact details.',
  keywords: ['johannesburg businesses', 'joburg directory', 'gauteng services', 'local businesses johannesburg'],
  openGraph: { type: 'website', locale: 'en_ZA', siteName: 'Jozi Directories' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
