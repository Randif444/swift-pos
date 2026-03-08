import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          button, 
          [role="button"], 
          a, 
          input[type="submit"], 
          input[type="button"],
          .cursor-pointer {
            cursor: pointer !important;
          }
          
         
          button:disabled,
          [disabled] {
            cursor: not-allowed !important;
          }
        `,
          }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
