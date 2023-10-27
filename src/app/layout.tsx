import 'styles/global.scss';

export const metadata = {
  title: 'Meet Your Mentor',
  description: 'A mentorship matching app for students and professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-32.png" sizes="32x32" />
        <link rel="icon" href="/icon-128.png" sizes="128x128" />
        <link rel="icon" href="/icon-180.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" />
      </head>
      <body>
        <div className='container'>
          {children}
        </div>
      </body>
    </html>
  )
}
