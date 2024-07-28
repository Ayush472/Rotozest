// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Rotozest Industries - High-quality rotary gear pumps for industrial, pharmaceutical, and food applications."
        />
        <meta
          name="keywords"
          content="Rotary gear pump, Stainless steel pump, Self-priming pump, Positive displacement pump, Industrial pumps, SS-316 pump, Viscous liquid pump, Food product pump, Pharmaceutical pump, Chemical pump"
        />
        <meta name="author" content="Rotozest Industries" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
