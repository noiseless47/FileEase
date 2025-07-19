import localFont from 'next/font/local';

// Load DM Sans font using variable font file
export const dmSans = localFont({
  src: [
    {
      path: '../../public/fonts/DMSans-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/DMSans-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    }
  ],
  variable: '--font-dm-sans',
  display: 'swap',
}); 