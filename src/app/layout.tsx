import 'styles/global.scss';
import logo from './logo.svg';
import Image from "next/image";

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
      <body>
        <div className='container'>
          <Image src={logo} alt="logo" width={50}></Image>
          {children}
        </div>
      </body>
    </html>
  )
}
