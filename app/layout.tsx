import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swift POS | Modern Retail Management",
  description:
    "Modern POS and inventory management system for growing retail businesses. Kelola toko, pantau stok, dan kembangkan bisnis Anda dalam satu platform.",
  icons: {
    icon: "/favicon.ico", // Opsional: pastikan Akang punya file favicon.ico di folder public
  },
};
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
