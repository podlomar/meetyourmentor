export const metadata = {
  title: 'Meet Your Mentor',
  description: 'A mentorship matching app for students and proffessionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
