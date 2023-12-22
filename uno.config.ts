import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer @hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-80 transition duration-200 ease-in-out @hover:opacity-100 @hover:text-teal-600'],
    ['flex-center', 'flex justify-center items-center'],
    ['inline-flex-center', 'inline-flex justify-center items-center'],
  ],
  theme: {
    boxShadow: {
      iu: '0 1px 2px -2px rgb(0 0 0 / 8%), 0 3px 6px 0 rgb(0 0 0 / 6%), 0 5px 12px 4px rgb(0 0 0 / 4%)',
      iud: '0 1px 2px -2px rgb(255 255 255 / 8%), 0 3px 6px 0 rgb(255 255 255 / 6%), 0 5px 12px 4px rgb(255 255 255 / 4%)',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        custom: {
          new: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 20q-.825 0-1.412-.587T1 18V6q0-.825.588-1.412T3 4h18q.825 0 1.413.588T23 6v12q0 .825-.587 1.413T21 20zm1.75-8.5l2.375 3.25q.075.125.2.188T7.6 15h.3q.25 0 .425-.175T8.5 14.4V9.625q0-.275-.175-.45T7.875 9q-.275 0-.45.175t-.175.45V12.5L4.925 9.25q-.1-.125-.225-.187T4.425 9h-.3q-.275 0-.45.175t-.175.45v4.75q0 .275.175.45t.45.175q.275 0 .45-.175t.175-.45zM10 15h2.875q.275 0 .45-.175t.175-.45q0-.275-.175-.45t-.45-.175H11v-1.1h1.875q.275 0 .45-.175t.175-.45q0-.275-.175-.45t-.45-.175H11v-1.15h1.875q.275 0 .45-.175t.175-.45q0-.275-.175-.45T12.875 9H10q-.2 0-.35.15t-.15.35v5q0 .2.15.35T10 15m5.5 0h4q.425 0 .713-.288T20.5 14V9.625q0-.275-.175-.45T19.875 9q-.275 0-.45.175t-.175.45V13.5h-1.1v-2.875q0-.275-.175-.45t-.45-.175q-.275 0-.45.175t-.175.45V13.5h-1.15V9.625q0-.275-.175-.45T15.125 9q-.275 0-.45.175t-.175.45V14q0 .425.288.713T15.5 15"/></svg>',
          lock: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1q2.075 0 3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm0-2h12V10H6zm6-3q.825 0 1.413-.587T14 15q0-.825-.587-1.412T12 13q-.825 0-1.412.588T10 15q0 .825.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3q-1.25 0-2.125.875T9 6zM6 20V10z"/></svg>',
          lockopen: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M6 20h12V10H6zm6-3q.825 0 1.413-.587T14 15q0-.825-.587-1.412T12 13q-.825 0-1.412.588T10 15q0 .825.588 1.413T12 17m-6 3V10zm0 2q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h7V6q0-2.075 1.463-3.537T18 1q1.775 0 3.1 1.075t1.75 2.7q.125.425-.162.825T22 6q-.425 0-.7-.175t-.4-.575q-.275-.95-1.062-1.6T18 3q-1.25 0-2.125.875T15 6v2h3q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22z"/></svg>',
        },
      },
    }),
    presetTypography(),
    // presetWebFonts(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
