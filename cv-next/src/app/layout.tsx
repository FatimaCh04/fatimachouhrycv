import type { Metadata } from 'next';
import { getProfile } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fatima Choudhry | Portfolio',
  description: 'Software Engineering Student — Building scalable automation and custom software solutions.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-900 text-slate-200 antialiased">
        <div className="flex min-h-screen">
          <Sidebar profile={profile} />
          <main className="flex-1 ml-72 p-8">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
