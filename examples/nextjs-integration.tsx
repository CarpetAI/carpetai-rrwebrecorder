// Example: How to replace your current SessionRecorder with the package
// app/layout.tsx

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/PostHogProvider";
import { SessionRecorder } from '@carpetai/rrweb-recorder';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased">
          <main className="flex flex-col min-h-screen">
            {children}
          </main>
          <Toaster />
          <SessionRecorder 
            apiKey={process.env.NEXT_PUBLIC_SESSION_API_KEY}
            excludePaths={['/session-replays']}
            maxSessionDuration={30 * 60 * 1000} // 30 minutes
            maxEventsPerSession={10000}
            saveInterval={5000} // 5 seconds
          />
        </body>
      </html>
    </ClerkProvider>
  );
} 