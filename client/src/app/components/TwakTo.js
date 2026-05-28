"use client";

import Script from "next/script";

export default function TawkTo() {
  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`
        var Tawk_API = Tawk_API || {}, 
            Tawk_LoadStart = new Date();

        (function () {
          var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];

          s1.async = true;
          s1.src = 'https://embed.tawk.to/69f87ef3d21eb31c2f61e99c/1jnpavq4c';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');

          s0.parentNode.insertBefore(s1, s0);
        })();

        // When widget loads
        Tawk_API.onLoad = function () {

          // Move widget to LEFT side
          Tawk_API.setAttributes({}, function(error){});

          var style = document.createElement('style');
          style.innerHTML = \`
            iframe[title="chat widget"] {
              left: 20px !important;
              right: auto !important;
              bottom: 20px !important;
              z-index: 999 !important;
            }

            iframe[title="chat widget mobile button"] {
              left: 20px !important;
              right: auto !important;
              z-index: 999 !important;
            }
          \`;

          document.head.appendChild(style);
        };
        Tawk_API.onLoad = function () {
  Tawk_API.setPosition('bl'); // bottom-left
 };
        // Global functions
        window.hideTawk = function () {
          if (window.Tawk_API) {
            window.Tawk_API.hideWidget();
          }
        };

        window.showTawk = function () {
          if (window.Tawk_API) {
            window.Tawk_API.showWidget();
          }
        };
      `}
    </Script>
  );
}